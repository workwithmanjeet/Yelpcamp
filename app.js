if (process.env.NODE_ENV!== "production"){
    require('dotenv').config({ path:'./.gitignore/.env' });
}


const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const ejsmate = require('ejs-mate');
const passport = require('passport');
const LocalStrategy =require('passport-local');
const User = require('./models/user')


app.use(express.urlencoded({extended: true}))
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.use(express.static( path.join(__dirname,'public')))

const url = process.env.Dburl

// mongodb://localhost:27017/yelp-camp
const mongoose = require('mongoose');
mongoose.connect(url,{
   
});

const campgroundsRoutes=require('./routes/campgrounds')
const reviewsRoutes =require('./routes/reviews')
const  usersRoutes =require('./routes/users')

const db = mongoose.connection;
db.on('error',console.error.bind(console,'Connection Error'));
db.once('open',() =>{
    console.log("Database Connected");
})

app.engine('ejs',ejsmate)

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))

const sessionConfig = {
    name: 'sessionabs',
    secret: 'notagoodwayvvvvvvvvvvvvvvvvvvvvvv',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        // secure: true,
        expires: Date.now()+ (1000*60*60*24*7 ),
        maxAge: 1000 * 60 * 60  * 24 * 7
    }
}

const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize({
    replaceWith: '_'
}))

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// define auth method of user 

passport.serializeUser(User.serializeUser());  
// add user detail in session
passport.deserializeUser(User.deserializeUser());
// remove user details from session

app.use((req, res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})


app.get('/',(req, res)=>{
    res.render('home.ejs')
})

app.use('/campground',campgroundsRoutes)
app.use('/campground/:id/reviews',reviewsRoutes)
app.use('/',usersRoutes)


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});