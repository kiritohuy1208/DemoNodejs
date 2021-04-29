const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const methodOverrride = require('method-override')
const mogoose = require('mongoose')
// const methodOverrride = require('method-override')
const dotenv = require('dotenv')
dotenv.config()

mogoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true

}).then(()=>console.log("MongoDb connected"))
.catch((e)=>console.log(e.message))

const indexRouter = require('./routes/index')
const productRouter = require('./routes/product')
const contactRouter = require('./routes/contact')
const cartRouter = require('./routes/cart')
const searchRouter = require('./routes/search')
const adminRouter = require('./routes/admin/index')
const adminproductRouter = require('./routes/admin/products')
const admintypeRouter = require('./routes/admin/types_product')
// const bookRouter = require('./routes/books')

app.set('view engine',"ejs")
app.set('views',__dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(methodOverrride('_method'))
app.use(expressLayout)
app.use(express.static('public'))
// app.use(methodOverrride('_method'))
app.use(express.json())
app.use(express.urlencoded({
    limit: '10mb',
    extended:true
}))
app.use('/',indexRouter)
app.use('/products',productRouter)
app.use('/contact',contactRouter)
app.use('/cart',cartRouter)
app.use('/search',searchRouter)
app.use('/admin',adminRouter)
app.use('/admin/types',admintypeRouter)
app.use('/admin/products',adminproductRouter)




const Port = process.env.PORT || 8080
app.listen(Port,()=>{
    console.log("App use on port:",Port)
})