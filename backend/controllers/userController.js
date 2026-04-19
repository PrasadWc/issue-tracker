const User = require("../models/User");
const paginate = require("../utils/pagination");

module.exports = {
  // @desc    Get all users
  // @route   GET /api/users
  getUsers: async (req, res) => {
    try {
      const result = await paginate(User, {}, req.query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // @desc    Get user by ID
  // @route   GET /api/users/:id
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // @desc    Create user
  // @route   POST /api/users
  createUser: async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // @desc    Update user
  // @route   PUT /api/users/:id
  updateUser: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // @desc    Soft delete user (set status to inactive)
  // @route   PUT /api/users/:id/soft
  softDeleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { status: 2 },
        { new: true },
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // @desc    Hard delete user (permanent)
  // @route   DELETE /api/users/:id/hard
  hardDeleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted permanently" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
