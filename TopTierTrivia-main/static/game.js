// Hide modal popups by default
var levelEndBackdrop = document.getElementById('level_end_backdrop')
if (levelEndBackdrop)
    levelEndBackdrop.classList.add('hidden')
var gameEndBackdrop = document.getElementById('game_end_backdrop')
if (gameEndBackdrop)
    gameEndBackdrop.classList.add('hidden')

// Attach event listeners to answer options
document.querySelectorAll('.game_option').forEach(option => {
    option.addEventListener('click', function() {
        // Handle answer selection
        handleAnswerSelection(this);
    });
});

function handleAnswerSelection(selectedOption) {
    // Logic to determine selected answer and send it to the server

    // Get next question index from the server response
    // let nextQuestionIndex = /* get from server response */;

    if (nextQuestionIndex !== null) {
        // Redirect to next question
        window.location.href = '/game/[gameName]/' + nextQuestionIndex;
    } else {
        // End of game, handle score and display end game screen
        // Display final score and options to restart or return to homepage
    }
}
