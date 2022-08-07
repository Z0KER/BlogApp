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

// Configurações
    // Session
        app.use(session({
            secret: 'P4$6^h35YQ8z',
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())

    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            next()
        })

    // Body Parser
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())

    // Handlebars
        const hbs = expbs.create({
            defaultLayout: 'main'
        })
        app.engine('handlebars', hbs.engine)
        app.set('view engine', 'handlebars')

    // Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect('mongodb://localhost/blogapp').then(() => {
            console.log('Connected to MongoDB')
        }).catch((err) => {
            console.log('Error connecting: ' + err)
        })

    // Public
        app.use(express.static(path.join(__dirname, 'public')))

// Rotas
    app.get('/', (req, res) => {
        res.send('Rota principal')
    })
    app.get('/posts', (req, res) => {
        res.send('Lista Posts')
    })
    app.use('/admin', admin)


// Outros
    const PORT = 8080
    app.listen(PORT, () => {
        console.log('Server running!')
    })
