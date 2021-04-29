const express = require('express')
const router = express.Router()
const Product = require('../../models/product')

router.get('/',async (req,res)=>{
    let products
    try{
        // thuc thi exec filter trong mongoos, gioi han 10 book, sap xep theo ngay tao
        products= await Product.find().sort({cretaeAt : 'desc'}).limit(10).exec()
    }
    catch(err){
        console.log(err)
        products = []
    }   
   
    res.render('ad_index.ejs',{layout: 'layouts/admin_layout',products:products})
})

module.exports = router