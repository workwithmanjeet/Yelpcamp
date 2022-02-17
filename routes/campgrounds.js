const express = require('express');
const router = express.Router();
const catchAsync=require('../utils/catchAsync')
const Campground = require('../models/campground');
const {isLoggedIn,isAuthor} = require('../middleware');
const multer = require('multer');
const { storage,cloudinary } = require('../CloudConfig');
const upload = multer({ storage });


router.get('/',catchAsync(async (req,res) =>{
    const campgrounds = await  Campground.find({});
    if (!campgrounds){
        req.flash('error','Cannot find that campground !');
        res.redirect("/campground")
    }
    else{
        res.render('campgrounds/index.ejs',{campgrounds})

    }
    

}))

router.get('/new',isLoggedIn, async (req,res) =>{

    res.render('campgrounds/new.ejs')
 
})

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(async (req,res) =>{
    const {id} = req.params;
    const campground= await  Campground.findById(id);
    console.log(campground);
    if (!campground){
        req.flash('error','Cannot find that campground !');
        return res.redirect("/campground")
    }
    else{
        res.render('campgrounds/edit.ejs',{campground})

    }
    
 
}))

router.delete('/:id',isLoggedIn,isAuthor, catchAsync(async (req,res) =>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndDelete(id)
    req.flash('success',"Successfully  deleted campground")

    res.redirect("/campground")
 
}))


router.patch('/:id',isLoggedIn,isAuthor,upload.array('image'),catchAsync(async (req,res) =>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,req.body.campground)
    await camp.save();
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    console.log(req.body);
    req.flash('success',"Successfully  updated  campground ! ")
    res.redirect(`/campground/${camp._id}`)
 
}))

router.get('/:id',catchAsync(async (req,res,next) =>{
    const {id} = req.params;
    const campground = await  Campground.findById(id).populate({
        path :'reviews',
        populate : {
            path :'author'
        }
    }).populate('author');
    console.log(campground)
    if (!campground){
        req.flash('error','Cannot find that campground !');
        return res.redirect("/campground")
    }
    else{
        res.render('campgrounds/show.ejs',{campground})

    }

    // console.log(campground.reviews);
   
 
}))
router.post('/', isLoggedIn, upload.array('image'),async (req,res,next) =>{
    console.log(req.body,req.files);
    const camp = new Campground(req.body.campground)
    camp.images=req.files.map(f => ({url:f.path,filename:f.filename}))
    camp.author = req.user._id
    await camp.save();
    console.log(req.body);
    req.flash('success',"Successfully  created new campground !")
    res.redirect(`/campground/${camp._id}`)
    // res.send("all ok")
 
})
// router.post('/', isLoggedIn, catchAsync(async (req,res,next) =>{
//     const camp = new Campground(req.body.campground)
//     camp.author = req.user._id
//     await camp.save();
//     console.log(req.body);
//     req.flash('success',"Successfully  created new campground !")
//     res.redirect(`/campground/${camp._id}`)
 
// }))


module.exports = router;