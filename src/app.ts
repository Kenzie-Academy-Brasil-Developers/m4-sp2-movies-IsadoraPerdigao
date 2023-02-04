import express, { Application } from "express"
import { startDataBase } from "./database"
import { createMovie } from "./functions"
import { validateNewMovie } from "./middlewares"

const app: Application = express()
app.use(express.json())

app.post("/movies", validateNewMovie, createMovie)

app.listen(3000, async () => {
    await startDataBase()
    console.log("Server is running!")
})