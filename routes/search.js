const express = require('express')
const router = express.Router()
const Book = require('./../models/product')

router.get('/',async (req,res)=>{
    let products
    try{
        products = await Book.find()
        res.render('category.ejs',{products:products})
       
    }
    catch(err){
        console.log("Error: Can not get product from mongoos")
    }
   
})
module.exports = router