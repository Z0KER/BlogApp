const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Category')
const Category = mongoose.model('categories')
require('../models/Post')
const Post = mongoose.model('posts')
const {isAdmin} = require('../helpers/isAdmin')

router.get('/', isAdmin, (req, res) => {
    res.render('admin/index')
})

// Posts
    router.get('/posts', isAdmin, (req, res) => {
        Post.find().lean().populate('category').sort({date: 'desc'}).then((posts) => {
            res.render('admin/posts', {posts: posts})
        }).catch((err) => {
            req.flash('error_msg', 'An error occurred while trying to list the posts, please try again!')
            res.redirect('/admin')
        })
    })

    router.get('/posts/add', isAdmin, (req, res) => {
        Category.find().lean().then((categories) => {
            res.render('admin/addpost', {categories: categories})
        }).catch((err) => {
            req.flash('error_msg', 'An error occurred while trying to load the form, please try again!')
            res.redirec('/admin')
        })
    })

    router.post('/posts/new', isAdmin, (req, res) => {
        var errors = []

        if(req.body.category == 0) {
            errors.push({text: 'Invalid category, register a category!'})
        }

        if(errors.length > 0) {
            res.render('admin/addpost', {errors: errors})
        } else {
            const newPost = {
                title: req.body.title,
                description: req.body.description,
                content: req.body.content,
                category: req.body.category,
                slug: req.body.slug
            }

            new Post(newPost).save().then(() => {
                req.flash('success_msg', 'Post created successfully!')
                res.redirect('/admin/posts')
            }).catch((err) => {
                req.flash('error_msg', 'An error occurred while trying to save the post, please try again!')
                res.redirect('/admin/posts')
            })
        }
    })

    router.get('/posts/edit/:id', isAdmin, (req, res) => {
        Post.findOne({_id: req.params.id}).lean().then((post) => {
            Category.find().lean().then((categories) => {
                res.render('admin/editposts', {categories: categories, post: post})
            }).catch((err) => {
                req.flash('error_msg', 'An error occurred while trying to list the categories, please try again!')
                res.redirect('/admin/posts')
            })
        }).catch((err) => {
            req.flash('error_msg', 'An error occurred while trying to load the edit form, please try again!')
            res.redirect('/admin/posts')
        })  
    })

    router.post('/posts/edit', isAdmin, (req, res) => {
        Post.findOne({_id: req.body.id}).then((post) => {
            post.title = req.body.title
            post.slug = req.body.slug
            post.description = req.body.description
            post.content = req.body.content
            post.category = req.body.category

            post.save().then(() => {
                req.flash('success_msg', 'Post edited successfully!')
                res.redirect('/admin/posts')
            }).catch((err) => {
                req.flash('error_msg', 'An error occurred while trying to change edit form data, please try again!')
            })
        }).catch((err) => {
            req.flash('error_msg', 'An error occurred while trying to save the edit form, please try again!')
            res.redirect('/admin/posts')
        })
    })

    router.post('/posts/delete', isAdmin, (req, res) => {
        Post.remove({_id: req.body.id}).then(() => {
            req.flash('success_msg', 'Post deleted successfully!')
            res.redirect('/admin/posts')
        }).catch((err) => {
            req.flash('error_msg', 'An error occurred while trying to delete the post!')
            res.redirect('/admin/posts')
        })
    })

// Categories
    router.get('/categories', isAdmin, (req, res) => {
        Category.find().lean().sort({date: 'desc'}).then((categories) => {
            res.render('admin/categories', {categories: categories})
        }).catch((err) => {
            req.flash('error_msg', 'An error occurred while trying to list the categories, please try again!')
            res.redirect('/admin')
        })
    })

    router.get('/categories/add', isAdmin, (req, res) => {
        res.render('admin/addcategory')
    })

    router.post('/categories/new', isAdmin, (req, res) => {
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

    router.get('/categories/edit/:id', isAdmin, (req, res) => {
        Category.findOne({_id: req.params.id}).lean().then((category) => {
            res.render('admin/editcategory', {category: category})
        }).catch((err) => {
            req.flash('error_msg','This category does not exist!')
            res.redirect('/admin/categories')
        })
        
    })

    router.post('/categories/edit', isAdmin, (req, res) => {
        Category.findOne({_id: req.body.id}).then((category) => {
            category.name = req.body.name
            category.slug = req.body.slug

            category.save().then(() => {
                req.flash('success_msg', 'Category edited successfully!')
                res.redirect('/admin/categories')
            }).catch((err) => {
                req.flash('error_msg', 'An error occurred while trying to save the edit, please try again!')
            })
        }).catch((err) => {
            req.flash('error_msg', 'An error occurred while trying to edit the category, please try again!')
            res.redirect('/admin/categories')
        })
    })

    router.post('/categories/delete', isAdmin, (req, res) => {
        Category.remove({_id: req.body.id}).then(() => {
            req.flash('success_msg', 'Category deleted successfully!')
            res.redirect('/admin/categories')
        }).catch((err) => {
            req.flash('error_msg', 'An error occurred while trying to delete the category!')
            res.redirect('/admin/categories')
        })
    })

module.exports = router