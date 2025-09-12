"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const registerUser = async (req, res) => {
    try {
        const { name, email, password, avatarUrl } = req.body;
        // Check if user already exists
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const cartoonAvatars = [
            "https://api.dicebear.com/7.x/bottts/svg?seed=robot1",
            "https://api.dicebear.com/7.x/bottts/svg?seed=robot2",
            "https://api.dicebear.com/7.x/bottts/svg?seed=robot3",
        ];
        const randomAvatar = cartoonAvatars[Math.floor(Math.random() * cartoonAvatars.length)];
        // Create new user
        const user = await User_1.default.create({
            name,
            email,
            password,
            avatarUrl: avatarUrl || randomAvatar,
            provider: "local",
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                provider: user.provider,
                avatarUrl: user.avatarUrl,
                token: (0, generateToken_1.default)(user._id.toString()),
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.registerUser = registerUser;
// @desc    Login user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user and select password
        const user = await User_1.default.findOne({ email }).select("+password");
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
            token: (0, generateToken_1.default)(user._id.toString()),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.loginUser = loginUser;
const getProfile = async (req, res) => {
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
exports.getProfile = getProfile;
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }
        // Find the user
        const user = await User_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Update fields (fallback to existing values if not provided)
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.avatarUrl = req.body.avatarUrl || user.avatarUrl;
        if (req.body.password) {
            user.password = req.body.password; // will be hashed in User model
        }
        if (req.body.bio) {
            user.bio = req.body.bio;
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            provider: updatedUser.provider,
            avatarUrl: updatedUser.avatarUrl,
            bio: updatedUser.bio,
            token: (0, generateToken_1.default)(updatedUser._id.toString()), // issue new token if email/password changed
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateProfile = updateProfile;
