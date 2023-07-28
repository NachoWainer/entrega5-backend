import fs from "fs"


export class Cart{
    constructor(id,products){
    this.id=id;
    this.products = products;
}}
export class CartManager{

    constructor(){ 
        this.path ="../data/carts.json"}

    addCart = async( 
        )=>{
            const cart= new Cart(
                1,
                []          
            )
        try{    
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const content = JSON.parse(data);
            if (content.length === 0)  cart.id = 1 
            else cart.id =  content.length + 1;
            content.push(cart)
            await fs.promises.writeFile(this.path,JSON.stringify(content,null,'\t'))
            return {status:202,message:"Carrito agregado",value:[]}
        }catch(error){
            const arr = [] 
            arr.push(cart)
            await fs.promises.writeFile(this.path, JSON.stringify(arr, null, '\t'));
            return {status:202,message:"Carrito agregado",value:[]}

        }
      
    }

    getCartById = async (cartId) =>{

        try {
            const data = await fs.promises.readFile(this.path,'utf-8')
            const carts = JSON.parse(data)
            const value = carts.find(e => e.id === cartId)
            if(value) {
                return {status:202,message:"Producto encontrado",data:value}}
            else {
                return {status:404,message:"No hay productos con ese ID",data:[]}
        }
        } catch (error) {
            return{status:404,message:"No existen productos",data:[]}}
    
}

    addProductToCartIdById = async(CartId,ProductId) =>{
        try{
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const carts = JSON.parse(data)
            if (!carts.find(cart=>cart.id === CartId)){ 
                return {status:404,message:"No hay carrito con ese ID",value:[]}
            }
            else {
                const cart = carts[carts.findIndex(e=>e.id === CartId)]
                console.log(cart)
                
                const product = cart.products.find(e => e.id === ProductId)
                let status, message
                console.log(product)
                if (product !== undefined){ 
                product.quantity += 1
                status = 202
                message = "cantidad actualizada"
                }
                else {
                    cart.products.push({id:ProductId, quantity:1})
                    status = 202
                    message = "Producto agregado al carrito con Id"+" "+`${CartId}`
                }
                await fs.promises.writeFile(this.path, JSON.stringify(carts,null,"\t"))
                return{status:status,message:message,value:[]}
                }
                
            } 
        catch(error){
            console.log(error)
            return
        }




    }
    
}

