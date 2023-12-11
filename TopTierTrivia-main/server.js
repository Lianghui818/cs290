
var port = process.env.PORT || 3000

var express = require('express')
var exphbs = require('express-handlebars')
var fs = require('fs')

var app = express()

app.engine("handlebars", exphbs.engine({ defaultLayout: 'toptier' }))
app.set("view engine", "handlebars")

// Loads all game options
var game_options = require('./data/games.json')

// Loads all game data
var gameData = { }
fs.readdir('./data/', (err, files) => {
    if (err) {
        console.log('Error while loading data directory')
        return
    }

    console.log("+ Files in data directory: " + files)
    
    // Interpret each non-games.json file as JS object
    files.forEach(file => {
        if (file != 'games.json') {
            var gameName = file.substring(0, file.lastIndexOf('.'))
            console.log('reading game file of game ' + gameName + ': ' + file)
            gameData[gameName.toLowerCase()] = require('./data/' + file)
        }
    })
})

// Serve default page as title page
app.get('/', (req, res) => {
    console.log("- Sending title page to client")

    res.status(200).render('titlePage', {
        game_options: game_options,
        script: '/startmenu.js'
    })
})

// Helper function for serving game pages
function serveGamePage(res, next, name, qIndex) {
    // Check if game exists
    var game = gameData[name.toLowerCase()]
    // if (game && qIndex >= 0 && qIndex < game.length)
    // {
    //     console.log("- Sending game page of (" + game + "), index: (" + qIndex + ") to client")

    //     // If found, serve that game's page
    //     res.status(200).render('gamePage', {
    //         question: game[qIndex].question,
    //         name1: game[qIndex].name1,
    //         url1: game[qIndex].url1,
    //         name2: game[qIndex].name2,
    //         url2: game[qIndex].url2,
    //         script: '/game.js'
    //     })
    // }

    if (!game) {
        next(); // Game not found, move to next middleware
        return;
    }

    var totalQuestions = game.length; // Assuming game is an array of questions

    if (qIndex >= 0 && qIndex < totalQuestions) {
        console.log("- Sending game page of (" + name + "), index: (" + qIndex + ") to client");

        res.status(200).render('gamePage', {
            question: game[qIndex].question,
            name1: game[qIndex].name1,
            url1: game[qIndex].url1,
            name2: game[qIndex].name2,
            url2: game[qIndex].url2,
            script: '/game.js',
            nextQuestionIndex: qIndex + 1 < totalQuestions ? qIndex + 1 : null // Pass next question index or null if it's the last question
        });
    }
    else
    {
        // If not found, pass on
        next()
    }
}

// Serve default game page
app.get('/game/:name', (req, res, next) => {
    serveGamePage(res, next, req.params.name, 0)
})

// Serve game page with certain question index
app.get('/game/:name/:qIndex', (req, res, next) => {
    // Parse index
    var qIndex = parseInt(req.params.qIndex)
    if (qIndex != null)
    {
        // Serve page if index is valid
        serveGamePage(res, next, req.params.name, qIndex)
    }
    else
    {
        next()
    }
})

// Serving static content
app.use(express.static('static'))

// Serving default 404 fallback
app.get('*', (req, res) => {
    console.log("- Sending 404 to client. Requested URL: " + req.url)

    res.status(404).render('404')
})

// Starts server
app.listen(port, () => {
    console.log("Server now running on port " + port)
})
