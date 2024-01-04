import mongoose from "./index.js";

const bookingSchema = new mongoose.Schema({
    movie: {
      type: mongoose.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    seatNumbers: [{
      type: Number,
      required: true,
    }],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    }
    },{
        collection:'bookings',
        versionKey:false
    });
  
  export default  mongoose.model("Booking", bookingSchema);