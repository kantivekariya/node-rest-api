const config = require('../comman/config/env.config');
const express = require('express');
const router = express.Router();
const userSchma = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// LOGIN
router.post("/login", (req, res, next) => {
    userSchma.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        config.JWT_KEY,
                        {
                            expiresIn: config.JWT_EXPIRATION_IN_SECONDS
                        }
                    );
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });
                }
                res.status(401).json({
                    message: "Auth failed"
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// GET ALL USER DATA
router.get('/users', async (req, res) => {
    try {
        const getUser = await userSchma.find();
        res.status(200).json(getUser);
    } catch {
        res.json({ message: err });
    };
});

// SIGNUP USER
router.post("/register", (req, res, next) => {
    userSchma.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new userSchma({
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            age: req.body.age,
                            phone: req.body.phone,
                            password: hash,
                            email: req.body.email
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});

//GETBY ID
router.get('/users/:userId', async (req, res) => {
    try {
        const getByid = await userSchma.findById(req.params.userId);
        res.status(200).json(getByid);
    } catch {
        res.json({ message: err });
    };
});

// DELETE BU ID
router.delete("/users/:userId", (req, res, next) => {
    userSchma.remove({ _id: req.params.userId })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "User deleted"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

// UPDATE BY ID
router.put('/users/:userId', async (req, res) => {
    try {
        const updateUser = await userSchma.updateOne({ _id: req.params.userId }, { $set: req.body });
        res.status(200).json(updateUser);
    } catch {
        res.json({ message: err });
    };
});

module.exports = router;