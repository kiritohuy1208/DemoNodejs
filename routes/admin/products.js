const express = require('express')
const router = express.Router()

const Product = require('../../models/product')
const Type_product = require('../../models/type_product')


const imageMimeTypes = ['image/jpeg','image/png','image/gif']

// const upload = multer({
//     dest: uploadPath,
//     fileFilter:(req,file,callback)=>{
//         callback(null,imageMimeType.includes(file.mimetype))
//     } 
// })

//All Books route
router.get('/',async (req,res)=>{

    let query = Product.find()

    if(req.query.title != null && req.query.title !== ''){
      query= query.regex('name',new RegExp(req.query.title,'i'))
        
    } 
    if(req.query.publishBefore != null && req.query.publishBefore !== ''){
        query = query.lte('publishDate',req.query.publishBefore)     
      } 
    if(req.query.publishAfter != null && req.query.publishAfter !== ''){
        query = query.gte('publishDate',req.query.publishAfter)     
      } 
    try{
        //use query.exec to execute the query string, moggoose will casts filter to match schema
        const products = await query.exec()
        res.render('ad_products/index',{products:products,searchOption:req.query,layout: 'layouts/admin_layout'});
    }
    catch{
        res.redirect('/admin')
    }   
})
//New Books route
router.get('/new',async(req,res)=>{
    renderNewPage(res,new Product())
})
//get Detail book
router.get('/:id',async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id).populate('product_type').exec()
        res.render('ad_products/show.ejs',{product:product,layout: 'layouts/admin_layout'})
    }
    catch(err){
        console.log(err)
        res.redirect('/admin')
    }
   
})
router.get('/:id/edit',async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id)
        
        renderEditPage(res,product)
    }
    catch{
        res.redirect('/admin')
    }
   
})
router.post('/',  async (req, res) => {
   
    
    const product = new Product({
      name: req.body.title,
      product_type:req.body.Author.trim() ,
      publishDate: new Date(req.body.publishDate),
      price: req.body.pageCount,
      description: req.body.description
    })
    // Lưu 1 hình
    if(typeof req.body.cover === 'string')
    {
        saveCover(product,req.body.cover)
    }
    // Lưu nhiều hình
    else{
        let arr = []
        var i=0
        console.log(typeof req.body.cover)
        var imagesarray = req.body.cover
        while(imagesarray[i] !== undefined){
        var image= JSON.parse(imagesarray[i])
        arr.push(image)
        i++
    }
        saveArrayImage(product,arr,i)
    }
    

    try{
        const newproduct = await product.save()
        res.redirect(`/admin/products/${newproduct.id}`)
    }
    catch(err){
        console.log(err)
        renderNewPage(res,product,true)
        
    }

})
router.put('/:id',  async (req, res) => {
   let product
    try{
        product = await Product.findById(req.params.id)
        product.name = req.body.title
        product.product_type = req.body.Author.trim()
        product.publishDate = new Date(req.body.publishDate) 
        product.price = req.body.pageCount
        product.description = req.body.description
        if(req.body.cover !=null && req.body.cover !==''){
            if(typeof req.body.cover === 'string'){
                saveCover(product,req.body.cover)
            }
            else{
                var imagesarray = []
                imagesarray = req.body.cover
               
                let arr = []
                var i=0
                while(imagesarray[i] !== undefined){
                var image= JSON.parse(imagesarray[i])
              
                arr.push(image)
                i++
                }
                saveArrayImage(product,arr,i)
            }
           
        }
        await product.save()
        res.redirect(`/admin/products/${product.id}`)   
    }
    catch(err){
        console.log(err)
        //Kiem tra loi nhung da tao book thanh cong=> loi do save len db
        if( product != null){
            renderEditPage(res,product,true)
        }
        // Loi do book= null 
        else{ 
            
            redirect('/admin')
        }
       
    }

})

router.delete('/:id', async (req,res)=>{
    let product 
    try{
        product= await Product.findById(req.params.id)
        await product.remove()
        res.redirect('/admin/products')
    }
    catch(err){
        console.log(err);
        if( product != null){
            res.redirect('/admin/products/show',{product:product, errorMessage:" Could not remove book"})
        }
        else{
            res.redirect('/admin')
        }
    }
})

async function renderNewPage(res, product , checkError = false){
    renderFormPage(res,product,'new',checkError)
}

async function renderEditPage(res, product , checkError = false){
   renderFormPage(res,product,'edit',checkError)
}
async function renderFormPage(res, product ,form, checkError = false){
    try{
        const types = await Type_product.find()
        const params={
            types: types,
            product: product,
            layout: 'layouts/admin_layout'
        }
        if(checkError){
            if(form === 'edit'){
                params.errorMessage = "Error updating book"
            }
            else{
                params.errorMessage = "Error creating book"
            }
        }

        res.render(`ad_products/${form}`,params)
    }
    catch(err){
        console.log(err)
        res.redirect('/admin/products')
    }
}
//Lưu hình ảnh của sách thông qua FileEncode của FIlePond, res.body.cover đã đc encode thoe chuẩn FileEncode
 function saveCover(product,coverEncoded){
    if(coverEncoded == null ) {
        return }
    
     const cover = JSON.parse(coverEncoded)
        if( cover != null && imageMimeTypes.includes(cover.type)){
            
            var image = {
                coverImage:  new Buffer.from(cover.data,'base64') ,
                coverImageType: cover.type
            }
            product.arrayImage[0] = image
    }
   

}
async function saveArrayImage(product,arr,length){
  
    if(arr == null) return
    for(i=0;i<length;i++ ){
        if( arr[i] != null && imageMimeTypes.includes(arr[i].type)){
            var image = {
                coverImage:  new Buffer.from(arr[i].data,'base64') ,
                coverImageType: arr[i].type
            }
           
            product.arrayImage[i] = image
           
           
    }
           
    }
}

module.exports = router