import Movie from '../models/Movie.js';

// Function to get all movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch movies' });
  }
};

// Function to get movie by ID
export const getMovieById = async (req, res) => {
 const { id } = req.params;
 console.log("Received movie ID:", id);
  try {
   
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    return res.status(200).json({ movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch the movie' });
  }
};


export const addMovie = async (req, res) => {
  const movieData = req.body;

  try {
    const existingMovie = await Movie.findOne({ title: movieData.title });

    if (existingMovie) {
      return res.status(400).json({ message: 'Movie already exists' });
    }

    const newMovie = new Movie(movieData);
    await newMovie.save();
    res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
  } catch (error) {
    console.error('Failed to add movie:', error);
    res.status(500).json({ message: 'Failed to add movie' });
  }
};

// Delete a movie by ID
export const deleteMovieById = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    await Movie.findByIdAndDelete(id);
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Failed to delete movie:', error);
    res.status(500).json({ message: 'Failed to delete movie' });
  }
}
export const addMultipleMovies = async (req, res) => {
  try {
    const moviesData = req.body?.movies || []; // Safely access req.body.movies or default to an empty array

    if (!Array.isArray(moviesData) || moviesData.length === 0) {
      return res.status(400).json({ message: 'No valid movies data provided' });
    }

    const existingTitles = (await Movie.find({ title: { $in: moviesData.map(movie => movie.title) } }))
      .map(movie => movie.title);

    const newMovies = moviesData.filter(movie => !existingTitles.includes(movie.title));

    if (newMovies.length === 0) {
      return res.status(400).json({ message: 'All movies already exist' });
    }

    await Movie.insertMany(newMovies);
    res.status(201).json({ message: 'Movies added successfully', movies: newMovies });
  } catch (error) {
    console.error('Failed to add movies:', error);
    res.status(500).json({ message: 'Failed to add movies' });
  }
};

