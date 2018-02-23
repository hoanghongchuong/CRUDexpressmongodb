var router = global.router;
let Food = require('../models/FoodModel');
var mongoose = require('mongoose');
let fs = require('fs');
router.get('/list-all-foods', (req, res,next) => {
	Food.find({}).limit(10).sort({name:1}).select({
        name: 1,
        foodDescription: 1,
        created_dat: 1,
        status: 1,
        categoryId: 1,
        _id: 1
    }).exec((err, foods) => {
        if(err){
            res.json({
                result: "failed",
                data: [],
                messege: "Error: {$err}"
            })
        }else{
            res.json({
                result: "ok",
                data: foods,
                count: foods.length,
                messege: "list foods successfully"
            })
        }
    });
});

router.get('/get_food_with_id', (req, res, next) => {
    Food.findById(require('mongoose').Types.ObjectId(req.query.food_id),
    (err, food) => {    
        if(err){
            res.json({
                result: "failed",
                data: [],
                messege: "Error"
            });
        }else{
            res.json({
                result: "ok",
                data: food,
                messege: "Query food by Id successfully"
            });
        }
    });
});

router.post('/insert', (req, res, next) => {
	
	const newFood = new Food({
		name: req.body.name,
        foodDescription: req.body.foodDescription,
        categoryId: req.body.category_id
	});
	newFood.save((err) => {
		if(err){
			res.json({
				result: "failed",
				data: {},
				messege: "Error is:" + err
			});
		}else{
			res.json({
				result: "ok",
				data: {
					name: req.body.name,
					foodDescription: req.body.foodDescription,
					messege: "Insert new food successfully"
				},
			});
		}
	});

});
router.put('/update', (req, res, next) => {
    let  conditions = {};
    if(mongoose.Types.ObjectId.isValid(req.body.food_id) == true){
        conditions._id = mongoose.Types.ObjectId(req.body.food_id);
    }else{
        res.json({
            result: "faild",
            data: {},
            messege: "you must endter food_id to update"
        });
    }

    let newValues = {};
    if(req.body.name && req.body.name.length > 2){
        newValues.name = req.body.name;
    }
    newValues.foodDescription = req.body.foodDescription;
    //update image
    if(req.body.image_name && req.body.image_name.length > 0){
        const serverName = require("os").hostname();
        const serverPort = 4000;
        newValues.imgUrl = `${serverName}:${serverPort}/open_image?image_name=${req.body.image_name}`;
    }
    const options = {
        new: true, //return the modified document rather than the original
        multi: true
    }
    if(mongoose.Types.ObjectId.isValid(req.body.category_id) == true){
        newValues.categoryId = mongoose.Types.ObjectId(req.body.category_id);
    }
    Food.findOneAndUpdate(conditions, {$set: newValues}, options, (err, updateFood) => {
        if(err){
            res.json({
                result: "faild",
                data: {},
                messege: "update faild"
            });
        }else{
            res.json({
                result: "ok",
                data: updateFood,
                messege: "update food successfully"
            });
        }
    });
    
});
// upload image
router.post('/upload_images', (req, res, next) => {
    let formidable = require('formidable'); // thu vien quan ly upload 1 hoac nhieu anh
    // parse a file upload
    var form = new formidable.IncomingForm();
    form.uploadDir = "./uploads";
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024; //10MB
    form.multiples = true;
    form.parse(req, (err, fields, files)=> {
        if(err){
            res.json({
                result: "faild",
                data: {},
                message: "Cannot upload images. Error is: ${err}"
            });
        }

        var arrayOfFiles = [];
        if(files[""] instanceof Array) {
            arrayOfFiles = files[""];
        } else {
            arrayOfFiles.push(files[""]);
        }

        // var arrayOfFiles = files[''];
        if(arrayOfFiles.length > 0){
            var fileNames = [];
            arrayOfFiles.forEach((eachFile) => {
                fileNames.push(eachFile.path)
                // fileNames.push(eachFile.path.split('/')[1]);
            });
            res.json({
                result: "ok",
                data: fileNames,
                numberOfImages: fileNames.length,
                message: "upload images successfully"
            });
        }else{
            res.json({
                result: "failed",
                data: {},
                numberOfImages: 0,
                message: "No images to upload"
            });
        }
    });
});

router.get('/open_image', (req, res,next) => {
    let imageName = "uploads/" + req.query.image_name;
    fs.readFile(imageName, (err, imageData) => {
        if(err){
            res.json({
                result: "failed",
                message: "Cannot read file"
            });
            return;
        }
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.end(imageData); //send the file data to the browser.
    });
});

router.delete('/delete', (req, res, next) => {
	res.end('method delete');
});

module.exports = router;