import  {Router}  from "express";


import  {CartManager}  from "../dao/dbManagers/cartManager.js";
import cartsModel from "../dao/models/carts.js";
import { productsModel } from "../dao/models/products.js";
import mongoose from "mongoose";

const router = Router();
const cartHandler = new CartManager;



router.post('/',async function(req,res){ // listo
  let cart = {
    "products": []
  }
  
  try {
    await cartsModel.create(cart)
    res.send({status:"success",message:"OK",value:[]})
    
  } catch (error) {
    res.send({status:"error",message:"error",value:[]}) 
  } 
})

router.get('/:cid',async function(req,res){ //listo
  let id = req.params.cid
  try {
    const cart = await cartsModel.findById(id).populate("products").lean()
    res.send({status:"success",message:"Carrito obtenido correctamente",value:cart})
    
  } catch (error) {
    res.send({status:"error",message:error,value:[]})
    
  }
 
})

router.post('/:cid/product/:pid',async function(req,res){ // listo
  const cartId = req.params.cid;
  let productId = req.params.pid;
  try {
    const cart = await cartsModel.findById(cartId);

    if (!cart) {
      return res.send({ status: 'error', message: 'Carrito no encontrado', value: [] })}

      if (cart.products.length === 0) {
        await cartsModel.updateOne({_id: cartId},{$push:{products:{_id: productId, quantity:1 }}})
        return res.send({ status: 'success', message: 'producto agregado', value: [] })}

      else {
        let aux = await cartsModel.findOne({ _id: cartId, "products._id": productId });
        if (aux == null){
          await cartsModel.updateOne({_id: cartId},{$push:{products:{_id: productId, quantity:1 }}})
          return res.send({ status: 'success', message: 'producto agregado', value: [] })
        }
        else {
          await cartsModel.updateOne({ _id: cartId, "products._id": productId },{ $inc: { "products.$.quantity": 1 }})
          return res.send({ status: 'success', message: 'producto agregado', value: [] })
        } 
      }

  } catch (error) {
    res.send({ status: 'error', message: error, value: [] });
  }
});


router.delete('/:cid/product/:pid',async function(req,res){ //listo
  const cartId = req.params.cid;
  let productId = req.params.pid;
 

  try {
    const cart = await cartsModel.findById(cartId);

    if (!cart) {
      return res.send({ status: 'error', message: 'Carrito no encontrado', value: [] })}

      if (cart.products.length === 0) { return res.send({ status: 'success', message: 'El carrito esta vacio', value: [] })}

      else {
        let aux = await cartsModel.findOne({ _id: cartId, "products._id": productId });
        if (aux == null){
          return res.send({ status: 'success', message: 'El producto no esta en el carrito', value: [] })
        }
        else {
          
          await cartsModel.updateOne({ _id: cartId},{ $pull: { products: { _id: productId } } })
          return res.send({ status: 'success', message: 'producto eliminado', value: [] })
        } 
      }

  } catch (error) {
    res.send({ status: 'error', message: error, value: [] });
  }
   
})

router.put ('/:cid',async function(req,res){
  let productos = req.body 
  const cartId = req.params.cid;
  try {
    const cart = await cartsModel.findById(cartId);
    if (!cart) {
      return res.send({ status: "error", message: "Carrito no encontrado" });
    }
    if (productos.length === 0) return res.send({status:"success", message: "no hay productos a agregar"})
    productos.forEach(async element => {
      
        let aux = await cartsModel.findOne({ _id: cartId, "products._id": element.payload._id });
        if (aux == null){
          await cartsModel.updateOne({_id: cartId},{$push:{products:{_id: element.payload._id, quantity:1 }}})
        }
        else {
          await cartsModel.updateOne({ _id: cartId, "products._id": element.payload._id },{ $inc: { "products.$.quantity": 1 }})
        } 
        
      })
      return res.send({ status: 'success', message: 'producto agregado', value: [] })    

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error en el servidor" });
  }
});
  

router.put ('/:cid/products/:pid',async function(req,res){
  let {cantidad} = req.body 
  cantidad = parseInt(cantidad)
  if (cantidad < 0) return res.send({ status: 'error', message: 'cantidad invalida', value: [] })   
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    const cart = await cartsModel.findById(cartId);
    if (!cart) {
      return res.send({ status: "error", message: "Carrito no encontrado" });
    }
        let aux = await cartsModel.findOne({ _id: cartId, "products._id": productId});
        if (aux == null){
          await cartsModel.updateOne({_id: cartId},{$push:{products:{_id: productId, quantity: cantidad }}})
          return res.send({ status: 'success', message: 'producto agregado', value: [] })   
        }
        else {
          await cartsModel.updateOne({ _id: cartId, "products._id": productId },{ "products.$.quantity": cantidad })
        } 
        
     
      return res.send({ status: 'success', message: 'cantidad actualizada', value: [] })    

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error en el servidor" });
  }
});
 
  

router.delete('/:cid',async function(req,res){
  let CartId = req.params.cid
  try {
    const cart = await cartsModel.findById(CartId);
    if (!cart) {

      return res.send({ status: "error", message: "Carrito no encontrado" });
    }
    await cartsModel.updateOne({ _id: CartId},{ $set: { products: [] } })

    res.send({status:"success",message:"se eliminaron todos los productos del carrito ",value:[]})

  } catch (error) {
    res.send({status:"error",message:error,value:[]})
    
  }
  

})
export default router