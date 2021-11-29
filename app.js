const express = require('express');
const app = express();
const path = require('path');

const ejsmate = require('ejs-mate');

app.use(express.urlencoded({extended: true}))

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

const catchAsync=require('./utils/catchAsync')

const mongoose = require('mongoose');
const Campground = require('./models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp',);
const Review = require('./models/review');
const campground = require('./models/campground');
const db = mongoose.connection;
db.on('error',console.error.bind(console,'Connection Error'));
db.once('open',() =>{
    console.log("Database Connected");
})

app.engine('ejs',ejsmate)

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))


app.get('/',(req,res) =>{
    res.render('home.ejs')
})



app.get('/campground',catchAsync(async (req,res) =>{
    const campgrounds = await  Campground.find({});
    res.render('campgrounds/index.ejs',{campgrounds})

}))

app.get('/campground/new',catchAsync(async (req,res) =>{

    res.render('campgrounds/new.ejs')
 
}))

app.get('/campground/:id/edit',catchAsync(async (req,res) =>{
    const {id} = req.params;
    const campground= await  Campground.findById(id);
    console.log(campground);
    res.render('campgrounds/edit.ejs',{campground})
 
}))

app.delete('/campground/:id',catchAsync(async (req,res) =>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndDelete(id)
    res.redirect("/campground")
 
}))


app.post('/campground/:id/reviews',catchAsync(async (req,res)=>{
    // console.log(req.params)
    const camp = await Campground.findById(req.params.id)
    // console.log(req.body.review)
    const body=req.body.review.review
    const rating=req.body.review.rating
    const review = new Review({body, rating});
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campground/${camp._id}`)
}))

app.delete('/campground/:id/reviews/:rid',async (req,res) =>{
    const {id,rid} = req.params;
    console.log(rid)
    const re= await Review.findByIdAndDelete(rid)
    res.redirect("/campground")
    
 
})


app.patch('/campground/:id',catchAsync(async (req,res) =>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,req.body.campground)
    await camp.save();
    console.log(req.body);
    res.redirect(`/campground/${camp._id}`)
 
}))

app.get('/campground/:id',catchAsync(async (req,res,next) =>{
    const {id} = req.params;
    const campground = await  Campground.findById(id).populate('reviews');
    console.log(campground);
    res.render('campgrounds/show.ejs',{campground})
 
}))

app.post('/campground',catchAsync(async (req,res,next) =>{
    const camp = new Campground(req.body.campground)
    await camp.save();
    console.log(req.body);
    res.redirect(`/campground/${camp._id}`)
 
}))

app.use((err,req,res,next)=>{
    res.send("**************error************")
})

app.listen(3000,()=>{
    console.log("ON port 3000")
})