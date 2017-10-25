const typeorm = require("typeorm");
const config = require("./dist/database").fromConfig;

typeorm.createConnection(
    Object.assign(
        {}, 
        config(),
        {
            migrations: [
                `${__dirname}/dist/migrations/*.js`
            ]
        }
    )
).then(async (connection) => {
    await connection.runMigrations()
    console.log("Migrations done!");
    connection.close()
}).catch(function(error) {
    console.log("Error: ", error);
});
