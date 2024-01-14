import mongoose from "../models/index.js";
import Booking from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import userModel from "../models/users.js";

export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumbers, user } = req.body;

  let existingMovie;
  let existingUser;
  try {
    existingMovie = await Movie.findById(movie);
    existingUser = await userModel.findById(user);
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
    console.log("Creating new booking:", { movie, date, seatNumbers, user });
    booking = new Booking({
      movie,
      date: new Date(`${date}`),
      seatNumbers,
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



export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Booking.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unexpected Error" });
  }
  return res.status(200).json({ booking });
};

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  let booking;

  try {
    booking = await Booking.findByIdAndDelete(id).populate("user movie");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    if (booking.user) {
      await booking.user.bookings.pull(booking);
      await booking.user.save({ session });
    }

    if (booking.movie) {
      await booking.movie.bookings.pull(booking);
      await booking.movie.save({ session });
    }

    session.commitTransaction();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  return res.status(200).json({ message: "Successfully Deleted" });
};
