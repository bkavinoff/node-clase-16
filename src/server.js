
//importo dotenv para poder acceder a las variables de entorno que declare en el archivo .env
require('dotenv').config()

const express = require('express')
const rutas = require('./routes/index')
const path = require('path')
const port = 8080 //lee del archivo .env

const app = express()

//declaro mis controllers
const ContenedorProductos = require('./controllers/ContenedorProductos')
const ContenedorMensajes = require('./controllers/ContenedorMensajes')

//archivos estaticos:
app.use(express.static(path.join(__dirname,'../public')))

//para poder acceder al body
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//rutas
app.use('/', rutas)

//middleware de error:
app.use((error, req, res, next)=>{    
    console.log(error.statusMessage)
    res.status(500).send(error.message)
    //res.error(error)
})

//DB
const productsDB = require('./db/database').MySQLConnection;
const productsList = new ContenedorProductos(productsDB, 'Productos');
const messagesDB = require('./db/database').Sqlite3Connection;
const messageList = new ContenedorMensajes(messagesDB, 'Mensajes');

//cargo algunos productos al correr el server:
const firstproducts = [
    {"nombre":"silla","precio":1500,"thumbnail":"https://www.torca.com.ar/thumb/00000000000484199462148419_800x800.png", "descripcion":"Silla de madera", "codigo":"si01", "stock":5},
    {"nombre":"mesa","precio":8000,"thumbnail":"https://www.espacity.com/w/wp-content/uploads/01476001000020_1-768x624.jpg", "descripcion":"Mesa de madera", "codigo":"me01", "stock":5},
    {"nombre":"mantel","precio":500,"thumbnail":"https://arredo.vteximg.com.br/arquivos/ids/246157-800-800/51011G03329-B_0.jpg", "descripcion":"Mantel colorido", "codigo":"ma01", "stock":5},
    {"nombre":"tenedor","precio":50,"thumbnail":"https://http2.mlstatic.com/D_NQ_NP_971536-MLA44437104387_122020-O.webp", "descripcion":"tenedor de madera", "codigo":"te01", "stock":5}
]


const loadProducts = async () =>{
    const producto = await productsList.getById(1)
    //console.log('producto:', producto)
    if (producto.length === 0)
    {
        firstproducts.forEach(async prod => {
            await productsList.add(prod)
        });
    }
} 

loadProducts()

//socket.io
const { Server: IOServer } = require('socket.io')
const expressServer=app.listen(port, (err) =>{
    console.log(`Servidor escuchando puerto ${port}`)
    if (err){
        console.log(`Hubo un error al iniciar el servidor: ${err}`)
    }else{
        console.log(`Servidor iniciado, escuchando en puerto: ${port}`)
    }
})

const io = new IOServer(expressServer)

io.on('connection', async socket =>{
    console.log(`Se conectó un cliente con id: ${socket.id}`)

    //obtengo los productos de la DB
    let productos = await productsList.getAll();

    //emito los productos al cliente
    socket.emit('server:ListProducts', productos)
    
    //agregar producto
    socket.on('client:addProduct', async productInfo => {

        //agrego el producto:
        await productsList.add(productInfo)
        productos = productos = await productsList.getAll();

        //envío el listado actualizado a todos los clientes
        io.emit('server:ListProducts', productos)

    })

    //obtengo los mensajes de la DB
    let messagesArray = await messageList.getAll();

    //emito los productos al cliente
    socket.emit('server:renderMessages', messagesArray)

    //recibo nuevo mensaje del cliente
    socket.on('client:addMessage', async messageInfo => {
        //agrego el mensaje:
        await messageList.add(messageInfo)

        //obtengo el listado de productos:
        messagesArray = await messageList.getAll()

        //envío el listado actualizado a todos los clientes:
        io.emit('server:renderMessages', messagesArray)

    })
})

