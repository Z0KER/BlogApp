const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Category')
const Category = mongoose.model('categories')

router.get('/', (req, res) => {
    res.render('admin/index')
})

// Posts
    router.get('/posts', (req, res) => {
        res.send('Post page')
    })

// Categories
    router.get('/categories', (req, res) => {
        res.render('admin/categories')
    })
    router.get('/categories/add', (req, res) => {
        res.render('admin/addcategory')
    })
    router.post('/categories/new', (req, res) => {
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug
        }

        new Category(newCategory).save().then(() => {
            console.log('Category saved successfully!')
        }).catch((err) => {
            console.log('Error saving category: ' + err)
        })
    })


module.exports = router