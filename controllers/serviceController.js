const Service= require('../models/Service');
const User= require('../models/User');
const Category= require('../models/Category');



// Create a new service
exports.createService = async (req, res) => {
  try {
    const { name, description, price,categoryId } = req.body;
    const userId = req.user.id;

    // Fetch user to check role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "Provider") {
      return res.status(403).json({
        success: false,
        message: "Only providers can create services",
      });
    }

    // Validate input
    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the details",
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    
    
    // Create service
    const service = await Service.create({
      name,
      description,
      price,
      provider: userId,
      category: categoryId,
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate("provider", "name email phone")
      .populate("category", "name description");;

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active services found",
        services: [],
      });
    }

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


// Get service by ID
exports.getServiceById= async(req,res)=>{
    try{
        const {id}=req.params;
        const service = await Service.findById(id).populate('provider','name email phone');
        if(!service){
            return res.status(404).json({
                success:false,
                message:"Service not found",
            })
        }
        return res.status(200).json({
            success:true,
            service,
        })
    }
    catch(error){
        console.error('error fetching service by id',error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
        })
    }
}

// Update service by ID
exports.updateServiceById= async(req,res)=>{
    try{
        const {id}=req.params;
        const {name,description,price,isActive}=req.body;
        const service = await Service.findById(id);

        if(!service){
            return res.status(404).json({
                success:false,
                message:"Service not found",
            })
        }

        if(service.provider.toString() !== req.user.id){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to update this service",
            })
        }
        if(name) service.name=name;
        if(description) service.description=description;
        if(price) service.price=price;
        if(isActive!==undefined) service.isActive=isActive;
        await service.save();
        return res.status(200).json({
            success:true,
            message:"Service updated successfully",
            service,
        })
    }
    catch(error){
        console.error('error updating service by id',error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
        })
    }
}

// Delete service by ID

exports.deleteServiceById= async(req,res)=>{
    try{
        const{id}=req.params;

        const service =await Service.findById(id);

        if(!service){
            return res.status(404).json({
                success:false,
                message:"Service not found",
            })
        }
        if(service.provider.toString() !== req.user.id){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to delete this service",
            })
        }
        await service.remove();
        return res.status(200).json({
            success:true,
            message:"Service deleted successfully",
        })
    }
    catch(error){
        console.error('error deleting service by id',error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
        })
    }
}