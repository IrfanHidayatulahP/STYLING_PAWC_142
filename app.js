const express = require('express');
const todosRoutes = require('./routes/tododb.js');
const app = express();
require('dotenv').config();
const port = process.env.PORT;

const db = require('./database/db');
const expressLayouts = require('express-ejs-layouts')

const session = require('express-session');

const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware.js');

app.use(express.urlencoded({ extended: true }));

// Konfigurasi express-session
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use('/', authRoutes);

app.use(expressLayouts);

app.use(express.json());

app.use('/todos', todosRoutes);
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', isAuthenticated, (req, res) => {
    res.render('index', { 
        layout: 'layouts/main-layouts.ejs',
        user: req.session.userId // Optional: Kirim data user ke tampilan
    });
});

app.get('/contact', isAuthenticated, (req, res)=>{
    res.render('contact', {
        layout : 'contact'
    });
})

app.listen(port,()=> {
    console.log(`server berjalan di http://localhost:${port}`);
});

app.get('/todo-view', (req, res) => {
    db.query('SELECT * FROM todos', (err, todos) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('todo', {
            layout: 'todo',
            todos: todos
        });
    });
});