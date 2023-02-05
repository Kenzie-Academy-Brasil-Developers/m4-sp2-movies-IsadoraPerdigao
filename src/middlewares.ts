import { Request, Response, NextFunction, request } from "express"
import { QueryConfig } from "pg"
import { client } from "./database"

const validateNewMovie = async (request: Request, response: Response, next: NextFunction) => {
    const movieName = request.body.name
    const query: string = `
        SELECT name FROM movies WHERE name = $1;
    ` 
    const queryConfig : QueryConfig= {
        text: query,
        values: [movieName]
    }
    const queryResult = await client.query(queryConfig)
    const movieOnDB = queryResult.rows

    if(movieOnDB.length > 0) {
        return response.status(409).json({
            message: "Movie already exists."
        })
    }

    return next()
}

const parsePageParam = (request: Request, response: Response, next: NextFunction) => {
    const urlQuery = request.query
    let page = "1"

    if(urlQuery.page && parseInt(urlQuery.page as string) && parseInt(urlQuery.page as string) > 0 ) {
        page = urlQuery.page as string
    }

    request.query.page = page

    return next()
}

const parsePerPageParam = (request: Request, response: Response, next: NextFunction) => {
    const urlQuery = request.query
    let perPage = "5"
    const requestedPerPage = parseInt(urlQuery.perPage as string)

    if(urlQuery.perPage && requestedPerPage && requestedPerPage > 0 && requestedPerPage < 5) {
        perPage = urlQuery.perPage as string
    }

    request.query.perPage = perPage

    return next()
}

const parseOrderParam = (request: Request, response: Response, next: NextFunction) => {
    const validQuerys: string[] = ["price", "duration"]
    const requestedOrder = request.query.order as string  
    let order = "" 
    
    if(validQuerys.includes(requestedOrder)) {
        order = requestedOrder
    }
    
    request.query.order = order

    return next()
}

const parseSortParam = (request: Request, response: Response, next: NextFunction) => {
    const validQuerys: string[] = ["ASC", "DESC"]
    let requestedSort = request.query.sort as string  
    let sort = "" 
    
    if(validQuerys.includes(requestedSort)) {
        sort = requestedSort
    }
    
    request.query.sort = sort

    return next()
}

export { validateNewMovie, parsePageParam, parsePerPageParam, parseOrderParam, parseSortParam }