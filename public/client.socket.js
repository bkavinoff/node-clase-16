const socket = io()

//productos:
const addProductFormContainer = document.querySelector('#addProductFormContainer')
const addProductForm = document.querySelector('#addProductForm')

const txtNombreProd = document.querySelector('#txtNombreProd')
const txtThumbnailProd = document.querySelector('#txtThumbnailProd')
const txtPriceProd = document.querySelector('#txtPriceProd')
const txtDescripcionProd = document.querySelector('#txtDescripcionProd')
const txtCodigoProd = document.querySelector('#txtCodigoProd')
const txtStockProd = document.querySelector('#txtStockProd')

const productsPool = document.querySelector('#productsPool')

//chat:
const addMessageForm = document.querySelector('#addMessageForm')
const txtUserEmail = document.querySelector('#txtUserEmail')
const txtUserMessage = document.querySelector('#txtUserMessage')
const chatPool = document.querySelector('#chatPool')

//EVENT LISTENERS
addProductForm.addEventListener('submit', event => {
    event.preventDefault()
    const productInfo = {
        nombre:txtNombreProd.value, 
        thumbnail:txtThumbnailProd.value, 
        precio:txtPriceProd.value, 
        descripcion:txtDescripcionProd.value,
        codigo:txtCodigoProd.value,
        stock:txtStockProd.value,
        timestamp:getTimesTamp()
    }
    console.log('click en enviar producto')
    SendNewProduct(productInfo)
})

addMessageForm.addEventListener('submit', event => {
    event.preventDefault()

    //obtengo la fecha y hora
    const messageDateTime = getTimesTamp()

    const messageInfo = {
        email:txtUserEmail.value, 
        mensaje:txtUserMessage.value, 
        messageDateTime:messageDateTime
    }

    console.log('click en enviar producto')
    SendNewMessage(messageInfo)
})

//FUNCTIONS 

function getTimesTamp(){
    let [date, time] = new Date().toLocaleString('en-GB').split(', ');
    const messageDateTime = date + ' - ' + time;
    return messageDateTime
}

function RenderProduct(products){
    fetch('./ListadoPoductos.hbs').then(response =>{
        response.text().then(plantilla =>{
            //vacío el contenedor de productos
            productsPool.innerHTML = "" 

            //cargo los productos recibidos
            products.forEach(prod =>{
                const template = Handlebars.compile(plantilla)
                const html = template(prod)
                productsPool.innerHTML += html
            }) 
        })
    })
}

function RenderAddProductForm(){
    fetch('./addProductForm.hbs').then(response =>{
        response.text().then(plantilla =>{
            const template = Handlebars.compile(plantilla)
            const html = template(plantilla)
            addProductFormContainer.innerHTML = html
        })
    })
}

function RenderMessages(messagesInfo){
    if (messagesInfo != 'No hay mensajes'){
        const html = messagesInfo.map((msg) => {
            return (`<div>
            <strong style="color:blue">${msg.email} </strong>
            <span style="color:brown">[${msg.messageDateTime}]: </span>
            <em style="color:green">${msg.mensaje}</em>
            </div>`)
        }).join(' ')
        chatPool.innerHTML=html
    }
}

//MESSAGES TO THE SERVER
function SendNewProduct(productInfo){
    console.log('Cliente: Enviando producto al server: ', productInfo)
    socket.emit('client:addProduct', productInfo)
}
function SendNewMessage(messageInfo){
    console.log('Cliente: Enviando mensaje al server: ', messageInfo)
    socket.emit('client:addMessage', messageInfo)
}


//MESSAGES FROM THE SERVER
socket.on('server:ListProducts', productos =>{
    RenderProduct(productos)
})

socket.on('server:renderMessages', messagesInfo =>{
    RenderMessages(messagesInfo)
})