import { ConnectionOptions } from 'typeorm';
interface MultipleConnections {
    [key: string]: ConnectionOptions;
}
export const connectionOptions: MultipleConnections = {development: {
    driver: {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'test_user',
        password: 'test',
        database: 'test'
    },
    autoSchemaSync: true,
    entities: [__dirname + 'dist/entities/*.js'],
},
production: {
    driver: {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'test_user',
        password: 'test',
        database: 'test'
    },
    autoSchemaSync: true,
    entities: [__dirname + 'dist/entities/*.js'],
}}