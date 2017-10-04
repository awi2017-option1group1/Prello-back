export var connectionOptions = {
    'development': {
        driver: {
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'test_user',
            password: 'test',
            database: 'test'
        },
        autoSchemaSync: true,
        entities: [__dirname + '/entities/*.js'],
    },
    'production': {
        driver: {
            type: 'postgres',
            url: process.env.DATABASE_URL
        },
        entities: [__dirname + '/entities/*.js'],
    }
};
//# sourceMappingURL=connectionParams.js.map