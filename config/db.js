if(process.env.NODE_ENV == 'production') {
    module.exports = {mongoURI: 'mongodb+srv://zoker:TafLrfcZzHbQD3LJ@blogapp.08uig8f.mongodb.net/?retryWrites=true&w=majority'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}