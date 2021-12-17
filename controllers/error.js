exports.get404page = (req, res, next) => {
    res.status(404).render('404Page', { 
        pageTitle: 'Page Not Found', 
        path: '/404page',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.get500 = (req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
};