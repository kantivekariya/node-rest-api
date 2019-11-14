const express = require('express');
const router = express.Router();
const userSchma = require('../models/user.models');

router.get('/users', async (req, res) => {
    try {
        
    } catch {
        res.json({ message: err });
    };
});

router.post('/users', async (req, res) => {
    const addUser = new userSchma(req.body);
    try {
        const svaePost = await addUser.save();
        res.json(svaePost);
    } catch {
        res.json({ message: err });
    };
});

router.get('/users/:userId', (req, res) => {
    res.send('Hello Kanti 2');
});

module.exports = router;