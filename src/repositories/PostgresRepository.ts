import { injectable } from "inversify";
import { database, Database } from './../PostgreSqlDatabase';
require("reflect-metadata");

@injectable()
class PostgresRepository {
    protected database: Database;
    constructor() {
        this.database = database;
    }
}

export { PostgresRepository } 