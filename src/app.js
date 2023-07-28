import express  from "express";
import __dirname from "./utils.js";
import viewRouter from './routes/views.router.js'
import handlebars from 'express-handlebars'
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import sessionRouter from "./routes/sessions.router.js"


import productsRouter from "./routes/products.routes.js"
import cartsRouter from "./routes/carts.routes.js"

import { Server } from "socket.io"
import fs from "fs"
import { productsModel } from "./dao/models/products.js";
import { messagesModel } from "./dao/models/messages.js";

const app =express();
const PORT=8080;
const httpServer = app.listen(8080, ()=>console.log("Server running"))
const socketServer = new Server(httpServer)


mongoose.set('strictQuery',false)
const connection= mongoose.connect('mongodb+srv://nachowainer:NIpg8gSuhgrRI5nP@codercluster.23a6ufo.mongodb.net/ecommerce'
,{
  useNewUrlParser: true,
  useUnifiedTopology: true,

});

app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')

app.use(express.static(__dirname+'/public'))


app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://nachowainer:NIpg8gSuhgrRI5nP@codercluster.23a6ufo.mongodb.net/ecommerce',
    mongoOptions:{ useNewUrlParser: true, useUnifiedTopology: true},
    ttl: 3600
  }),
  secret:"C0d3Rs3CreT2023",
  resave:false,
  saveUninitialized:false
}))





app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)

app.use('/',viewRouter)
app.use('/api/sessions',sessionRouter)




/////////////////////////MONGOOSE///////////////////////////////////////////

global.emitRealTimeProducts = async () => {
    const data = await productsModel.find().lean();  

    socketServer.emit('realTimeProducts', data);
  };

  global.emitProducts = async (data) => {
      
   socketServer.emit('products', data);
  }; 

socketServer.on('connection',async (socket) =>{
    console.log("Inicio la comunicación")
    const productos = await productsModel.find().lean();
    socket.emit('productos',productos)

    let realTimeProducts = await productsModel.find().lean();
    socket.emit('realTimeProducts',realTimeProducts)

    let messages=[]
    socket.on("message",async data=>{
    await messagesModel.create(data)

    messages.push(data)
    socket.emit("messageLogs",messages)
  })


//////////////////////////////FILE SYSTEM//////////////////////////////////////////////////    

/*
socketServer.on('connection',async (socket) =>{
    console.log("Inicio la comunicación")
    const products = await fs.promises.readFile("data/db/products.json",'utf-8')
    const productos = JSON.parse(products)
    socket.emit('productos',productos)

    let realTimeProducts = await fs.promises.readFile("data/products.json",'utf-8')
    realTimeProducts = JSON.parse(realTimeProducts)
    socket.emit('realTimeProducts',realTimeProducts)

    fs.watch("data/products.json",async()=>{
        realTimeProducts = await fs.promises.readFile("data/products.json",'utf-8')
        realTimeProducts = JSON.parse(realTimeProducts)
        socket.emit('realTimeProducts',realTimeProducts)
})*/
   
})
