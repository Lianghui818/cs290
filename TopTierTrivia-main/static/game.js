
// Hide modal popups by default
var levelEndBackdrop = document.getElementById('level_end_backdrop')
if (levelEndBackdrop)
    levelEndBackdrop.classList.add('hidden')
var gameEndBackdrop = document.getElementById('game_end_backdrop')
if (gameEndBackdrop)
    gameEndBackdrop.classList.add('hidden')

// Figure out what game it's actually supposed to be playing
var gameName = window.location.href
gameName = gameName.substring(gameName.lastIndexOf('/') + 1)
console.log("The game we're playing is: " + gameName)

// For storing question data & such later
var currQuestion = null;
var currQuestionIndex = -1;
var currentlyWaitingOnServer = false;
var timesCorrect = 0;
var timesIncorrect = 0;


function attachEventListeners() {
    // Add listeners to answer buttons
    document.getElementById('option1').addEventListener('click', function() {
        handleAnswerSelection(true);
    });
    document.getElementById('option2').addEventListener('click', function() {
        handleAnswerSelection(false);

    });

    // Add listeners to 'next question' button
    document.getElementById('next_question_button').addEventListener('click', function() {
        handleGoToNextQuestion()
    })

    // Add listeners to quit button
    let quitButtons = document.getElementsByClassName('quit_button')
    for (let i = 0; i < quitButtons.length; i++)
        quitButtons[i].addEventListener('click', function() {
            // Just redirect to home page
            window.location.replace('/');
        });
}

function handleAnswerSelection(isFirstAnswer) {
    // Don't try to do anything if it's still waiting on the server for the next question
    if (currentlyWaitingOnServer) {
        console.log("Can't answer question now! Because still waiting on server")
        return
    }
    // OR if the current question isn't loaded
    if (!currQuestion) {
        console.log("Can't answer question now! Because none is loaded!")
        return
    }

    // Calculate correctness
    var isCorrect = isFirstAnswer == currQuestion.answer1Correct;
    console.log("Was correct: " + isCorrect + ", because " +
        (currQuestion.answer1Correct ? "answer 1" : "answer 2") +
        " was correct and you chose " +
        (isFirstAnswer ? "answer 1" : "answer 2"))

    // Increment internal counters
    if (isCorrect)
        timesCorrect++
    else
        timesIncorrect++

    // Inform the player that they got it correct/wrong
    fetch('/game/update/' + gameName, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({
            wasCorrect: isCorrect,
            questionIndex: currQuestionIndex
        })
    }).then(response => {
        if (response.ok)
            console.log('Increment request received successfully by server')
        else {
            console.log('ERROR: increment request to server not ok:')
            console.log(response)
        }
    })

    // Show question results screen
    applyQuestionResultsToHTML(currQuestion,
        isFirstAnswer ? currQuestion.name1 : currQuestion.name2,
        isCorrect)
    levelEndBackdrop.classList.remove('hidden')
}

function handleGoToNextQuestion() {
    // Ask server for info on next question (or for game end)
    loadAndApplyNewQuestion(currQuestionIndex + 1,
        function (questionData) { // Handler for next question
            levelEndBackdrop.classList.add('hidden')
        },
        function (gameEndData) { // Handler for game ending
            applyGameResultsToHTML(gameEndData)
            levelEndBackdrop.classList.add('hidden')
            gameEndBackdrop.classList.remove('hidden')
        })
}

// Asks the server for question data and applies it to the page
function loadAndApplyNewQuestion(questionIndex, onQuestionLoad = null, onGameEnd = null) {
    if (currentlyWaitingOnServer) {
        console.log('Could not ask server for next question, because already doing that.')
        return
    }
    
    currentlyWaitingOnServer = true;

    fetch('/game/' + gameName + '/' + questionIndex)  
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            currentlyWaitingOnServer = false;

            // Check if data is a question or game end data
            if (data.gameEndData) {
                
                if (onGameEnd)
                    onGameEnd(data);
            }
            else { // (if it's a question)
                currQuestion = data;
                currQuestionIndex = questionIndex;
                applyNewQuestionToHTML(data);
                if (onQuestionLoad)
                    onQuestionLoad(data);
            }
        })
        .catch(error => {
            console.error('Failed to load question:', error);
        });
}

// Takes a question's data and applies it to the page
var questionText = document.querySelector('.question_text h2')
var answerContainer1 = document.getElementById('option1')
var answerContainer2 = document.getElementById('option2')
function applyNewQuestionToHTML(questionData) {
    // Apply text of question
    questionText.textContent = questionData.question;

    // Apply answers to answer buttons
    function applyToOption(rootContainer, url, name) {
        let img = rootContainer.getElementsByTagName('img')[0]
        img.src = url
        img.alt = name
        rootContainer.getElementsByTagName('h3')[0].textContent = name
    }
    applyToOption(answerContainer1, questionData.url1, questionData.name1)
    applyToOption(answerContainer2, questionData.url2, questionData.name2)
}

// Applies the results of a question to the HTML (the next question modal)
var choiceText = document.getElementById('choice_text')
var levelSuccessStateText = document.getElementById('level_success_text')
var levelAnswerDetailsContainer = document.getElementById('level_answer_details_container')
var levelAnswerDetailsText = document.getElementById('level_answer_details_text')
var levelStatsText = document.getElementById('level_stats_text')
function applyQuestionResultsToHTML(questionData, chosenAnswer, wasCorrect) {
    // Display the player's choice
    choiceText.textContent = chosenAnswer

    // Display if the player succeeded or not
    if (wasCorrect) {
        levelSuccessStateText.textContent = 'Correct!'
    }
    else {
        levelSuccessStateText.textContent = 'Incorrect...'
    }

    // Display details about the answer, but only if they exist for this question
    if (questionData.answerDetails) {
        levelAnswerDetailsContainer.classList.remove('hidden')
        levelAnswerDetailsText.textContent = questionData.answerDetails
    } else {
        levelAnswerDetailsContainer.classList.add('hidden')
    }

    // Calculate & display the statistics of the level
    let totalAccuracy = questionData.correctAnswers
        / (questionData.correctAnswers + questionData.incorrectAnswers);
    levelStatsText.textContent =
        (totalAccuracy * 100).toLocaleString(undefined,
            { maximumFractionDigits: 0 })
        + '%';
}

// Applies the results of the entire game to the HTML (the game end modal)
var categoryText = document.getElementById('modal_category_text')
var selfAccuracyText = document.getElementById('self_accuracy_text')
var totalAccuracyText = document.getElementById('total_accuracy_text')
function applyGameResultsToHTML(gameEndData) {
    // Display the name of the category
    categoryText.textContent = gameEndData.gameName

    // Display the player's accuracy
    let selfAccuracy = timesCorrect / (timesCorrect + timesIncorrect);
    selfAccuracyText.textContent =
        (selfAccuracy * 100).toLocaleString(undefined,
            { maximumFractionDigits: 0 })
        + '%';
    
    // Display everyone's average accuracy
    let totalAccuracy = gameEndData.totalCorrect
        / (gameEndData.totalCorrect + gameEndData.totalIncorrect);
    totalAccuracyText.textContent =
        (totalAccuracy * 100).toLocaleString(undefined,
            { maximumFractionDigits: 0 })
        + '%';
}

loadAndApplyNewQuestion(0, attachEventListeners)

// Debugging
console.log('Game script loaded.');
