const mongoose = require("mongoose")


const productSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    description:{
        type: String,
        required: true
    },
    publishDate:{
        type: Date,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    createAt:{
        type: Date,
        required:true,
        default: Date.now
    },
   
    product_type:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Type_product'
    },
    arrayImage:[
        {
            coverImage: Buffer,
            coverImageType:{ type: String}
        }
    ]
    
})


productSchema.virtual('coverImagePath').get(function(){

    if (this.arrayImage[0].coverImage != null && this.arrayImage[0].coverImageType != null) {
        return `data:${this.arrayImage[0].coverImageType};charset=utf-8;base64,${this.arrayImage[0].coverImage.toString('base64')}`
    }
})
module.exports = mongoose.model('Product',productSchema)
