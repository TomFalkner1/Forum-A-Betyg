const express = require('express')
const app = express()
const port = 8400
const path = require('path')
const bodyparser = require("body-parser")
const { engine } = require("express-handlebars")


app.engine("handlebars", engine())
app.set('view engine', 'handlebars')

app.set("views", "./views") //Talar om att alla mallar/templates/vyer ligger i mappen views.
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:false}))

app.get('/', (req, res) => {
  res.render('index');

})

app.get('/science', (req, res) => {
    res.render('science'); // Renders the science.handlebars template
  });

  app.get("/users", async (req, res) => {
    const users = await db.getUsers() // Hämtar alla users ur databasen
  
    //Säger att vyn users ska användas och man sickar med
    //ett objekt som har en egenskap, "users", som är en array med alla users.
    //Det objektet kan användas av mallen/templaten/vyn.
    res.render("users", { users })
  })

app.get("/posts", async (req, res) => {
    const userId = req.query.userId
    const posts = await db.getPostsByUserId(userId)
    res.render("posts", { userId, posts })
  })


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})

console.log("test")