// Game code goes here:
document.addEventListener('DOMContentLoaded', (event) => {
    // Attach event listeners to answer options
    document.querySelectorAll('.game_option').forEach(option => {
        option.addEventListener('click', function() {
            // Handle answer selection
            handleAnswerSelection(this);
        });
    });
});

function handleAnswerSelection(selectedOption) {
    // Logic to determine selected answer and send it to the server

    // Get next question index from the server response
    let nextQuestionIndex = /* get from server response */;

    if (nextQuestionIndex !== null) {
        // Redirect to next question
        window.location.href = '/game/[gameName]/' + nextQuestionIndex;
    } else {
        // End of game, handle score and display end game screen
        // Display final score and options to restart or return to homepage
    }
}
