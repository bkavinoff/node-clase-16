// Configuración base de datos
const knex = require('knex');
const path = require('path')

// MySQL
const config = {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'coderhouse'
    },
    pool: { min: 0, max: 7 }
  };

//SQLite3
const DBSOURCE = path.join(__dirname, './sqlite/db.sqlite');
console.log('sqlite path: ', DBSOURCE)
const configSQLite3 = ({
  client: 'sqlite3',
  connection: {
    filename: DBSOURCE
  },
  useNullAsDefault: true
});

const MySQLConnection = knex(config);
const Sqlite3Connection = knex(configSQLite3);

module.exports = { MySQLConnection, Sqlite3Connection };
