import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { config } from '../configs/config';

dotenv.config();

const JWT_SECRET = process.env.SECRET_KEY as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

// Interface pour le Token JWT
interface JwtPayload {
  id: string;
  role: string;
}



// Register a new user
export const register = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { firstName, lastName, email, password, phoneNumber, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
       res.status(400).json({ message: 'User already exists' });
       return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      role: role || 'member', // Default role is 'member'
    });

    await user.save();

    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: "7d" });

    // Save refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    // Send response
    res.status(201).json({ user });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Login user
export const login = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
       res.status(400).json({ message: 'Invalid credentials' });
       return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
       res.status(400).json({ message: 'Invalid credentials' });
       return;
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: "7d" });

    // Save refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    // Send response
    res.status(200).json({ accessToken, refreshToken, user });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Logout user
export const logout = async (req: Request, res: Response) : Promise<void> => {
  try {
    const userId = req.user?.id; // Assuming you have middleware to extract userId from the token

    // Find user and remove refresh token
    const user = await User.findById(userId);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error });
  }
};

// Refresh token
export const refreshToken = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.secret) as { userId: string; role: string };

    // Find user by ID
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
       res.status(401).json({ message: 'Invalid refresh token' });
       return;
    }

    // Generate new access token
    const accessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "15m" });

    // Send response
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: 'Error refreshing token', error });
  }
};
