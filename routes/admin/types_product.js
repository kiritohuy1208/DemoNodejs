const express = require('express')
const Type_product  = require('../../models/type_product')
const router = express.Router()
const Product = require('../../models/product')
//All authors route
router.get('/',async (req,res)=>{
  
    let searchOption = {}
    
    if(req.query.name != null && req.query.name !== ''){

        searchOption.name = new RegExp(req.query.name,'i') 
       
    }
    try{
        const types = await Type_product.find(searchOption)
        res.render('ad_type_product/index',{layout: 'layouts/admin_layout',types: types,searchOption:req.query})
    }
    catch{
        res.redirect('/')
    }
    
   
})
//New author route
router.get('/new',(req,res)=>{
    res.render('ad_type_product/new',{layout: 'layouts/admin_layout',type:new Type_product()})
})
//Cretae new author
router.post('/', async (req,res)=>{
    const type = new Type_product({
        name: req.body.name
    })
    try{
        const newType = await type.save()
        res.redirect(`/types/${newType.id}`)
    }
    catch(err){
        console.log(err)
        res.render('ad_type_product/new',{
            type:type,
            errorMessage: "Error creating Author",
            layout: 'layouts/admin_layout'
        })
    }     
})
router.get('/:id', async (req,res)=>{
    try{
        const type = await Type_product.findById(req.params.id)
        const productOfType = await Product.find({type:type.id}).limit(6).exec()
        res.render('ad_type_product/show.ejs',{type: type, productOfType: productOfType,layout: 'layouts/admin_layout'})
    }
    catch(err){
        console.log(err)
        res.redirect('/admin')
    }
})
router.get('/:id/edit', async (req,res)=>{
    try{
        const type = await Type_product.findById(req.params.id)
        res.render('ad_type_product/edit',{type:type,layout: 'layouts/admin_layout'})
    }
    catch{
        res.redirect('admin/types')
    }
   
})
router.put('/:id', async (req,res)=>{
    //  khai bao author ben ngoai nham su dung cho ham catch va type la let de thay doi content author
   let type 
    try{
        type = await Type_product.findById(req.params.id)
        type.name = req.body.name
        await type.save()
        res.redirect(`/admin/types/${type.id}`)
    }
    // do co the co loi hay lan : 1: tim kiem author loi 2: save author bi loi
    catch{
        // ham xu ly khi  tim kiem author loi:
        if( type == null){
            // redirect den trang chu
            res.redirect('/admin')
        }else{
            res.render('ad_type_product/edit',{
                type:type,
                errorMessage: "Error updating type",
                layout: 'layouts/admin_layout'
            })
        }
       
    }     
})
router.delete('/:id', async (req,res)=>{
    let type
    try{
        type= await Type_product.findById(req.params.id)
        await type.remove()
        res.redirect('/admin/types')
    }
    catch{
        if(type ==null){
            res.redirect('/admin')
        }else{
            res.redirect(`/admin/types/${type.id}`)
        }
    }
})
module.exports = router