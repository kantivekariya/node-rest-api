const config = require('../comman/config/env.config');
const userSchma = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

exports.register = (req, res, next) => {
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
                        user.save().then(result => {
                            res.status(201).json({
                                message: "User created"
                            });
                        }).catch(err => {
                            res.status(500).json({
                                error: err
                            });
                        });
                    }
                });
            }
        });
}

exports.login = (req, res, next) => {
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
                    const token = jwt.sign({
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
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.findAll = (req, res) => {
    userSchma.find().then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error occurred while retrieving the users"
        });
    });
}

exports.findOne = (req, res) => {
    userSchma.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id : " + req.params.userId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id : " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Error retriving user with id : " + req.params.userId
            });
        });
}

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(404).send({
            message: "User can not be empty"
        });
    }

    bcrypt.hash(req.body.password, 10, function (err, hash) {
        req.body.password = hash
        userSchma.updateOne({ _id: req.params.userId }, { $set: req.body }).then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id : " + req.params.userId
                });
            }
            res.status(200).json(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id : " + res.params.userId
                });
            }
            return res.status(500).send({
                message: "Error updating the user with id : " + req.params.userId
            });
        });
    })

}

exports.delete = (req, res) => {
    // User.findByIdAndDelete(req.params.sId)
    userSchma.remove({ _id: req.params.userId })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id : " + req.params.userId
                });
            }
            res.send({ message: "User Deleted Successfully." });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id : " + req.params.userId
                });
            }
            return res.status(500).send({
                message: "Could not delete with id : " + req.params.userId
            })
        });
}