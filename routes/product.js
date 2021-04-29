const express = require('express')
const router = express.Router()
const Product = require('./../models/product')

router.get('/',async (req,res)=>{
    // let products
   
    let query = Product.find()
    if(req.query.search != null && req.query.search !==""){
        query = query.regex("name",new RegExp(req.query.search,'i'))
    }
    try{
        const products = await query.exec()
        if(products === null){
            alert('Không có sản phẩm ')
        }
        res.render('category.ejs',{products:products})
       
    }
    catch(err){
        console.log("Error: Can not get product from mongoos")
        res.redirect('/')
    }
   
})
router.get('/:id',async (req,res)=>{
    let product
    try{
        product = await Product.findById(req.params.id).exec()
        res.render('product.ejs',{product:product})
    }
    catch(err){
        console.log(err)
        res.redirect('/products')
    }
})
module.exports = router