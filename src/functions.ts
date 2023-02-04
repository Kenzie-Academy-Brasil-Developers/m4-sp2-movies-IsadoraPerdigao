import { request, Request, Response } from "express";
import format from "pg-format";
import { client } from "./database";
import { iMovie, MovieCreate, MovieResult } from "./interfaces";

const createMovie = async (request: Request, response: Response) : Promise<Response> => {
   
    const movieDataRequest: MovieCreate = request.body
    const movieRequestKeys = Object.keys(movieDataRequest)
    const movieRequestValues = Object.values(movieDataRequest)

    const query: string = format(`
        INSERT INTO
            movies (%I)
        VALUES 
            (%L)
        RETURNING *;
    `,
    movieRequestKeys,
    movieRequestValues)

    let queryResult = {} as MovieResult

    try {
        queryResult = await client.query(query)
    } catch (error: unknown) {
        if(error instanceof Error) {
            return response.status(409).json({
                message: error.message
            })
        }
    }

    return response.status(201).json(queryResult.rows)
}

export { createMovie }