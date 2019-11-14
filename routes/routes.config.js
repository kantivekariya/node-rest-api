const express = require('express');
const router = express.Router();
const userSchma = require('../models/user.models');
let encryption = require('../encryption/enryption');
// Get All Users Data
router.get('/users', async (req, res) => {
    try {
        const getUser = await userSchma.find();
        res.status(200).json(getUser);
    } catch {
        res.json({ message: err });
    };
});

// Post User Data
router.post('/users', async (req, res) => {
    let pw = encryption.encrypt(req.body.password);
    const addUser = new userSchma({
        firtsName: req.body.firtsName,
        lastName: req.body.lastName,
        age: req.body.age,
        phone: req.body.phone,
        password: pw,
        email: req.body.email,
        date: req.body.date
    });
    try {
        const svaePost = await addUser.save();
        res.status(200).json(svaePost);
    } catch {
        res.json({ message: err });
    };
});

// GetBy id
router.get('/users/:userId', async (req, res) => {
    try {
        const getByid = await userSchma.findById(req.params.userId);
        res.status(200).json(getByid);
    } catch {
        res.json({ message: err });
    };
});

// DeleteBy id
router.delete('/users/:userId', async (req, res) => {
    try {
        const removeUser = await userSchma.remove({ _id: req.params.userId });
        res.status(200).json(removeUser);
    } catch {
        res.json({ message: err });
    };
});

// Update User
router.patch('/users/:userId', async (req, res) => {
    try {
        const updateUser = await userSchma.updateOne({ _id: req.params.userId }, { $set: req.body });
        res.status(200).json(updateUser);
    } catch {
        res.json({ message: err });
    };
});

module.exports = router;