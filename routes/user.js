const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const User = mongoose.model('users')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const {loggedIn} = require('../helpers/loggedIn')
const {loggedOut} = require('../helpers/loggedOut')

router.get('/register', loggedIn, (req, res) => {
    res.render('users/register')
})

router.post('/register', loggedIn, (req, res) => {
    let errors = []

    if(!req.body.name) {
        errors.push({text: 'Invalid name!'})
    }

    if(!req.body.email) {
        errors.push({text: 'Invalid e-mail!'})
    }

    if(!req.body.password) {
        errors.push({text: 'Invalid password!'})
    }

    if(req.body.password.length < 4) {
        errors.push({text: 'Very short password!'})
    }

    if(req.body.password != req.body.password2) {
        errors.push({text: 'Passwords are different, try again'})
    }

    if(errors.length > 0) {
        res.render('users/register', {errors: errors})
    } else {
        User.findOne({email: req.body.email}).then((user) => {
            if(user) {
                req.flash('error_msg', 'An account with this e-mail already exists!')
                res.redirect('/users/register')
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if(error) {
                            req.flash('error_msg', 'There was an error saving the user!')
                            res.redirect('/users/register')
                        } else {
                            newUser.password = hash
                            newUser.save().then(() => {
                                req.flash('success_msg', 'User registered successfully!')
                                res.redirect('/')
                            }).catch((err) => {
                                req.flash('error_msg', 'An error occurred while trying to register the user, please try again!')
                                res.redirect('/users/register')
                            })
                        }
                    })
                })
            }
        }).catch((err) => {
            req.flash('error_msg', 'There was an internal error!')
            res.redirect('/')
        })
    }
})

router.get('/login', loggedIn, (req, res) => {
    res.render('users/login')
})

router.post('/login', loggedIn, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', loggedOut, function(req, res, next) {
    req.logout((err) => {
        if (err) { 
            return next(err) 
        } else {
            req.flash('success_msg', 'Successfully logged out!')
            res.redirect('/')
        }
        
    })
})

module.exports = router