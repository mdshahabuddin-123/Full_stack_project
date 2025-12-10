const mongoose = require("mongoose");
const Review = require("../models/review.js");

const listingSchema = new mongoose.Schema({

    title:{
      type: String,
      required: true
    } ,

    description: String,

    image:{
      url: String,
      filename: String,
    },

    price: Number,
    location: String,
    country: String,
    reviews: [
      {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Review"
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    geometry : {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      },
     
    }
})


listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
})


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;













// const mongoose = require("mongoose");
// const Review = require("../models/review.js");

// const listingSchema = new mongoose.Schema({

//     title:{
//       type: String,
//       required: true
//     } ,

//     description: String,

//     image:{
//       type: String,
//       default:"https://images.unsplash.com/photo-1735405817208-79a2fd79e18b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8",
//       set: (v) =>
//          v === "" ? "https://images.unsplash.com/photo-1735405817208-79a2fd79e18b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8" 
//       : v
//     },

//     price: Number,
//     location: String,
//     country: String,
    
//     reviews: [
//       {
//        type: mongoose.Schema.Types.ObjectId,
//        ref:"Review"
//       }
//     ],
//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     }
    
// })


// listingSchema.post("findOneAndDelete", async(listing) => {
//   if(listing){
//     await Review.deleteMany({_id: {$in: listing.reviews}});
//   }
// })


// const Listing = mongoose.model("Listing", listingSchema);

// module.exports = Listing;