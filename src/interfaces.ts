import { QueryResult } from "pg";

interface iMovie {
    id: number
    name: string
    description: string
    duration: number
    price: number
}

type MovieCreate = Omit<iMovie, "id">
type MovieResult = QueryResult<iMovie>

export { iMovie, MovieResult, MovieCreate }