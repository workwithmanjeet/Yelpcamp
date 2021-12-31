const express = require('express');
const router = express.Router({mergeParams:true});

const catchAsync=require('../utils/catchAsync')
const Campground = require('../models/campground');
const Review = require('../models/review');
const {isLoggedIn} = require('../middleware');

router.post('/',isLoggedIn,catchAsync(async (req,res)=>{
    // console.log(req.params)
    const camp = await Campground.findById(req.params.id)
    // console.log(req.body.review)
    const body=req.body.review.review
    const rating=req.body.review.rating
    const review = new Review({body, rating});
    review.author = req.user._id
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success',"Successfully  created new review !")
    res.redirect(`/campground/${camp._id}`)
}))

router.delete('/:rid',isLoggedIn,catchAsync(async (req,res) =>{
    const {id,rid} = req.params;
    console.log(rid)
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    const re= await Review.findByIdAndDelete(rid)
    req.flash('success',"Successfully deleted review !")
    res.redirect(`/campground/${id}`)
   
 
}))
module.exports = router