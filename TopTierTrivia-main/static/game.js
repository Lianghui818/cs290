
// // Hide modal popups by default
// var levelEndBackdrop = document.getElementById('level_end_backdrop')
// if (levelEndBackdrop)
//     levelEndBackdrop.classList.add('hidden')
// var gameEndBackdrop = document.getElementById('game_end_backdrop')
// if (gameEndBackdrop)
//     gameEndBackdrop.classList.add('hidden')

// // Attach event listeners to answer options
// document.querySelectorAll('.game_option').forEach(option => {
//     option.addEventListener('click', function() {
//         // Handle answer selection
//         handleAnswerSelection(this);
//     });
// });

// function handleAnswerSelection(selectedOption) {
//     // Logic to determine selected answer and send it to the server

//     // Get next question index from the server response
//     // let nextQuestionIndex = /* get from server response */;

//     if (nextQuestionIndex !== null) {
//         // Redirect to next question
//         window.location.href = '/game/[gameName]/' + nextQuestionIndex;
//     } else {
//         // End of game, handle score and display end game screen
//         // Display final score and options to restart or return to homepage
//     }
// }

// Load questions from movieMayhem.json
var questions = [];
fetch('/data/movieMayhem.json')  // Replace with the correct path to your movieMayhem.json
    .then(response => response.json())
    .then(data => {
        questions = data;
        attachEventListeners();
    });

// Function to attach event listeners to options
function attachEventListeners() {
    document.querySelectorAll('.game_option').forEach((option, index) => {
        option.addEventListener('click', function() {
            handleAnswerSelection(this, index);
        });
    });
}

// Updated handleAnswerSelection function
function handleAnswerSelection(selectedOption, questionIndex) {
    var selectedAnswer = selectedOption.getAttribute('data-answer');  // Ensure your options have data-answer attributes
    var isCorrect = selectedAnswer === questions[questionIndex].correctAnswer;

    // Show feedback here (e.g., alert or a modal)
    alert(isCorrect ? "Correct!" : "Wrong!");

    // Navigate to next question or end the game if it's the last question
    var nextQuestionIndex = questionIndex + 1;
    if (nextQuestionIndex < questions.length) {
        window.location.href = '/game/[gameName]/' + nextQuestionIndex;
    } else {
        // Handle end of the game (e.g., show score)
        alert("End of the game!");
    }
}

// Call this function initially to start the game
loadQuestions();
