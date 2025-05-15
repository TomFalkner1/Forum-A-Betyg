const express = require('express')
const app = express()
const port = 8400
const path = require('path')
const bodyparser = require("body-parser")
const { engine } = require("express-handlebars")
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


async function getDBConnnection() {
  // Här skapas ett databaskopplings-objekt med inställningar för att ansluta till servern och databasen.
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "databas-forum",
  });
}


var session = require('express-session');

app.use(session({
  secret: 'superhemligt',          // Byt till något eget i produktion
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 5           // 5 minuter i millisekunder
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

function authMiddleware(req, res, next) {
  if (req.session.user) {
    next(); // släpp igenom
  } else {
    res.redirect('/login'); // skicka till login om inte inloggad
  }
}

app.engine("handlebars", engine())
app.set('view engine', 'handlebars')

app.set("views", "./views") //Talar om att alla mallar/templates/vyer ligger i mappen views.
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:false}))

app.get('/', (req, res) => {
  res.render('index');

})

app.get('/science', async (req, res) => {
  const connection = await getDBConnnection();
  const [messages] = await connection.execute(
    'SELECT * FROM chat_messages WHERE room_id = ? ORDER BY created_at DESC',
    [1] // or req.query.room_id or however you determine the room
  );

  res.render('science', {
  user: req.session.user,
  room_id: 1,
  messages
});
});

app.get('/art', async (req, res) => {
  const connection = await getDBConnnection();
  const [messages] = await connection.execute(
    'SELECT * FROM chat_messages WHERE room_id = ? ORDER BY created_at DESC',
    [2] // room_id för art
  );

  res.render('art', {
    user: req.session.user,
    room_id: 2,
    messages
  });
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

app.get("/login", async (req, res) => {
  res.render('login');
})

app.get("/signup", async (req, res) => {
  res.render('signup');
})

app.post("/signup", async (req, res) => {
if (req.body && req.body.username && req.body.email) {
    //skriv till databas

    const salt = await bcrypt.genSalt(10); // genererar ett salt till hashning
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let connection = await getDBConnnection();
    let sql = `INSERT INTO users (username, email, password)
  VALUES (?, ?, ?)`;

    let [results] = await connection.execute(sql, [
      req.body.username,
      req.body.email,
      hashedPassword,
    ]);

    let accinfo = { Username: req.body.username, Email: req.body.email}

    //results innehåller metadata om vad som skapades i databasen
    console.log(results);
    res.redirect('/login')
    // res.status(201).json({info: results, Account: accinfo});
  } else {
    //returnera med felkod 422 Unprocessable entity.
    //eller 400 Bad Request.
    res.sendStatus(422).json({error: "Inte unikt username"});
  }
});


app.post('/login', async function(req, res) {
  //kod här för att hantera anrop…
  let connection = await getDBConnnection();
  let sql = "SELECT * FROM users WHERE username = ?"
  let [results] = await connection.execute(sql, [req.body.username])
  //let hashedPasswordFromDB = results[0].username;
  
  // Kontrollera att det fanns en user med det username i results
  // Verifiera hash med bcrypt

  let user = results[0];
  let hashedPasswordFromDB = user.password;
  


  const isPasswordValid = await bcrypt.compare(req.body.password, hashedPasswordFromDB);

  if (isPasswordValid) {
    console.log("Du är inne")
    // Skicka info om användaren, utan känslig info som t.ex. hash

    //Denna kod skapar en token att returnera till anroparen.
let payload = {
  sub: user.Id,         // sub är obligatorisk
  name: user.name // Valbar
  // kan innehålla ytterligare attribut, t.ex. roller
}


 req.session.user = {
    id: user.id,
    username: user.username,
    password: user.password
  };

  res.redirect('/')
  //res.json(req.session.user);
  // res.render("/", { user: req.session.user })//.redirect('/');

//res.redirect('/');
/*res.status(200).json({
  token: token
});*/


  } else {
    // Skicka felmeddelande
    res.status(401).json({ error: 'Invalid credentials' });
  }
 });
 

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', async (data) => {
  if (!data.username) return; // Avbryt om användare inte är inloggad

  io.emit('chat message', data); // Skicka till alla

  // Spara till databas
  const connection = await getDBConnnection();
  const sql = `INSERT INTO chat_messages (message, username, created_at, room_id)
               VALUES (?, ?, ?, ?)`;

  await connection.execute(sql, [
    data.message,
    data.username,
    data.created_at,
    data.room_id
  ]);
});
});


app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Fel vid utloggning:', err);
      return res.status(500).send('Kunde inte logga ut');
    }
    res.redirect('/login'); // Skicka användaren till login-sidan efter logout
  });
})

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

console.log("test")