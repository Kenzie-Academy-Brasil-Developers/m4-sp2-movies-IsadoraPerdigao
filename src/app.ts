import express, { Application } from "express"
import { startDataBase } from "./database"
import { createMovie, listMovies } from "./functions"
import { parseOrderParam, parsePageParam, parsePerPageParam, parseSortParam, validateNewMovie } from "./middlewares"

const app: Application = express()
app.use(express.json())

app.post("/movies", validateNewMovie, createMovie)

app.get("/movies", parsePageParam, parsePerPageParam, parseOrderParam, parseSortParam, listMovies)

app.listen(3000, async () => {
    await startDataBase()
    console.log("Server is running!")
})