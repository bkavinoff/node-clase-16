const db = require('./database').Sqlite3Connection;

const createMessagesTable = async () => {
    try {
        await db.schema.dropTableIfExists('Mensajes') 

        await db.schema.createTable('Mensajes', msgTable =>{
            msgTable.increments('id').primary();
            msgTable.string('email', 100).notNullable()
            msgTable.string('mensaje', 1000).notNullable()
            msgTable.string('messageDateTime', 50).notNullable()
        })

        console.log('Messages table created')

        //db.destroy() //cierro la conexión a la db
        console.log('Conexion a DB cerrada')
    } catch (error) {
        console.log(error.message)
        //db.destroy() //cierro la conexión a la db
        //console.log('Conexion a DB cerrada')
    }
}

createMessagesTable()

module.exports = createMessagesTable