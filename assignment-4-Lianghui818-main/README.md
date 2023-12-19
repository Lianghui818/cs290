[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/PYO9veNN)
# Assignment 4
**Assignment and Code Blog Entry due at 11:59pm on Monday 11/20/2023**<br/>
**This assignment will not be demoed**

The goal of this assignment is to start to use Node.js and some of its built-in modules to build a very simple web server that serves static content and does some very basic dynamic content generation.

You are provided with several files in `static/` implementing the Benny's List site we've been working on throughout the course, with the exception of `index.js` (since you still have time to work on assignment 3 😉).  If you want, you can add your own `index.js` file from assignment 3 to add the client-side interactions you implemented, but it's not necessary to do this.  In addition to your familiar files, you're also provided with a file `404.html`, whose purpose we'll get to in a bit.

The file `server.js` is the file you'll work on for this assignment.  Your job is to complete that file to implement a very basic Node-based web server that satisfies the following requirements:

  * **Name and email:** First, add your name and oregonstate.edu email address to the header comment in `server.js`, so the TA grading your assignment knows who you are.

  * **Node build-ins only:** The server can only use Node's built-in modules (e.g. `http`, `fs`, `path`, etc.), no third-party modules.

  * **Server uses the `PORT` environment variable:** The server should listen for requests on the port specified by the environment variable `PORT`.  If `PORT` is not present in the environment, the server should listen on port 3000 by default.

  * **Server serves static content from the `static/` directory:** When someone requests a URL path from your server that corresponds to the name of one of the files in `static/` (including `404.html`), your server should respond with the contents of that file and a status code of 200.  In addition, the server's response should have the `Content-Type` header set to the appropriate value for the type of file being sent (i.e. `"text/html"` for an HTML file, `"text/css"` for a CSS file, `"application/javascript"` for a JS file, and `"image/jpeg"` for a JPEG image file).  For example, if you run your server on port 3000 on your laptop, you should be able to access the following files by entering the following URLs into your browser:
    * `static/index.html` - [http://localhost:3000/index.html](http://localhost:3000/index.html)
    * `static/index.js` - [http://localhost:3000/index.js](http://localhost:3000/index.js)
    * `static/style.css` - [http://localhost:3000/style.css](http://localhost:3000/style.css)
    * `static/404.html` - [http://localhost:3000/404.html](http://localhost:3000/404.html)
    * `static/benny.jpg` - [http://localhost:3000/benny.jpg](http://localhost:3000/benny.jpg)

    Note that if everything is hooked up correctly, your `index.html` and `404.html` pages will automatically have styles and interactions from `style.css` and `index.js` applied to them because the browser will see those files referenced from the HTML and make additional requests for those files.

  * **Server serves `index.html` for the root URL pathL** When someone requests the root URL path (i.e. `/`) from your server, it should respond with the contents of `static/index.html` and a status code of 200.  For example, if you run your server on port 3000 on your laptop and visit [http://localhost:3000](http://localhost:3000) in your laptop's browser, your server should send the contents of `static/index.html`.

  * **Server performs basic dynamic content generation:** If someone requests a URL path from your server that follows the pattern `/posts/<n>`, where `<n>` is some integer number, then it should respond with dynamically-generated HTML content that contains a message something like this: "You requested post #`<n>`" (replacing `<n>` with the actual number specified in the URL path).  Your dynamically-generated HTML doesn't have to be complicated.  For example, if someone requests the URL path `/posts/8` (e.g. by visiting the URL [http://localhost:3000/posts/8](http://localhost:3000/posts/8)), then your server could send back HTML that looks something like this:
      ```html
      <html>
        <body>
          <h1>You requested post #8.</h1>
        </body>
      </html>
      ```

      > Hint: To determine whether a URL path matches the `/posts/<n>` pattern, you can use [the `startsWith()` method from the JS `String` class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith).  To determine whether the URL path ends with an integer number, you can use either [the `String` class's `substring()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring) or [the `String` class's `replace() method`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) along with [`parseInt()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt).

  * **Server serves a 404 error:** If someone tries to visit a URL path on your site that does not correspond to the name of any of the files in `static/` and does not fit the `/posts/<n>` pattern described above, your server should respond with the contents of `static/404.html` and a status code of 404.  For example, if you run your server on port 3000 on your laptop and visit  [http://localhost:3000/thispagedoesnotexist](http://localhost:3000/thispagedoesnotexist) in your laptop's browser, your server should serve the contents of `static/404.html`.

  * **Server limits file reads:** Your server should read any given file in `static/` from disk only once.  In other words, the contents of each file should be stored in the server's memory (e.g. stored in a variable) after the first read, and the server should use this stored value when responding with a file's contents instead of reading the file a second time.  In other words, after you read a file from disk once, you should always read it from memory thereafter.  You should add a `console.log()` statement immediately before each call to read a file to prove to yourself that each file is being read only once.

Again, note that the contents of `index.js` in this repo are incomplete.  If you want to see the full Benny's List site in action, including the interactions you implemented for assignment 3, you can replace the contents of `static/index.js` with your `index.js` from assignment 3.  However, no part of your grade for this assignment will be based on changes to `index.js`.  For this assignment, it only matters that you correctly serve the contents of `static/index.js`, whatever they are.

## Tips/Hints

Here are a few tips/hints to help you out with the assignment:

  * One big difference between the HTML files in the `static/` directory for this assignment and the HTML files you've worked with for previous assignments is the URLs used to include CSS and JS files into the HTML.  In particular, in this assignment, the URLs all start with a slash, e.g.:
      ```html
      <link rel="stylesheet" href="/style.css" media="screen">
      ```
      instead of
      ```html
      <link rel="stylesheet" href="style.css" media="screen">
      ```
      This is an important change now that we'll be serving these files, but it'll mean that if you open the HTML files directly in your browser like you did before (i.e. opening them using a `file:///...` URL), you won't see the styles or JS applied.  That's OK.  Once you're properly serving the files, you should be able to see the styled pages again using `http://...` URLs like the ones above.

  * To see an example of essentially the way your server should behave (except for the dynamic content generation), you can use [the serve package from npm](https://www.npmjs.com/package/serve) to run a static server based on the contents of the `static/` directory.  This command will do that for newer versions of Node.js:
      ```
      npx serve ./static/
      ```
      Then, you can use URLs similar to the ones above to see the files from `static/` (note that serve runs on port 5000 by default).  This will give you an idea of what your own server should do.

## Code Blog

Add an entry to your Code Blog reflecting on your experience with this assignment.  Here are some questions you could answer (though these aren't the only ones):

  * What was challenging about the assignment, and what specific kinds of problems did you have.  How did you solve those problems?

  * What did you learn from the assignment?  Were there any special insights you had?  What did you find that you already knew?

  * What kinds of resources were helpful for completing the assignment?  Specific websites?  Lectures?  The class Piazza forum?  The TAs?  How did you use each of these resources?

  * What are one or two things you had to Google to complete the assignment?

## Submission

As always, we'll be using GitHub Classroom for this assignment, and you will submit your assignment via GitHub.  Just make sure your completed files are committed and pushed by the assignment's deadline to the main branch of the GitHub repo that was created for you by GitHub Classroom.  A good way to check whether your files are safely submitted is to look at the main branch your assignment repo on the github.com website (i.e. https://github.com/osu-cs290-f23/assignment-4-YourGitHubUsername/). If your changes show up there, you can consider your files submitted.

In addition to submitting your assignment via GitHub, you must submit the URL to your code blog entry (e.g. http://web.engr.oregonstate.edu/~YOUR_ONID_ID/cs290/blog.html) via Canvas by the due date specified above.

## Grading criteria

Only changes to `server.js` will be considered when grading this assignment.  Changes to other files will be ignored, though you should add the contents of your `index.js` from Assignment 3 to `static/index.js` to get the full effect of the assignment (your `index.js` won't actually be graded).  Note also that when grading, we will not run `npm install` to install third-party modules, so if you used third-party modules in your solution, it probably won't work, and you'll get a bad grade.

The assignment is worth 100 points total:

  * 10 points: server listens on the port specified by the environment variable `PORT` or 3000 by default.

  * 50 points: server serves files from `static/` with status 200 and correct `Content-Type` header when corresponding URL path is visited.
    * 10 points per file (including `404.html`): 8 points for correctly serving file content and 2 points for correct `Content-Type` header and 200 status code

  * 5 points: server serves `static/index.html` with status 200 when the root URL path (`/`) is visited.

  * 15 points: server serves correct dynamically-generated HTML when the requested URL path matches the pattern `/posts/<n>`, as described above.

  * 10 points: server serves `static/404.html` with status 404 when a URL path is visited that does not correspond to any file in `static/` and does not match the `/posts/<n>` pattern described above.

  * 10 points: server reads files in `static/` exactly once and caches them.
