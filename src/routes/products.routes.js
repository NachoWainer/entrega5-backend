import { Router } from "express";
import { ProductManager } from "../dao/dbManagers/productManager.js";
import { productsModel } from "../dao/models/products.js";


const router = Router();
const productHandler = new ProductManager();

router.get('/',async(req,res)=>{
    const limit = req.query.limit
    const data = await productHandler.getProducts()
    if (!limit) return res.send(data)
    else return res.send(data.slice(0,limit))
    
})


router.get('/:pid',async(req,res)=>{
    let id = parseInt(req.params.pid)
    const {status,message,data} = await productHandler.getProductById(id)
    if (data){
        return res.send({status:status,message:`${message}`,value:data})
    }
        else return res.send({status:status,message:`${message}`,value:data})
        
})

router.post('/',async(req,res)=>{
    const {title, description, code, price, status, stock, category, thumbnail} = req.body
    
    const {stats,message,data} = await productHandler.addProduct(title,description,code,price,status,stock,category,thumbnail,req.app.get('socket'))
    res.send({status:stats,message:`${message}`,value:data})
})  

router.put('/:pid',async(req,res)=>{
    let id = parseInt(req.params.pid)
    const {title, description, code, price, status, stock, category, thumbnail} = req.body
    const checkeo = ["title", "description", "code", "price", "status", "stock", "category", "thumbnail"]
    const result = []
    let contador = 0;
    for (let prop in req.body) {
        contador ++
        if (!checkeo.includes(prop)) result.push({"stats":404,"message":`La propiedad ${[prop]} no es válida`})}
    if (contador === 0) return res.send({"status":400,"message":"No se han solicitado cambios"})
    if (title !== undefined) result.push(await productHandler.updateProduct(id,"title",title))
    if (description !== undefined) result.push(await productHandler.updateProduct(id,"description",description))
    if (code !== undefined) result.push(await productHandler.updateProduct(id,"code",code))
    if (price !== undefined) result.push(await productHandler.updateProduct(id,"price",price))
    if (status !== undefined) result.push(await productHandler.updateProduct(id,"status",status))
    if (stock !== undefined) result.push(await productHandler.updateProduct(id,"stock",stock))
    if (category !== undefined) result.push(await productHandler.updateProduct(id,"category",category))
    if (thumbnail !== undefined) result.push(await productHandler.updateProduct(id,"thumbnail",thumbnail))
    res.send(result)
})
router.delete('/:pid',async(req,res)=>{
    let id = parseInt(req.params.pid)
    const {stats,message,data} = await productHandler.deleteProduct(id)
    res.send({stats,message,data})
})



export default router