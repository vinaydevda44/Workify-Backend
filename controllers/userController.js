const User = require("../models/User");
const Profile = require("../models/Profile");
const { uploadImageToCloudinary } = require("../utils/uplaodToCloudinary");

// Get user details
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const profile = await Profile.findOne({ user: userId });
    return res.status(200).json({
      success: true,
      user,
      profile,
    });
  } catch (error) {
    console.error("Error fetching user details", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update  user details
exports.updateUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { location, gender, dateOfBirth } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const updateData = {};
    if (location) updateData.location = location;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;

    const updatedProfileData = await Profile.findOneAndUpdate(
      { user: userId },    
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
      profile: updatedProfileData,
    });
  } catch (error) {
    console.log("Error updating user details", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete user

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required",
      });
    }

    await User.findByIdAndDelete(userId);
    await Profile.findOneAndDelete({ user: userId });
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("error deleting user", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const userId = req.user.id || req.body.userId || req.params.id;
    const displayPicture = req.files.displayPicture;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Id is required",
      });
    }
    if (!displayPicture) {
      return res.status(400).json({
        success: false,
        message: "Display picture is required",
      });
    }

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Display picture updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("error updating display picture", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
