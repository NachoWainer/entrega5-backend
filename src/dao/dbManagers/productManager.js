import { productsModel } from "../models/products.js";

export class Product{
    constructor(id,title,description,code,price,status,stock,category,thumbnail){
    this.id=id;
    this.title=title;
    this.description=description;
    this.code=code;
    this.price=price;
    this.status=status;
    this.stock=stock;
    this.category=category;
    this.thumbnail=thumbnail;
}}
export class ProductManager{

    constructor(){}

    addProduct = async( //listo
        title, description, code, price, status, stock, category, thumbnail,socket
        )=>{
            if (!isNaN(title)||!isNaN(description)||!isNaN(category)||!isNaN(code))return {status:412,message:"Los campos: title, description , code y category deben ser texto",value:[]};
            if (title === undefined || title.replace(/\s/g, '') === "" || description.replace(/\s/g, '') === "" ||description === undefined || 
                category.replace(/\s/g, '') === ""|| category === undefined || price === undefined || code.replace(/\s/g, '') === ""|| code === undefined || stock === undefined) {
                return {status:412,message:"Los productos a agregar deben incluir 7 campos no vacíos: title, description, price, code, stock. El campo thumbnail es opcional",value:[]};
            }
            if (status === undefined) status = true
            if (isNaN(stock) || Number(stock) === null || isNaN(price) || Number(price) === null) return {status:412,message:"Los campos: price y stock deben ser numeros",value:[]};
            const product= new Product(
                1,
                title,
                description,
                code,
                Number(price),
                Boolean(status),
                Number(stock),
                category,
                thumbnail
            )
        try{    
            const content = await productsModel.find().lean();  
            
        
            if (content.find(element => element.code === code)) {
                return{stats:403,message:"el codigo ya esta en uso",value:[]}
            }
            if (content.length === 0)  product.id = 1 
            else product.id =  content.length + 1;
            
            await productsModel.create(product)
            emitRealTimeProducts()
            return{status:202,message:"Producto agregado",value:[]}
        }catch(error){
            await productsModel.create(product)
            emitRealTimeProducts()
            return{stats:202,message:"Producto agregado",value:[]}

        }
      
    }

    getProducts=async()=> { //listo
        try{
            const data = await productsModel.find().lean();  
            return {status:202,message:"Solicitud aceptada",value:data}
            }
        catch(error){
            return {status:404,message:"No existen productos",value:[]}
            }
        }

    
    getProductById = async (productId) =>{ //listo
        try {
            const data = await productsModel.find().lean();  
            const value = data.find(e => e.id === productId)
            if(value) {
                return {status:202,message:"Producto encontrado",data:value}}
            else {
                return {status:404,message:"No hay productos con ese ID 404",data:[]}
        }
        } catch (error) {
            return{status:404,message:"No existen productos",data:[]}
            
        }
    }

    updateProduct = async(productId, prop , value) =>{ //listo
       
        if ("title" === prop || "description" === prop || "price" === prop ||
            "thumbnail" === prop || "code" === prop || "stock" === prop
            || "category" === prop || "status" === prop){
            if (("stock"===prop && isNaN(value)) || ("stock"===prop && Number(value) === null) || ("price"===prop && isNaN(value)) || ("price"===prop && Number(value) === null)) return {stats:412,message:"Los campos: price y stock deben ser numeros",value:[]};
            if (("title"===prop && !isNaN(value)) || ("title"===prop && value.replace(/\s/g, '') === "") || ("description"===prop && !isNaN(value)) || ("description"===prop && value.replace(/\s/g, '') === "")
            || ("code"===prop && !isNaN(value)) || ("code"===prop && value.replace(/\s/g, '') === "")) return {stats:412,message:"Los campos: title description y code deben ser textos no vacíos",value:[]}; 
            try {
                const products =await productsModel.find().lean(); 
                if(products.find(e=>e.id===productId)){
                   await productsModel.updateOne(productId,{prop:value})
                   emitRealTimeProducts()
                    return{stats:202,message:"actualización exitosa 202",data:[]}
            }
            else{
                
                return{stats:404,message:"No existe producto con ese ID",data:[]}
            }

            
            } catch (error) {
                return{stats:404,message:"No existen productos",data:[]}
                    
            }     
        }

        else {
            return{stats:405,message:"Propiedad invalida",data:[]}
        }
    }

    deleteProduct =async(productId)=>{ // Listo
        try {
            const products = await productsModel.find().lean(); 
       
            if (products.find(e=>e.id===productId)){
                await productsModel.deleteOne({id: productId})
                emitRealTimeProducts()
                 return{stats:202,message:"producto eliminado",data:products}
            }
            else {
                return{stats:404,message:"No existen productos con ese ID",data:[]}
            }
            
        } catch (error) {
            console.error(error)
            return []
        }
        
        
    }


    
}

