import {Client} from "pg";
import {sleep} from "./main";

export class DB {
    private static instance?: DB;
    private client: Client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'rius_04',
        password: '1',
        port: 5432
    })
    constructor() {}
    public static getInstance() {
        if (this.instance == null) {
            this.instance = new DB();
        }
        return this.instance
    }
    public async init() {
        await this.client.connect()
    }

    async query(q: string) {
        let res = await this.client.query(q)
        sleep(500)
        return res
    }
    async insertIntoLog(value: number, product_type_id: number, range_id: number = -1) {
        let range = null
        if (range_id != -1) range = range_id
        return await this.query(`INSERT INTO log 
                     (timestamp, value, product_type_id, range_id) values 
                     (now(), ${value}, ${product_type_id}, ${range});`)
    }
}
