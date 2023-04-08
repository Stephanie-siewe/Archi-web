import 'dotenv/config';

import mysql2 from 'mysql2/promise';

/**
 *create an instance of database connexion
 *
 * @export
 * @class DBConnexion
 */
export default class DBConnexion {
    constructor() {
        this.connection = null
    }

    async createConnection(){
        this.connection = await mysql2.createConnection({
            host: process.env.HOST || "localhost",
            user: process.env.DB_USERNAME || 'root',
            password: process.env.DB_MDP || "",
            database: process.env.DB_NAME || 'test'
        });
    }
    /**
    * get connexion to execute oparation
    *
    * @memberof DBConnexion
    * @return void
    */
    async getConnection(){
        if (this.connection == null ||  this.connection.threadId) return;
        await this.connection.connect((err) => {
            console.error(err != null ? err.sqlMessage : '');
            return;
        });
        console.log('connected as id ' + this.connection.threadId);
    }
    /**
     *
     *
     * @memberof DBConnexion
     * @return void
    */
    removeConnection(){
        if (this.connection == null ) return;
        this.connection.destroy((err) => {
            console.error('error disconnecting: ' + err.stack);
            return;
        });
        this.connection = null;
        console.log('connexion removed !!!', this.connection);
    }
}