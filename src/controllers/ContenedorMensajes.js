class ContenedorMensajes {
    constructor (db, tableName) {
        this.db = db;
        this.tableName = tableName;
        //console.log('db: ', db)
        //console.log('tableName: ', tableName)
    }

    async add(obj) {
        try{
            console.log('mensjae a guardar: ', obj)

            //inserto el mensaje en la tabla
            const idCreated = await this.db(this.tableName).insert(obj, ['id']);
            console.log(`mensaje agregado en tabla ${this.tableName}, con id: ${idCreated}`)

            //retorno el id
            return idCreated[0];
            
        }catch(err){
            console.log('ERROR BK')
            if ((err.code == 'ER_NO_SUCH_TABLE') || (err.code == 'SQLITE_ERROR' && err.errno == '1' )) {

                console.log(`La tabla ${this.tableName} no existe`)

                // Si recibo error indicando que la tabla no existe, la crea
                const createMessagesTable = require('../db/createMessagesTable');
                await createMessagesTable();

                console.log(`La tabla ${this.tableName} no existe`)

                //ahora con la tabla creada, inserto el mensaje
                const idCreated = await this.db(this.tableName).insert(obj, ['id']);
                console.log(`mensaje agregado en tabla ${this.tableName}, con id: ${idCreated}`)

                //retorno el id
                console.log('idCreated: ', idCreated)
                return idCreated;
            } else {
                console.log('Error - Hubo un error al tratar de guardar el mensaje: ', err);
            }
        }
    }

    async getById(id){
        try{

            //busco en la db el mensaje con el id recibido
            let mensaje = await this.db(this.tableName).select('*').where('id', '=', id);

            //si existe, devuelvo el mensaje, sino, retorno el mensaje correspondiente
            if (mensaje){
                mensaje = transformRowDataPacketInObj(mensaje)
                return mensaje;
            }else{
                return (`No existe un mensaje con el id ${id}`); 
            }
        }catch(err){

            if ((err.code == 'ER_NO_SUCH_TABLE') || (err.code == 'SQLITE_ERROR' && err.errno == '1' )) {
                // Si recibo error indicando que la tabla no existe, la crea
                const createMessagesTable = require('../db/createMessagesTable');
                await createMessagesTable();

                return (`No existe un mensaje con el id ${id}`); 
            } else {
                console.log('Error - Hubo un error al intentar buscar el mensaje por ID: ', err);
            }
        }
    }

    async getAll(){
        try{
            let mensajes = await this.db.from(this.tableName).select('*');

            //si existen, devuelvo el listsdo de mensajes, sino, retorno el mensaje correspondiente
            if (mensajes){
                mensajes = transformRowDataPacketInObj(mensajes)
                return mensajes;
            }else{
                return ('No hay mensajes cargados');
            }
        }catch(err){

            if ((err.code == 'ER_NO_SUCH_TABLE') || (err.code == 'SQLITE_ERROR' && err.errno == '1' )) {
                // Si recibo error indicando que la tabla no existe, la crea
                const createMessagesTable = require('../db/createMessagesTable');
                await createMessagesTable();

                return ('No hay mensajes cargados');
            } else {
                console.log('Error - Hubo un error al intentar buscar los mensajes: ', err);
            }
        }
    }

    async deleteById(id){
        //verifico si existe el mensaje
        let prod = await this.getById(id)
        if (typeof(prod) === 'string') {
            return (`No existe un mensaje con el id ${id}`);
        }

        //Lo elimino
        try {
            await this.db.from(this.tableName).where('id', '=', id).del();
            console.log('El mensaje se ha eliminado con éxito.')

        } catch (err) {

            if ((err.code == 'ER_NO_SUCH_TABLE') || (err.code == 'SQLITE_ERROR' && err.errno == '1' )) {
                // Si recibo error indicando que la tabla no existe, la crea
                const createMessagesTable = require('../db/createMessagesTable');
                await createMessagesTable();

                return ('No hay mensaje cargados');
            } else {
                console.log('Error - Hubo un error al intentar eliminar el mensaje por ID: ', err);
            }
        }
    }
}

function transformRowDataPacketInObj(rdp){
    var string=JSON.stringify(rdp);
    var json =  JSON.parse(string);
    return json
}




module.exports = ContenedorMensajes // 👈 Export class