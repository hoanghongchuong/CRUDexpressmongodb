var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = require('../models/UsersModel');
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource', {title: 'Users'});
// });

router.get('/', (req, res, next) => {
	res.render('users', {title: 'Users'});
});

// get all users
router.get('/getallusers', (req, res, next) => {
	// Users.find({}, (err, user) => {
	// 	if(err){
	// 		res.json({
	// 			result: "faild",
	// 			data: {},
	// 			message: "Error {$err}"
	// 		});
	// 	}else{
	// 		res.json({
	// 			result: "ok",
	// 			data: user,
	// 			message: "Get all users successfully"
	// 		});
	// 	}
	// });
	Users.find({}).sort({name: 1}).exec((err, user) => {
		if(err){
			res.json({
				result: "faild",
				data: {},
				message: "Error"
			});
		}else{
			res.json({
				result: "ok",
				data: user,
				message: "Get all user successfully"
			});
		}
	});

});
// insert new user
router.post('/insertuser', (req, res, next) => {
	const criteria = {
		name: new RegExp('^' + req.body.name.trim() + '$', 'i')
	};
	Users.find(criteria).limit(1).exec((err, user) => {
		if(err){
			res.json({
				result: "faild",
				data: {},
				message: "Error is {$err}"
			});
		}else{
			if(user.length > 0){
				res.json({
					result: "faild",
					data: {},
					message: "cannot insert user because the name exits"
				});
			}else{
				const newUser = new Users({
					name: req.body.name,
					phone: req.body.phone,
					email: req.body.email,
					image: req.body.image,
					role : req.body.role
				});
				newUser.save((err, addedUsers) => {
					if(err){
						res.json({
							result: "faild",
							data: {},
							message: "Error is {$err}"
						});
					}else{
						res.json({
							result: "ok",
							data: addedUsers,
							message: "Insert new user successfully"
						});
					}
				});
			}
		}
	});
});
// update a user
router.put('/updateuser', (req, res, next) => {
	let conditions = {};
	if(mongoose.Types.ObjectId.isValid(req.body.user_id) == true){
		conditions._id = mongoose.Types.ObjectId(req.body.user_id);
	}else{
		res.json({
			result: "faild",
			data: {},
			message: "you must enter your user_id"
		});
	}
	let newValues = {};
	if(req.body.name && req.body.name.length > 1){
		newValues.name = req.body.name;
	}
	newValues.phone = req.body.phone;
	newValues.email = req.body.email;
	newValues.image = req.body.image;
	newValues.birthday = req.body.birthday;
	const options = {
		new: true,
		multi: true
	}
	Users.findOneAndUpdate(conditions, {$set: newValues}, options, (err, users) => {
		if(err){
			res.json({
				result: "faild",
				data: {},
				message: "Error"
			});
		}else{
			res.json({
				result: "ok",
				data: {},
				message: "update user successfully"
			});
		}
	});
});

// delete a user
router.delete('/delete', (req, res, next) => {
	res.end('Method delete user')
});

module.exports = router;
