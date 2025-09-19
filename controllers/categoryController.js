const Category= require('../models/Category');
const User= require('../models/User');

//Create a new category

exports.createCategory= async(req,res)=>{
    try{
        const {name,description,}=req.body;

        if(!name){
            return res.status(400).json({
                success:false,
                message:"Category name is required",
            });
        }

        //Check if category already exists

        const existingCategory = await Category.findOne({name});

        if(existingCategory){
            return res.status(400).json({
                success:false,
                message:"Category already exists",
            })
        }

        const category = await Category.create({
            name,
            description,
            isActive:true,
        })

        return res.status(200).json({
            success:true,
            message:"Category created successfully",
            category,
        })

    }
    catch(error){
        console.error("Error creating category", error);
    return res.status(500).json({
      success:false,
      message:"Internal server error",
    });
}
}

//Get all categories
exports.getAllCategories= async(req,res)=>{
    try{

        const categories = await Category.find({isActive:true});
        return res.status(200).json({
            success:true,
            categories,
        })

    }
    catch(error){
        console.error("Error fetching categories", error);
    return res.status(500).json({
      success:false,
      message:"Internal server error",
    });
    }
}

//Get category by ID
exports.getCategoryById= async(req,res)=>{
    try{
        const {categoryId}= req.params;

        if(!categoryId){
            return res.status(400).json({
                success:false,
                message:"Category ID is required",
            });
        }

        const category = await Category.findById(categoryId);
        if(!category){
            return res.status(404).json({
                success:false,
                message:"Category not found",
            });
        }
        return res.status(200).json({
            success:true,
            category,
        })
     }
    
    catch(error){
        console.error("Error fetching category", error);
    return res.status(500).json({
      success:false,
      message:"Internal server error",
    });
    }
}

//Update category
exports.updateCategory= async(req,res)=>{
    try{
        const {categoryId}= req.params;
        const {name,description,isActive}= req.body;
        if(!categoryId){
            return res.status(400).json({
                success:false,
                message:"Category ID is required",
            });
        }

        const updateData={};
        if(name) updateData.name=name;
        if(description) updateData.description=description;
        if(isActive!==undefined) updateData.isActive=isActive;

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            updateData,
            {new:true}
        );

        if(!updatedCategory){
            return res.status(404).json({
                success:false,
                message:"Category not found",
            });
        }

        return res.status(200).json({
            success:true,
            message:"Category updated successfully",
            category:updatedCategory,
        })

    }
    catch(error){
        console.error("Error updating category", error);
    return res.status(500).json({
      success:false,
      message:"Internal server error",
    });
    }
}

// Delete category
exports.deleteCategory= async(req,res)=>{
    try{
        const {categoryId}=req.params;

        if(!categoryId){
            return res.status(400).json({
                success:false,
                message:"Category ID is required",
            })
    }

    const category =await Category.findByIdAndDelete(categoryId);
    if(!category){
        return res.status(404).json({
            success:false,
            message:"Category not found",
        })
    }
    return res.status(200).json({
        success:true,
        message:"Category deleted successfully",
    })

   }
    catch(error){
        console.error("Error deleting category", error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        })
    }
}