import { request, Request, Response } from "express";
import { QueryConfig } from "pg";
import format, { string } from "pg-format";
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

const getPreviousPageURL = (request: Request) : string => {

    let page = request.query.page
    let previousPageURL = "http://localhost:3000/movies?"
    const sort = request.query.sort
    const order = request.query.order
    const perPage = parseInt(request.query.perPage as string)

    if(parseInt(page as string) > 1) {
        previousPageURL += `page=${parseInt(page as string) - 1}&perPage=${perPage}`
    }

    previousPageURL += `&order=${order}`

    previousPageURL += `&sort=${sort}`
   

    return previousPageURL
    
}

const getNextPageURL = (request: Request) : string => {
    let page = request.query.page
    let nextPageURL = "http://localhost:3000/movies?"
    const sort = request.query.sort
    const order = request.query.order
    const perPage = parseInt(request.query.perPage as string)

    
    nextPageURL += `page=${parseInt(page as string) + 1}&perPage=${perPage}`

    nextPageURL += `&order=${order}`

    nextPageURL += `&sort=${sort}`
   

    return nextPageURL
}

const listMovies = async (request: Request, response: Response) : Promise<Response> => {
    const queryParams = request.query
    const limit = parseInt(queryParams.perPage as string)
    const offset = (parseInt(queryParams.page as string) - 1) * limit
    let sort = queryParams.sort as string
    let order = queryParams.order as string
    let page = queryParams.page

    let query: string = ""
    let values : Array<string | number> = []

    if(order) {
        order = order === "duration" ? "duration" : "price"

        if(sort !== "") {
            sort = sort === "ASC" ? "ASC" : "DESC" 
        } 

        query = `SELECT * FROM movies ORDER BY ${order} ${sort} LIMIT $1 OFFSET $2;`
        
        values = [ limit, offset ]
    } else {
        query = `
            SELECT * FROM movies LIMIT $1 OFFSET $2;
        `
        values = [ limit, offset ]
    }

    const queryConfig: QueryConfig = {
        text: query,
        values: values
    }
    
    const queryResult: MovieResult = await client.query(queryConfig)
    
    let previousPage: string | null = parseInt(page as string) > 1 ? getPreviousPageURL(request) : null
    let nextPage: string = getNextPageURL(request)

    return response.status(200).json({
        previousPage,
        nextPage,
        count: queryResult.rowCount,
        data: queryResult.rows
    })
}

const deleteMovie = async (request: Request, response: Response) : Promise<Response> => {
    const movieId = request.params.id
    const query: string = `
        DELETE FROM 
            movies
        WHERE
            id = $1;
    `
    const queryConfig: QueryConfig = {
        text: query,
        values: [movieId]
    }
    const queryResult : MovieResult = await client.query(queryConfig)

    if(queryResult.rowCount === 0) {
        return response.status(404).json({
            message: "Movie not found!"
        })
    }

    return response.status(204).send()
}

export { createMovie, listMovies, deleteMovie }