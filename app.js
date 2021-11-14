const express = require('express');
const app = express();
const path = require('path');

const ejsmate = require('ejs-mate');

app.use(express.urlencoded({extended: true}))

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

const mongoose = require('mongoose');
const Campground = require('./models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp',);

const db = mongoose.connection;
db.on('error',console.error.bind(console,'Connection Error'));
db.once('open',() =>{
    console.log("Database Connected");
})

app.engine('ejs',ejsmate)

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))

app.get('/campground',async (req,res) =>{
    const campgrounds = await  Campground.find({});
    res.render('campgrounds/index.ejs',{campgrounds})

})

app.get('/campground/new',async (req,res) =>{

    res.render('campgrounds/new.ejs')
 
})

app.get('/campground/:id/edit',async (req,res) =>{
    const {id} = req.params;
    const campground= await  Campground.findById(id);
    console.log(campground);
    res.render('campgrounds/edit.ejs',{campground})
 
})

app.delete('/campground/:id',async (req,res) =>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndDelete(id)
    res.redirect("/campground")
 
})

app.patch('/campground/:id',async (req,res) =>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,req.body.campground)
    await camp.save();
    console.log(req.body);
    res.redirect(`/campground/${camp._id}`)
 
})

app.get('/campground/:id',async (req,res) =>{
    const {id} = req.params;
    const campground = await  Campground.findById(id);
    console.log(campground);
    res.render('campgrounds/show.ejs',{campground})
 
})
app.post('/campground',async (req,res) =>{
    const camp = new Campground(req.body.campground)
    await camp.save();
    console.log(req.body);
    res.redirect(`/campground/${camp._id}`)
 
})

app.listen(3000,()=>{
    console.log("ON port 3000")
})