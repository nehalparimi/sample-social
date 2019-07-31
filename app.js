let express = require('express');
let mongoose = require('mongoose');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let flash = require('connect-flash');

let routes = require('./routes');
let app = express();

mongoose.connect("mongodb://localhost:27017/test");

app.set("port", process.env.PORT || 3000);

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.use(routes);

app.listen(app.get("port"), function() {
    console.log('Server started on ' + app.get("port"));
});
