const options = {
    // Initialization Options
    // promiseLib: promise
};
const pgp = require('pg-promise')(options);
// const Sequelize = require('sequelize');
// export const db = new Sequelize('dota2bot', 'postgres', 'root', {
//     host: 'database',
//     dialect: 'postgres',
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// });

export class Database {
    private client: any;

    async connect() {

        const conString = "postgres://postgres:root@database:5432/dota2bot";
        // db.authenticate()
        //     .then(res => {
        //         console.log('Connected to db...')
        //     })
        //     .catch(err => {
        //         console.log(1234, err)
        //     });
        this.client = await pgp(conString);
        
        // console.log(this.client);
        return this.client;
    }

    async query(query) {
        return this.client.query(query);
    }

    async one(query) {
        return this.client.one(query);
    }

    async none(query) {
        return this.client.none(query);
    }

    static onConflictString(columns) {
        let query = 'SET ';
        columns.forEach((column, i) => {
            query += `${column} = EXCLUDED.${column}`;
            if (i + 1 < columns.length) query += ', ';
        });
        return query;
    }

    async upsert(columns, table, values) {
        const cs = new pgp.helpers.ColumnSet(columns,
            {table: table});
        const query = pgp.helpers.insert(values, cs) + ' ON CONFLICT (id) DO UPDATE ' +
            Database.onConflictString(columns);
        return await this.client.none(query);
    }

}

export const database = new Database();
