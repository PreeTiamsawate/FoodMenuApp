const express = require('express');

const foodRoute = express.Router();
const multer = require('multer');
const app = express();



//Calling Schema
const FoodModel = require('../../models/FoodMenu.js');

//Getting all foods
foodRoute.route('/').get((req,res,next)=>{
    FoodModel.find((error,data)=>{
        if(error){
            return next(error);
        }else {
            res.json(data);
        }
    })
})

// Config multer to upload images----------------------------------------------------
const storage = multer.diskStorage({ 
    destination: function(req,file,cb){  //set Destination
        cb(null, './static/FoodImage');
    },
    filename: function(req,file,cb){     // set filename
        cb(null, file.originalname);
    }
});

//Prepare a function for img file upload 
const fileFilter = function(req, file, cb){
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    if(!allowedTypes.includes(file.mimetype)){
        const error = new Error("Wrong file type");
        error.code = "LIMIT_FILE_TYPES";
        return cb(error, false);
    };

    cb(null, true);
};
const MAX_SIZE = 200000;
const upload = multer({
    storage: storage,
   
    fileFilter: fileFilter
});

//-------------------------------------------------------------------------------

//Create Food data
foodRoute.route('/create-food').post((req,res,next)=>{

    FoodModel.create(req.body, (error,data)=>{
        if(error){
            return next(error);
        }else{
            res.json(data)
        }
    })
})
//Upload single Img file
foodRoute.route('/upload').post(upload.single('file'),(req,res) => {
    res.json({file: req.file});
});

//Prepare the function to delete img file
const fs = require('fs').promises;
async function deleteFile(filePath) {
    await fs.unlink(filePath)
    .then(console.log(`Deleted ${filePath}`))
    .catch((error)=>{console.error(`Got an error trying to delete the file: ${error.message}`);});
}

//Delete a food data
foodRoute.route('/delete-food/:id').delete((req,res,next)=>{
    FoodModel.findByIdAndDelete(req.params.id, (error,data)=>{
        if(error){
            return next(error);
        }else{
            
            if(data.imgName){
                console.log(data.imgName);
                deleteFile(`./static/FoodImage/${data.imgName}`);
            };
            res.status(200).json({
                msg:data
            });
        }
    })
})

//Get a food data to show and update that data
foodRoute.route('/getAfood/:id').get((req,res,next)=>{
    FoodModel.findById(req.params.id, (error, data)=>{
        if(error){
            return next(error);
        }else{
            res.json(data);
        }
    })
})
foodRoute.route('/update-food/:id').put((req,res,next)=>{
    FoodModel.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data)=>{
        if(error){
            return next(error);
        }else{
            
            if(data.imgName){
                console.log(data.imgName);
                deleteFile(`./static/FoodImage/${data.imgName}`);
            }
            res.json(data);
            console.log('Food successfully updated');
        }
    })
})



module.exports =foodRoute