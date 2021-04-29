const mongoose = require("mongoose")
const Product = require('./product')
const typeproductSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    }
})
//Them rang bupc truoc khi xoa tac gia
//Chay truoc 1 hanh dong nhat dinh: truoc khi xoa tac gia that, thi se thuc hien chuc nang nay:
typeproductSchema.pre('remove',function(next){
    Product.find({product_type:this.id},(err,products )=>{
        if(err){
            //Dung next de ngan can viet xoa tac gia
            next(err)
        }else if( products.length > 0){
            next(new Error('This type of product has products still'))
        }else{
            next()
        }
    })
})


module.exports = mongoose.model('Type_product',typeproductSchema)