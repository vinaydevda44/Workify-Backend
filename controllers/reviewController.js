const Review =require('../models/Review');
const User= require('../models/User');

// Add a review for a provider

exports.createReview = async (req, res) => {
  try {
    const { providerId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!providerId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Provider and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check provider exists
    const provider = await User.findById(providerId);
    if (!provider || provider.role !== "provider") {
      return res.status(404).json({
        success: false,
        message: "Provider not found or invalid",
      });
    }

    // Prevent duplicate review by same user
    const existingReview = await Review.findOne({ userId, providerId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this provider",
      });
    }

    const newReview = await Review.create({
      userId,
      providerId,
      rating,
      comment
    });

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview
    });

  } catch (error) {
    console.error("Error adding review", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get reviews for a provider
exports.getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;
    if (!providerId) {
      return res.status(400).json({
        success: false,
        message: "Provider ID is required",
      });
    }
    const reviews = await Review.find({ providerId }).populate("userId", "name email");
    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews", error);
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        });
    }
};

// Get reviews by a user
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviews = await Review.find({ userId }).populate("providerId", "name email");
    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching user reviews", error);
    return res.status(500).json({   
        success: false,
        message: "Internal server error",
        });
    }
};

// update a review
exports.updateReview = async(req,res)=>{
    try{
        const {reviewId}= req.params;
        const {rating,comment}= req.body;
        const userId= req.user.id;
        if(!reviewId){
            return res.status(400).json({
                success:false,
                message:"Review ID is required",
            })
        }
        const review = await Review.findById(reviewId);
        if(!review){
            return res.status(404).json({
                success:false,
                message:"Review not found",
            })
        }
        if(review.userId.toString() !== userId){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to update this review",
            })
        }
        if(rating){
            if(rating<1 || rating>5){
                return res.status(400).json({
                    success:false,
                    message:"Rating must be between 1 and 5",
                })
            }
            review.rating= rating;
        }
        if(comment) review.comment= comment;
        await review.save();
        return res.status(200).json({
            success:true,
            message:"Review updated successfully",
            review,
        })

    }
    catch(error){
        console.error("Error updating review", error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}

//Delete a review
exports.deleteReview = async(req,res)=>{
    try{
        const {reviewId}= req.params;
        const userId= req.user.id;
        if(!reviewId){
            return res.status(400).json({
                success:false,
                message:"Review ID is required",
            });
        }
        const review = await Review.findById(reviewId);
        if(!review){
            return res.status(400).json({
                success:false,
                message:"Review not found",
            })
        }
        if(review.userId.toString() !== userId){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to delete this review",
            });
        }
        await Review.findByIdAndDelete(reviewId);
        return res.status(200).json({
            success:true,
            message:"Review deleted successfully",
        });

    }
    catch(error){
        console.error("Error deleting review",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
}