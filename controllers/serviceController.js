const Service= require('../models/Service');

// Create a new service
exports.createService= async(req,res)=>{
    try{
        const {name,description,price,}=req.body;

       

    if(!name || !description || !price){
        return res.status(400).json({
            success:false,
            message:"Please Provide all the details",
        })
    }
    const service = await Service.create({
        name,
        description,
        price,
        provider:req.user.id,
    });
    return res.status(200).json({
        success:true,
        message:"Service created Successfully",
        service,
    })
    }
    catch(error){
        console.log('Error creating service',error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
        })
    }
}

// Get all services
exports.getAllServices = async(req,res)=>{
    try{

        const services = await Service.find({isActive:true}).populate('provider','name email phone');
        if(!services){
            return res.status(404).json({
                success:false,
                message:"No services found",
            })
        }
        return res.status(200).json({
            success:true,
            services,
        })
    }
    catch(error){
        console.error('error fetching services',error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
        })
    }
}

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

