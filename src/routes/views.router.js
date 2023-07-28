

import express from 'express'
import { productsModel } from '../dao/models/products.js';
import cartsModel from '../dao/models/carts.js';
import userModel from '../dao/models/Users.model.js';
import session from 'express-session';


const router= express.Router();

router.get("/register",(req,res)=>{
    res.render("register")
})

router.get("/", (req, res) => {
    res.render("login")
});



router.get("/logout", (req,res) => {
    req.session.destroy(error => {
        if (error) res.json({error: "error logout", mensaje: "Error al cerrar sesion"})
        res.send("sesion cerrada correctamente")
    })
})




router.get('/realtimeproducts',(req,res)=>{
 
    res.render('realTimeProducts',{})
    

})

router.get('/chat',async (req,res)=>{
    res.render('chat',{})
})


router.get('/cart/:cid',async(req,res)=>{
 let cartId =req.params.cid
 const cart = await cartsModel.findById(cartId).lean()
 const products = cart.products

res.render('cart',{
    cart,
    products
})
    

})

router.get('/products',async (req,res)=>{

    const page=(req.query.page!=undefined) ? parseInt(req.query.page) : 1
    const limite = (req.query.limit != undefined) ? parseInt(req.query.limit) : 10 
    let sort = null
    let sortParam = req.query.sort
    if (sortParam != undefined){
        if (sortParam == "asc") sort = {price:1}
        if (sortParam == "desc") sort = {price:-1}
    }  
    let query = {}
    const queryParam = (req.query.query != undefined) ? req.query.query : null 
    if  (queryParam !== undefined ) {
        if (queryParam == "disponibilidad") query = {stock: {$gt: 0}}
        query = {categoria: {$eq: queryParam}}
    }  
       
try {
    const{docs,hasPrevPage,hasNextPage,nextPage,prevPage,totalPages} = await productsModel.paginate({},{limit:limite,page,sort:sort,query,lean:true})
    const payload = docs
    const status = "success"
    const nextLink=hasNextPage ? `page=${nextPage}&limit=${limite}` : null
    const prevLink= hasPrevPage ? `page=${prevPage}&limit=${limite}` : null
    let user = req.session.user
    let admin = (user.rol === "admin") ? true : false
      res.render("products",{
        status,
        payload,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        nextLink,
        prevLink,
        user,
        admin  
    })
    
} catch (error) {
    console.log(error)

    const payload = []
    const prevPage = ""
    const nextPage = ""
    const status = "error"
    const hasNextPage = false
    const hasPrevPage = false
    const totalPages = 0
    const page = 0
    const nextLink=hasNextPage  ? `/?page=${nextPage}` : " "
    const prevLink= hasPrevPage ? `/?page=${prevPage}` : " "


      res.render("products",{
        status,
        payload,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        nextLink,
        prevLink  
    
    })
}
    
    
    
    

})


export default router;
