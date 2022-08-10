module.exports = {
    loggedIn: function(req, res, next) {
        if(!req.isAuthenticated()) {
            return next()
        } else {
            req.flash('error_msg', 'You cannot access this page when logged in!')
            res.redirect('/')
        }
    }
}