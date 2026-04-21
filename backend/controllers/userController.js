const User = require("../models/User");
const paginate = require("../utils/pagination");
const generateToken = require("../utils/generateToken");

module.exports = {
  // @desc    Get all users
  // @route   GET /api/users
  getUsers: async (req, res) => {
    try {
      const { searchKey, role, status } = req.query;
      let filter = {};

      if (role) filter.role = role;
      if (status) filter.status = status;
      if (searchKey) {
        filter.$or = [
          { name: { $regex: searchKey, $options: "i" } },
          { email: { $regex: searchKey, $options: "i" } },
        ];
      }

      const result = await paginate(User, filter, req.query);
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

  // @desc    Get current user profile
  // @route   GET /api/users/me
  // @access  Private
  getMe: async (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // @desc    Register new user
  // @route   POST /api/users
  createUser: async (req, res) => {
    try {
      if (Array.isArray(req.body)) {
        // Bulk create (Tokens not usually returned for bulk)
        const usersToCreate = req.body.map((user) => ({
          name: user.name,
          email: user.email,
          password: user.password,
          status: user.status,
          role: user.role,
        }));

        if (
          usersToCreate.some(
            (user) => !user.name || !user.email || !user.password,
          )
        ) {
          return res.status(400).json({
            message: "Name, email, and password are required for all users",
          });
        }

        const users = await User.create(usersToCreate);

        // Remove passwords from response
        const usersResponse = users.map((user) => {
          const userObj = user.toObject();
          delete userObj.password;
          return userObj;
        });

        return res.status(201).json(usersResponse);
      }

      // Single create
      const { name, email, password, status, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Name, email, and password are required",
        });
      }

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await User.create({ name, email, password, status, role });

      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        token: generateToken(user._id, user.role),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // @desc    Authenticate user & get token
  // @route   POST /api/users/login
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email (include password for comparison)
      const user = await User.findOne({ email }).select("+password");

      if (user && (await user.matchPassword(password))) {
        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
          },
          token: generateToken(user._id, user.role),
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // @desc    Update user
  // @route   PUT /api/users/:id
  updateUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update fields
      Object.keys(req.body).forEach((key) => {
        user[key] = req.body[key];
      });

      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // @desc    Delete user (permanent)
  // @route   DELETE /api/users/:id
  deleteUser: async (req, res) => {
    try {
      if (req.user.id === req.params.id) {
        return res.status(400).json({ message: "You cannot delete yourself" });
      }
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
