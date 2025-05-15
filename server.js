const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const bodyparser = require("body-parser")
const { engine } = require("express-handlebars")
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");


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

const hbs = require("express-handlebars").create({
  helpers: {
    eq: (a, b) => a === b,
    or: (a, b) => a || b
  }
});

app.engine("handlebars", hbs.engine);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

/*function authMiddleware(req, res, next) {
  if (req.session.user) {
    next(); // släpp igenom
  } else {
    res.redirect('/login'); // skicka till login om inte inloggad
  }
}*/

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
  'SELECT id, message, username, created_at FROM chat_messages WHERE room_id = ? ORDER BY created_at DESC',
  [1]
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
  'SELECT id, message, username, created_at FROM chat_messages WHERE room_id = ? ORDER BY created_at DESC',
  [2]
);

  res.render('art', {
    user: req.session.user,
    room_id: 2,
    messages
  });
});


app.get('/sports', async (req, res) => {
  const connection = await getDBConnnection();
  const [messages] = await connection.execute(
  'SELECT id, message, username, created_at FROM chat_messages WHERE room_id = ? ORDER BY created_at DESC',
  [3]
);

  res.render('sports', {
    user: req.session.user,
    room_id: 3,
    messages
  });
});


app.get('/Technology', async (req, res) => {
  const connection = await getDBConnnection();
  const [messages] = await connection.execute(
  'SELECT id, message, username, created_at FROM chat_messages WHERE room_id = ? ORDER BY created_at DESC',
  [4]
);

  res.render('Technology', {
    user: req.session.user,
    room_id: 4,
    messages
  });
});


app.get('/general', async (req, res) => {
  const connection = await getDBConnnection();
  const [messages] = await connection.execute(
  'SELECT id, message, username, created_at FROM chat_messages WHERE room_id = ? ORDER BY created_at DESC',
  [5]
);

  res.render('general', {
    user: req.session.user,
    room_id: 5,
    messages
  });
});


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
    //results innehåller metadata om vad som skapades i databasen
    console.log(results);
    res.redirect('/login')
    
  } else {

    res.sendStatus(422).json({error: "Inte unikt username"});
  }
});


app.post('/login', async function(req, res) {
  //kod här för att hantera anrop
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

 req.session.user = {
    id: user.id,
    username: user.username,
    password: user.password,
    role: user.role
  };

  res.redirect('/')


  } else {
    // Skicka felmeddelande
    res.status(401).json({ error: 'Invalid credentials' });
  }
 });
 

io.on('connection', (socket) => {
  console.log('a user connected');

 socket.on('chat message', async (data) => {
  if (!data.username) return;

  const connection = await getDBConnnection();
  const sql = `INSERT INTO chat_messages (message, username, created_at, room_id)
               VALUES (?, ?, ?, ?)`;

  const [result] = await connection.execute(sql, [
    data.message,
    data.username,
    data.created_at,
    data.room_id
  ]);


  const messageWithId = {
    id: result.insertId,
    message: data.message,
    username: data.username,
    created_at: data.created_at,
    room_id: data.room_id
  };

  io.emit('chat message', messageWithId);
});

});


app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Fel vid utloggning:', err);
      return res.status(500).send('Kunde inte logga ut');
    }
    res.redirect('/login');
  });
})


app.delete('/messages/:id', async (req, res) => {
  const messageId = req.params.id;
  const user = req.session.user;

  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const connection = await getDBConnnection();
  const [rows] = await connection.execute('SELECT username FROM chat_messages WHERE id = ?', [messageId]);

  if (rows.length === 0) return res.status(404).json({ error: 'Message not found' });

  const message = rows[0];

  if (message.username !== user.username && user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  await connection.execute('DELETE FROM chat_messages WHERE id = ?', [messageId]);
  io.emit('message deleted', { id: messageId });
  res.sendStatus(200);
});

app.post('/messages/:id/like', async (req, res) => {
  const messageId = req.params.id;
  const connection = await getDBConnnection();

  await connection.execute('UPDATE chat_messages SET likes = likes + 1 WHERE id = ?', [messageId]);

  // Hämta uppdaterat antal likes
  const [rows] = await connection.execute('SELECT likes FROM chat_messages WHERE id = ?', [messageId]);

  const updatedLikes = rows[0]?.likes ?? 0;

  io.emit('message liked', { id: messageId, likes: updatedLikes });

  res.json({ success: true, likes: updatedLikes });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});