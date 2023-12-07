
var infoBoxes = document.getElementsByClassName("option_info_container")
// Start all info boxes hidden
for (let i = 0; i < infoBoxes.length; i++)
    infoBoxes[i].classList.add("hidden")

// Makes info buttons enable their respective info boxes
document.getElementById("game_select_options").addEventListener("click", event => {

    // Check if info button
    if (event.target.closest(".option_info_button"))
    {
        let container = event.target.closest(".option_contents").getElementsByClassName("option_info_container")[0]

        // Toggle its info box
        container.classList.toggle("hidden")

        // Close all other info boxes
        for (let i = 0; i < infoBoxes.length; i++)
            if (infoBoxes[i] != container)
                infoBoxes[i].classList.add("hidden")

        event.stopPropagation()
    }
    // Check if info close button
    if (event.target.closest(".option_info_close_button"))
    {
        let container = event.target.closest(".option_info_container")
        
        // Close its info box
        container.classList.add("hidden")

        event.stopPropagation()
    }
})
