
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelp-camp',);

const db = mongoose.connection;
db.on('error',console.error.bind(console,'Connection Error'));
db.once('open',() =>{
    console.log("Database Connected");
})

const sample = (array) => array[Math.floor(Math.random()*array.length)]

const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i =0;i<50;i++){
        const random1000 =Math.floor(Math.random()*1000)
        const price =Math.floor(Math.random()*20)+1
        const camp = new Campground({
            author: '61cd503ba0238a181d2ec816',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title :`${sample(descriptors)} ${sample(places)}`,
            image : 'https://source.unsplash.com/collection/483251/1600x900',
            price:price,
            description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa repellendus maiores laboriosam, sit velit soluta harum! Veniam eius enim cum ea autem repellendus laborum modi natus nulla libero, amet atque voluptatum tempora sequi quis ad! Optio soluta nesciunt porro aut! Velit, necessitatibus. Ducimus nam aut assumenda laudantium reprehenderit fuga optio laborum cumque recusandae. Doloremque, libero?"
           

        })
        await camp.save();

    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})