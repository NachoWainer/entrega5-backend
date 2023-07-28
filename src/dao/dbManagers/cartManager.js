import cartsModel from "../models/carts.js";
export class Cart{
    constructor(id,products){
    this.id=id;
    this.products = products;
}}
export class CartManager{

    constructor(){}

    addCart = async(  // LISTO
        )=>{
            const cart= new Cart(
                1,
                []          
            )
        try{    
            const content = await cartsModel.find().lean();

            if (content.length === 0)  cart.id = 1 
            else cart.id =  content.length + 1;
            
            await cartsModel.create(cart) 
            return {status:202,message:"Carrito agregado",value:[]}
        }catch(error){

            await cartsModel.create(cart) 
            return {status:202,message:"Carrito agregado",value:[]}

        }
      
    }

    getCartById = async (cartId) =>{ //LISTO

        try {
            const carts = await cartsModel.find().lean();  
            const value = carts.find(e => e.id === cartId)
            if(value) {
                return {status:202,message:"Producto encontrado",data:value}}
            else {
                return {status:404,message:"No hay productos con ese ID",data:[]}
        }
        } catch (error) {
            return{status:404,message:"No existen productos",data:[]}}
    
}
deleteProductFromCartIdById = async(CartId,ProductId)=>{
    try{
        const cart = await cartsModel.findOne({id:CartId}).lean() 
        if (cart === undefined){ 
            return {status:404,message:"No hay carrito con ese ID",value:[]}
        }
        else {
            console.log(cart.products)
            const product = cart.products.find(e => e._id === ProductId)
            let status, message

            if (product !== undefined){ 
            await cartsModel.updateOne({id: CartId},{$pull: {products:{id: ProductId}}})
            status = 202
            message = "producto eliminado"
            }
            else {
                status = 202
                message = "El producto no existe en el carrito"
            }
            return{status:status,message:message,value:[]}
            }
            
        } 
    catch(error){
        console.log(error)
        return
    }
    

}

    addProductToCartIdById = async(CartId,ProductId) =>{
        try{
            const cart = await cartsModel.findOne({id:CartId}).lean() 
            if (cart === undefined){ 
                return {status:404,message:"No hay carrito con ese ID",value:[]}
            }
            else {
                const product = cart.products.find(e => e.id === ProductId)
                let status, message

                if (product !== undefined){ 
                    product.quantity +=1
                await cartsModel.updateOne({id: CartId}, cart)
                status = 202
                message = "cantidad actualizada"
                }
                else {
                    cart.products.push({id:ProductId, quantity:1})
                    await cartsModel.updateOne({id: CartId}, cart)
                    status = 202
                    message = "Producto agregado al carrito con Id"+" "+`${CartId}`
                }
                return{status:status,message:message,value:[]}
                }
                
            } 
        catch(error){
            console.log(error)
            return
        }

        




    }
    
}

