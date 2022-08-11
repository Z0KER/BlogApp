// Carregando módulos
    const express = require('express')
    const expbs = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')
    require('./models/Post')
    const Post = mongoose.model('posts')
    require('./models/Category')
    const Category = mongoose.model('categories')
    const users = require('./routes/user')
    const passport = require('passport')
    require('./config/auth')(passport)
    const db = require('./config/db')

// Settings
    // Session
        app.use(session({
            secret: 'P4$6^h35YQ8z',
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash()) 

    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null
            next()
        })

    // Body Parser
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())

    // Handlebars
        const hbs = expbs.create({
            defaultLayout: 'main',
            layoutsDir: path.join(__dirname, 'views/layouts'),
            partialsDir: path.join(__dirname, 'views/partials'),

            // Helpers
                helpers: {
                    isAdmin: function(object, options) {
                        let obj = object
                        
                        if(obj.isAdmin == 1) {
                            return options.fn(this)
                        }
                        return options.inverse(this)
                    }
                }
        })
        app.engine('handlebars', hbs.engine)
        app.set('view engine', 'handlebars')

    // Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect(db.mongoURI).then(() => {
            console.log('Connected to MongoDB')
        }).catch((err) => {
            console.log('Error connecting: ' + err)
        })

    // Public
        app.use(express.static(path.join(__dirname, 'public')))

// Routes
    app.get('/', (req, res) => {
        Post.find().lean().populate('category').sort({date: 'desc'}).then((posts) => {
            res.render('index', {posts: posts})
        }).catch((err) => {
            req.flash('error_msg', 'There was an internal error!')
            res.redirect('/404')
        })
    })

    app.get('/post/:slug', (req, res) => {
        Post.findOne({slug: req.params.slug}).lean().then((post) => {
            if(post) {
                res.render('post/index', {post: post})
            } else {
                req.flash('error_msg', 'This post does not exist!')
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash('error_msg', 'There was an internal error!')
            res.redirect('/')
        })
    })

    app.get('/categories', (req, res) => {
        Category.find().lean().then((categories) => {
            res.render('categories/index', {categories: categories})
        }).catch((err) => {
            req.flash('error_msg', 'An internal error occurred while listing the categories!')
            res.redirect('/')
        })
    })

    app.get('/categories/:slug', (req, res) => {
        Category.findOne({slug: req.params.slug}).lean().then((category) => {
            if(category) {
                Post.find({category: category._id}).lean().then((posts) => {
                    res.render('categories/posts', {posts: posts, category: category})
                }).catch((err) => {
                    req.flash('error_msg', 'There was an error listing the posts!')
                    res.redirect('/')
                })
                
            } else {
                req.flash('error_msg', 'This category does not exist!')
                res.redirect('/')
            }
        }) .catch((err) => {
            req.flash('error_msg', 'There was an internal error loading the page for this category!')
            res.redirect('/')
        })
    })

    app.get('/404', (req, res) => {
        res.send('Error 404!')
    })

    app.get('/posts', (req, res) => {
        res.send('Lista Posts')
    })

    app.use('/admin', admin)
    app.use('/users', users)

// Others
    const PORT = process.env.PORT || 8080
    app.listen(PORT, () => {
        console.log('Server running!')
    })
