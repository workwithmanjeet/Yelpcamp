const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync =require('../utils/catchAsync')

router.get('/register', (req , res) =>{
    res.render('users/register');

})


router.post('/register', catchAsync( async (req , res, next) =>{
    try{
        const { username,email,password}= req.body.user;
        console.log(req.body)
        const user = new User({email : email , username : username});
        const regUser = await User.register(user,password)
        console.log(regUser)
        req.login(regUser , err =>{
            if(err) return next(err);
            req.flash('success','Welcome to YelpCamp !!')
            res.redirect('/campground')
        })
        
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register')
    }

    
}))


router.get('/login',(req, res)=>{
    res.render('users/login');
})

// router.post('/login' ,(req, res)=>{
   
//     res.send(req.body)
// })

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    console.log(req.user)
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout',(req, res)=>{
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campground');
})
 module.exports = router;