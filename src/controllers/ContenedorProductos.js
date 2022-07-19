class ContenedorProductos {
    constructor (db, tableName) {
        this.db = db;
        this.tableName = tableName;
        //console.log('db: ', db)
        //console.log('tableName: ', tableName)
    }

    async add(obj) {
        try{
            console.log(obj)

            //inserto el producto en la tabla
            const idCreated = await this.db(this.tableName).insert(obj, ['id']);
            console.log(`producto agregado en tabla ${this.tableName}, con id: ${idCreated}`)

            //retorno el id
            return idCreated[0];
            
        }catch(err){

            if ((err.code == 'ER_NO_SUCH_TABLE') || (err.code == 'SQLITE_ERROR' && err.errno == '1' )) {
                // Si recibo error indicando que la tabla no existe, la crea
                const createProductsTable = require('../db/createProductsTable');
                await createProductsTable();

                //ahora con la tabla creada, inserto el producto
                const idCreated = await this.db(this.tableName).insert(obj, ['id']);
                console.log(`producto agregado en tabla ${this.tableName}, con id: ${idCreated}`)

                //retorno el id
                console.log('idCreated: ', idCreated)
                return idCreated;
            } else {
                console.log('Error - Hubo un error al tratar de guardar el producto: ', err);
            }
        }
    }

    async getById(id){
        try{

            //busco en la db el producto con el id recibido
            let producto = await this.db(this.tableName).select('*').where('id', '=', id);

            //si existe, devuelvo el producto, sino, retorno el mensaje correspondiente
            if (producto){
                producto = transformRowDataPacketInObj(producto)
                return producto;
            }else{
                return (`No existe un producto con el id ${id}`); 
            }
        }catch(err){

            if ((err.code == 'ER_NO_SUCH_TABLE') || (err.code == 'SQLITE_ERROR' && err.errno == '1' )) {
                // Si recibo error indicando que la tabla no existe, la crea
                const createProductsTable = require('../db/createProductsTable');
                await createProductsTable();

                return (`No existe un producto con el id ${id}`); 
            } else {
                console.log('Error - Hubo un error al intentar buscar el producto por ID: ', err);
            }
        }
    }

    async getAll(){
        try{
            let products = await this.db.from(this.tableName).select('*');

            //si existen, devuelvo el listsdo de productos, sino, retorno el mensaje correspondiente
            if (products){
                products = transformRowDataPacketInObj(products)
                return products;
            }else{
                return ('No hay productos cargados');
            }
        }catch(err){

            if ((err.code == 'ER_NO_SUCH_TABLE') || (err.code == 'SQLITE_ERROR' && err.errno == '1' )) {
                // Si recibo error indicando que la tabla no existe, la crea
                const createProductsTable = require('../db/createProductsTable');
                await createProductsTable();

                return ('No hay productos cargados');
            } else {
                console.log('Error - Hubo un error al intentar buscar los productos: ', err);
            }
        }
    }

    async deleteById(id){
        //verifico si existe el producto
        let prod = await this.getById(id)
        if (typeof(prod) === 'string') {
            return (`No existe un producto con el id ${id}`);
        }

        //Lo elimino
        try {
            await this.db.from(this.tableName).where('id', '=', id).del();
            console.log('El producto se ha eliminado con éxito.')

        } catch (err) {

            if ((err.code == 'ER_NO_SUCH_TABLE') || (err.code == 'SQLITE_ERROR' && err.errno == '1' )) {
                // Si recibo error indicando que la tabla no existe, la crea
                const createProductsTable = require('../db/createProductsTable');
                await createProductsTable();

                return ('No hay productos cargados');
            } else {
                console.log('Error - Hubo un error al intentar eliminar el producto por ID: ', err);
            }
        }
    }
}

function transformRowDataPacketInObj(rdp){
    var string=JSON.stringify(rdp);
    var json =  JSON.parse(string);
    return json
}




module.exports = ContenedorProductos // 👈 Export class