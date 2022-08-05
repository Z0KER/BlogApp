// Carregando módulos
    const express = require('express')
    const expbs = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()
    const admin = require('./routes/admin')
    const path = require('path')
    // const mongoose = require('mongoose')

// Configurações

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
        // Em breve
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
    const PORT = 8081
    app.listen(PORT, () => {
        console.log('Servidor rodando!')
    })
