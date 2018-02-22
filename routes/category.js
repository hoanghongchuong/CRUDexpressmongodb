var router = global.router;
var mongoose = require('mongoose');
let Category = require('../models/CategoryModel');


// router.get('/list_all_category', (req, res, next) => {
//     Category.find().sort({name: 1}).exec((err, category) => {
//         if(err){
//             res.json({
//                 result: "faild",
//                 data: {},
//                 message: "Error {$err}"
//             });
//         }else{
//             res.json({
//                 result: "ok",
//                 data: category,
//                 message: "Get list category successfully"
//             });
//         }
//     });
// });
router.get('/getcategory', (req, res, next) => {
    Category.find({}, (err, category) => {
        if(err){
            res.json({
                result: "faild",
                data: {},
                message: "Error {$err}"
            });
        }else{
            res.json({
                result: "ok",
                data: category,
                message: "Get list category successfully"
            });
        }
    });
});
//insert new category
router.post('/insert_new_category', (req, res, next) => {
    const criteria = {
        name: new RegExp('^' + req.body.name.trim() + '$', 'i')
    };
    Category.find(criteria).limit(1).exec((err, categories) => {
        if(err){
            res.json({
                    result: "faild",
                    data: {},
                    message: "Error is {$error}"
                });
        }else{
            // if it exist, don't allow to insert
            if(categories.length > 0){
                res.json({
                    result: "faild",
                    data: {},
                    message: "Can not insert because the name exits"
                });
            }else{
                // can insert
                const newCategory = new Category({
                    name: req.body.name,
                    description: req.body.description
                });
                newCategory.save((err, addedCategory) => {
                    if(err){
                        res.json({
                            result: "failed",
                            data: {},
                            message: 'Error is : {$err}'
                        });
                    }else{
                        res.json({
                            result: "ok",
                            data: addedCategory,
                            message: "Insert new category successfully"
                        });
                    }
                });
            }
        }
    }); 
});

//update a category
router.put('/update_a_category', (req, res, next) => {
    let conditions = {}; //search recored with "conditions" to update
    if(mongoose.Types.ObjectId.isValid(req.body.cate_id) == true){
        conditions._id = mongoose.Types.ObjectId(req.body.cate_id);
    }else{
        res.json({
            result: "faild",
            data: {},
            message: "you must enter your cate_id to update"
        });
    }
    let newValues = {};
    if(req.body.name && req.body.name.length > 1){
        newValues.name = req.body.name;
    }
    newValues.description = req.body.description;
    const options = {
        new: true,
        multi: true
    }
    Category.findOneAndUpdate(conditions, {$set: newValues}, options, (err, category) => {
        if(err){
            res.json({
                result: "fail",
                data: {},
                message: "update category faild"
            });
        }else{
            res.json({
                result: "ok",
                data: category,
                message: "update category successfully"
            });
        }
    });
});

module.exports = router;