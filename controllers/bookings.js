import mongoose from "../models/index.js";
import Booking from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/users.js";

export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user } = req.body;

  let existingMovie;
  let existingUser;
  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!existingMovie) {
    return res.status(404).json({ message: "Movie Not Found With Given ID" });
  }
  if (!user) {
    return res.status(404).json({ message: "User not found with given ID " });
  }
  let booking;

  try {
    booking = new Booking({
      movie,
      date: new Date(`${date}`),
      seatNumber,
      user,
    });
    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.bookings.push(booking);
    existingMovie.bookings.push(booking);
    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });
    session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }

  if (!booking) {
    return res.status(500).json({ message: "Unable to create a booking" });
  }

  return res.status(201).json({ booking });
};


export const getBookingById = async (req, res) => {
  const id = req.params.id;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking Not Found" });
    }
    return res.status(200).json({ booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unexpected Error" });
  }
};

export const deleteBooking = async (req, res) => {
  const id = req.params.id;
  
  let session; // Define session variable outside the try block
  
  try {
    const booking = await Booking.findOneAndDelete({ _id: id }).populate("user movie");
    if (!booking) {
      return res.status(404).json({ message: "Booking Not Found" });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    await booking.user.bookings.pull(booking);
    await booking.movie.bookings.pull(booking);

    await booking.movie.save({ session });
    await booking.user.save({ session });

    await session.commitTransaction();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to Delete" });
  } finally {
    if (session) { // Check if session is defined before ending it
      session.endSession();
    }
  }

  return res.status(200).json({ message: "Successfully Deleted" });
};
