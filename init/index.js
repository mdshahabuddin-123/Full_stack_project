const mongoose = require('mongoose')
const initData = require("./data.js");
const Listing = require("../models/listing.js");



main().
then((result) => {
    console.log("Connection successfully")
})
.catch((err) => {
    console.log(err)
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');


}


const initDb = async()=>{
    await Listing.deleteMany({});
    initData.data =  initData.data.map((obj) => ({...obj, owner:"68c51e8eae31d2c0c45d1d3d"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initilized")
}
initDb();