const typeorm = require("typeorm");
const config = require("./dist/database").fromConfig;

const env = process.env.NODE_ENV || 'development';

typeorm.createConnection(
    Object.assign(
        {}, 
        config(),
        { synchronize: true }
    )
).then(function(connection) {
    console.log("Schema synchronized!");
}).catch(function(error) {
    console.log("Error: ", error);
});
