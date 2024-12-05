const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/db');
const router = express.Router();

// Route Signup
router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).send('Error hashing password');

        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, result) => {
            if (err) return res.status(500).send('Error registering user');
            res.redirect('/login');
        });
    });
});

// Route untuk menampilkan form signup
router.get('/signup', (req, res) => {
    res.render('signup', { 
        layout: 'layouts/main-layout' });
});

// Route Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).send('Error fetching user');
        if (results.length === 0) {
            // User not found
            return res.render('login', { 
                layout: 'layouts/main-layout',
                error: 'User not found',
            });
        }

        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (err) return res.status(500).send('Error checking password');
            if (!isMatch) {
                // Incorrect password
                return res.render('login', { 
                    layout: 'layouts/main-layout',
                    error: 'Incorrect username or password',
                });
            }

            // Save user ID in session and redirect to the main page
            req.session.userId = results[0].id;
            res.redirect('/'); // Redirect to the main page
        });
    });
});


// Route untuk menampilkan form login
router.get('/login', (req, res) => {
    res.render('login', { 
        layout: 'layouts/main-layout' });
});

// Route Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error logging out');
        res.redirect('/login');
    });
});


module.exports = router;