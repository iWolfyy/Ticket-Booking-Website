const User = require('../models/User');

// Get all Users
// GET /api/users
exports.getAllUsers = async (req, res) => {
    try {
        const Users = await User.find().select('-password');
        res.status(200).json(Users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
        
    }
};


// Get user profile
// GET /api/users/profile
exports.getUser = async (req, res) => {
    try {
        // Use req.user.id (populated by your protect/auth middleware)
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update user profile
// PUT /api/users/profile
exports.updateUser = async (req,res) => {
    try {
        //Prevent from updating someone else profile
        //Unless they are admin
        if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};
