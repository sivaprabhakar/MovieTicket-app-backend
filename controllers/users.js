import userModel from '../models/users.js'
import bcrypt from 'bcrypt';
import Booking from '../models/Bookings.js';
import jwt from 'jsonwebtoken';


export const getAllUsers = async (req,res)=>{
    try {
        let users;
        users = await userModel.find()
        if(!users){
            res.status(500).send({  message:"Internal Server Error now",
            error:error.message})
        }
        else{
            res.status(200).send({users})
        }
    } catch (error) {
        console.log(error)
    }
}
const saltRounds=10;
export const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ message: "Invalid data" });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const user = await userModel.create({ name, email, password: hashedPassword });

    if (!user) {
      return res.status(500).json({ message: "Unexpected Error Occurred" });
    }

    return res.status(201).json({
      id: user._id,
      email: user.email,
      // Add other user details you want to send to the frontend
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
  
    // Generate a JWT token
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
  
    // Send the token as part of the response
    return res.status(200).json({
      token,
      id: existingUser._id,
      email: existingUser.email,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(422).send({ message: "Invalid data" });
    } else {
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Find the user by ID and update the details
            const user = await userModel.findByIdAndUpdate(id, { name, email, password: hashedPassword }, { new: true });

            if (!user) {
                res.status(404).json({ message: "User not found" });
            } else {
                res.status(200).json({message: "updated sucessfully"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};
export const deleteUserById = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.status(200).json({ message: "User deleted successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getBookingsOfUser = async (req, res, next) => {
  const id = req.params.id;
  let bookings;
  try {
    bookings = await Booking.find({ user: id })
      .populate("movie")
      .populate("user");
  } catch (err) {
    return console.log(err);
  }
  if (!bookings) {
    return res.status(500).json({ message: "Unable to get Bookings" });
  }
  return res.status(200).json({ bookings });
};


export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user details to the request object
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookings = await Booking.find({ user: userId }).populate("movie");

    return res.status(200).json({ user, bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch user profile" });
  }
};
