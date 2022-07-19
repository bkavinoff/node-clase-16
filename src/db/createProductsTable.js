const db = require('./database').MySQLConnection;

const createProductsTable = async () => {
    try {
        await db.schema.dropTableIfExists('Productos') 

        await db.schema.createTable('Productos', prodTable =>{
            prodTable.increments('id').primary();
            prodTable.string('nombre', 50).notNullable()
            prodTable.integer('precio').notNullable()
            prodTable.string('thumbnail', 1000).notNullable()
            prodTable.string('timestamp', 50).notNullable()
            prodTable.string('descripcion', 1000).notNullable()
            prodTable.string('codigo', 50).notNullable()
            prodTable.integer('stock').notNullable()
        })
        console.log('Products table created')

        db.destroy() //cierro la conexión a la db
        console.log('Conexion a DB cerrada')
    } catch (error) {
        console.log(error.message)
        //db.destroy() //cierro la conexión a la db
        console.log('Conexion a DB cerrada')
    }
}

createProductsTable()

module.exports = createProductsTable