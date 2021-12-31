const Campground = require('./models/campground');

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        console.log(req.session)
        req.flash('error',"You must be signed in First!")
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next)=>{
   const {id}= req.params;
   const campground = await Campground.findById(id);
   if(! campground.author.equals(req.user._id)){
       req.flash('error',"You do not have permission!!")
       return res.redirect(`/campground/${id}`)
   }
    next();
}
