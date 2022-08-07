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
        var errors = []

        if(!req.body.name) {
            errors.push({text: 'Invalid name'})
        }

        if(!req.body.slug) {
            errors.push({text: 'Invalid slug'})
        }

        if(req.body.name.length < 2) {
            errors.push({text: 'Category name is too small'})
        }

        if(errors.length > 0) {
            res.render('admin/addcategory', {errors: errors})
        } else {
            const newCategory = {
                name: req.body.name,
                slug: req.body.slug
            }
    
            new Category(newCategory).save().then(() => {
                req.flash('success_msg', 'Category created successfully!')
                res.redirect('/admin/categories')
            }).catch((err) => {
                req.flash('error_msg', 'An error occurred while trying to save the category, please try again!')
                res.redirect('/admin')
            })
        }
    })


module.exports = router