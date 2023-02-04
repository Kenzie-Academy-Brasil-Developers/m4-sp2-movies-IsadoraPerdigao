import { Request, Response, NextFunction } from "express"
import { client } from "./database"

const validateNewMovie = async (request: Request, response: Response, next: NextFunction) => {
    const movieName = request.body.name
    const query: string = `
        SELECT name FROM movies WHERE name = '${movieName}';
    ` 
    const queryResult = await client.query(query)
    const movieOnDB = queryResult.rows

    if(movieOnDB) {
        return response.status(409).json({
            message: "Movie already exists."
        })
    }

    return next()
}

export { validateNewMovie }