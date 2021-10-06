exports.get404page = (req, res, next) => {
    res.status(404).render('404Page', { pageTitle: 'Page Not Found', path: '/404page' });
};