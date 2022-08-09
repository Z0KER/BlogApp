const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const User = mongoose.model('users')

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', (req, res) => {
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

    }
})

module.exports = router