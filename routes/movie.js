import express from "express";
import { getAllMovies, getMovieById,addMovie, deleteMovieById,addMultipleMovies } from "../controllers/movie.js";

const movieRouter = express.Router();

// GET all movies
movieRouter.get("/", getAllMovies);

// GET movie by ID
movieRouter.get("/:id", getMovieById);

movieRouter.delete('/:id',deleteMovieById)
movieRouter.post('/addmovie', addMovie);

movieRouter.post('/multiplemovies', addMultipleMovies);
export default movieRouter;
