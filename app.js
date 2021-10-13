const path = require('path');
const PORT = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('6165414e09dc6e35435b2ff8')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404page);

mongoose
    .connect(
        'mongodb+srv://tuatara:zEYioPuClru7qqJX@ecomcluster.vdkgy.mongodb.net/shop?retryWrites=true&w=majority'
    )
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'John',
                    email: 'john@test.net',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
    })
    .catch(err => {
        console.log(err);
    });

// mongoConnect(() => {
//     app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
// });
