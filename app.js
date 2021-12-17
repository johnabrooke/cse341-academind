const path = require('path');
const PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
require('dotenv').config();

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
    process.env.MONGODB_URI || 'mongodb+srv://tuatara:zEYioPuClru7qqJX@ecomcluster.vdkgy.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const corsOptions = {
    origin: "https://ecommerce341.herokuapp.com/",
    optionsSuccessStatus: 200
};
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    family: 4

};
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
app.use(cors(corsOptions));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    // throw new Error('Sync Dummy');
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404page);

app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(...);
    // res.redirect('/500');
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
});

mongoose
    .connect(MONGODB_URI, options)
    .then(result => {
        app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
    })
    .catch(err => {
        console.log(err);
    });

// mongoConnect(() => {
//     app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
// });
