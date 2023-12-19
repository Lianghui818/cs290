
var port = process.env.PORT || 3000

var express = require('express')
var exphbs = require('express-handlebars')
var fs = require('fs')

var app = express()

app.engine("handlebars", exphbs.engine({ defaultLayout: 'toptier' }))
app.set("view engine", "handlebars")

app.use('/game/update', express.json())
app.use('/static', express.static('static'));
app.use('/data/images', express.static('data/images'));
// Doesn't need to serve data directly. Does so through other GET methods

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
        if (file.substring(file.lastIndexOf('.')) == '.json' && file != 'games.json') {
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

// Serve specific game questions
app.get('/game/:name/:qIndex', (req, res, next) => {
    // Parse index
    var qIndex = parseInt(req.params.qIndex)
    if (qIndex != null && qIndex >= 0)
    {
        // Check if game is real
        let name = req.params.name
        var game = gameData[name.toLowerCase()]

        if (game)
        {
            // If requesting index out of bounds, then the client doesn't yet know the game is complete
            if (qIndex >= game.length) {
                console.log("- Sending end-of-game info for game: " + name)

                // Calculate total accuracy
                let totalCorrect = 0
                let totalIncorrect = 0
                for (let i = 0; i < game.length; i++) {
                    totalCorrect += game[i].correctAnswers
                    totalIncorrect += game[i].incorrectAnswers
                }

                // Send that to the client
                res.status(200).send(
                    {
                        gameEndData: true,
                        gameName: name,
                        totalCorrect: totalCorrect,
                        totalIncorrect: totalIncorrect
                    })
            }
            else {
                // Send question data if index is valid
                console.log("- Sending question #" + qIndex + " of game " + name)
                res.status(200).send(game[qIndex])
            }
            return;
        }
    }

    next()
})


// For receiving update notices when a user answers a question
app.post('/game/update/:name', (req, res, next) => {
    // Check if game is valid
    let name = req.params.name
    var game = gameData[name.toLowerCase()]
    if (game)
    {
        // Check if index is valid
        let qIndex = parseInt(req.body.questionIndex)
        if (qIndex != null && qIndex >= 0 && qIndex < game.length)
        {
            // Then increment the proper counter
            if (req.body.wasCorrect)
                game[qIndex].correctAnswers++
            else
                game[qIndex].incorrectAnswers++
            console.log('- Received increment request from client on game: ' + name)
         
            // sending the question to the server
            res.status(200).send(game[qIndex])
            
            
            // Also, re-save the JSON file because we've now changed the game data
            fs.writeFile('./data/' + name + '.json',
                // File string data
                JSON.stringify(game, null, '\t')
                .replaceAll( // This formats it so it's still human readable
                    "],\n\t\"",
                    "],\n\n\t\""),

                // Callback function
                function (err) {
                    if (err)
                        console.log('- Error saving game .json file: ' + err)
                    else
                        console.log('- Successfully saved updated game .json file')
                })
            return
        }
    }
    next()
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
