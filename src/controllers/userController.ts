import { Request, Response } from "express";
import User from "../models/User";
import generateToken from "../utils/generateToken";
import { AuthRequest } from "../middleware/authMiddleware";
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, avatarUrl } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      avatarUrl,
      provider: "local",
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        avatarUrl: user.avatarUrl,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user and select password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      provider: user.provider,
      avatarUrl: user.avatarUrl,
      token: generateToken(user._id.toString()),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const getProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not found" });
  }

  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    provider: req.user.provider,
    avatarUrl: req.user.avatarUrl,
    createdAt: req.user.createdAt,
  });
};
