import DBConnexion from '../db/dbCon.js';
import { toFormat } from '../helpers/helper.js';

export default class Model{
    static db = new DBConnexion();
    table = this.name.toLowerCase() + "s"
    
    constructor() {
    }

    static async all(){
        const sql = `SELECT * FROM ${this.table || this.name.toLowerCase() + "s"}`
        return this.execute(sql);
    }

    static  async getById(id){
        const data = await this.findByAttr('id', id);
        return data
    }

    static async findByAttr(attr, value, isPart = false){ 

        const sql = `SELECT * FROM ${this.table || this.name.toLowerCase() + "s"} where ${attr} ${ isPart ? 'LIKE \'%'+value+"%\'" : '= ' + value}`
        console.log(sql)
        return this.execute(sql);
    }
    // static async findRelation(attrs){
    //     let keysToInsert = []
        
    //     console.log(attrs);

    //     Object.keys(attrs).forEach((value) =>{
    //          keysToInsert.push(value+" = '"+attrs[value]+"'");
    //     })

    //     const sql = `select id from ${this.table || this.name.toLowerCase() + "s"} where ${keysToInsert.join(' and ')}`

    //     console.log(attrs);
    //     return this.execute(sql)
    // }
    static save(data) {
        data.createdAt = toFormat('YYYY-MM-DD HH:MM:SS')
        data.updatedAt = data.createdAt
        let dataToInsert = ""
        let keysToInsert = ""

        Object.keys(data).forEach((value) => keysToInsert += value+",")
        Object.keys(data).forEach((value) => dataToInsert += "'"+data[value]+"',")
        const sql = `insert into ${this.table || this.name.toLowerCase() + "s"} (${
            keysToInsert.slice(0, keysToInsert.length - 1).slice(0,keysToInsert.length)
        }) VALUES (${dataToInsert.slice(0, dataToInsert.length - 1)})`
        
        console.log(sql);
        
        return this.execute(sql);
    }

    static update(id, data){
        data.updatedAt = toFormat('YYYY-MM-DD HH:MM:SS')
        let dataToInsert = ""
        
        Object.keys(data).forEach((value) => dataToInsert += value +`='${data[value]}',`)
        dataToInsert = dataToInsert.slice(0, dataToInsert.length - 1)


        const sql = `update ${this.table || this.name.toLowerCase() + "s"} set ${dataToInsert} where id = ${id}`
        
        // console.log(sql);
        
        return this.execute(sql);

    }
    static async getValFromRelation(_data = ["*"], _associateTable, _condition){

        const sql = `select ${_data.length > 1 ? _data.join(' , ') : _data[0] || '*'} from ${_associateTable} where ${_condition || 'id = null'}`;
        return this.execute(sql);
    }

    static delete(id){
        const sql = `DELETE FROM ${this.table || this.name.toLowerCase() + "s"} where id = ${id}`
        return this.execute(sql);
    }

    static async execute(sql){
        await this.db.createConnection();
        await this.db.getConnection();

        try {
            const data = await this.db.connection.query(sql);
            return data[0];
        } catch (error) {
            throw {
                error
            };
        }
    }

    // static async idexist(id){
    //     try{
    //         const data = await this.findByAttr('id', id);
    //        console.log(data)
    //         return true;
    //     }catch (error){
    //         throw{
    //             code: error.code,
    //             message: error.sqlMessage
    //         };
    //     }
    // }
}