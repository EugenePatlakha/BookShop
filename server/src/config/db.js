const sql = require('mssql');

const config = {
    user: 'sa',
    password: '1234',
    server: 'DESKTOP-V5GBJAJ',
    database: 'BookShop',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch((err) => {
        console.error('Database Connection Failed!', err);
        throw err;
    });

module.exports = {
    sql,
    poolPromise,
};
