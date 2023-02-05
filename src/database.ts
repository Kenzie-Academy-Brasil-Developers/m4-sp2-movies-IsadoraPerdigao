import { Client } from "pg";

const client: Client = new Client({
    user: "isadora",
    password: "q1q2q3",
    host: "localhost",
    database: "m4_entrega_movies",
    port: 5432
})

const startDataBase = async() : Promise<void> => {
    await client.connect()
    console.log("Database connected")
}

export { client, startDataBase }