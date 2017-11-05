const typeorm = require("typeorm");
const config = require("./dist/connectionParams").connectionOptions;

const env = process.env.NODE_ENV || 'development';

typeorm.createConnection(
    Object.assign(
        {}, 
        config[env],
        { 
            synchronize: true,
            dropSchema: true
        }
    )
).then(function(connection) {
    console.log("Schema synchronized!");
}).catch(function(error) {
    console.log("Error: ", error);
});
