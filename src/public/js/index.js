const socket=io();

const addToCartButton = document.getElementById("AddToCart");



socket.on("productos", (productos) => {
    const productElement = document.getElementById("product");
    if (productElement !== null){
    productElement.innerHTML = "";
    
    productos.forEach((producto) => {
    const content = document.createElement("div");
    content.innerHTML = `
    <div class="producto ">

    <p>ID:${producto.id}</p>
    <p>category: ${producto.category}</p>
    <div class = "productInfo">
    <div class="productNameStock">
    <p class="productName">title: ${producto.title}</p>
    <p class="productName"> description: ${producto.description}</p>
    <p class="productName">code: ${producto.code}</p>

    <p>(stock: ${producto.stock})</p>
    </div>
    <p class="productName">price: $  ${producto.price}</p>
    <p>status: ${producto.status}</p>
    </div>
    </div>
  `;
      
      productElement.appendChild(content);
    });}
    
  });

  socket.on("realTimeProducts", (realTimeProducts) => {
    const RTproductElement = document.getElementById("realTimeProduct");
    

    if (RTproductElement !== null){
    RTproductElement.innerHTML = "";
    
    realTimeProducts.forEach((producto) => {
    const content = document.createElement("div");
    content.innerHTML = `
    <div class="producto ">

    <p>ID:${producto.id}</p>
    <p>category: ${producto.category}</p>
    <div class = "productInfo">
    <div class="productNameStock">
    <p class="productName">title: ${producto.title}</p>
    <p class="productName"> description: ${producto.description}</p>
    <p class="productName">code: ${producto.code}</p>

    <p>(stock: ${producto.stock})</p>
    </div>
    <p class="productName">price: $  ${producto.price}</p>
    <p>status: ${producto.status}</p>
    </div>
    </div>
  `;
      
      RTproductElement.appendChild(content);
    });}
    ;});


/////////////////////////////////////////////////////////////

let user;
let chatBox = document.getElementById("chatBox")

Swal.fire({
  title: "Escribe tu nombre",
  input:"text",
  text:"Ingresa el usuario para identificarte en el chat",
  inputValidator: (value) => {
    return !value && "Necesitas escribir tu nombre para continuar!"
  },
  allowOutsideClick:false
}).then(result =>{
  user =result.value
}) 

chatBox.addEventListener("keyup",evt=>{
  if(evt.key === "Enter"){
    if(chatBox.value.trim().length>0){
      socket.emit("message",{user:user,message:chatBox.value})
      chatBox.value=""
    }
  }
})



    socket.on("messageLogs", data => {
      let log = document.getElementById("messageLogs")
      let messages = "";
      data.forEach(message=>{
        messages = messages + `${message.user} dice: ${message.message} </br>`
      })
      log.innerHTML = messages
    })