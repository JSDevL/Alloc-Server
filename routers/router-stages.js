const express = require('express');
const router = express.Router();

const {User} = require("../models.js");

/* route to get existing users' stages states */
router.post('/stages', function(req, res, next){
	/* check if app user exists */
	User.findOne({userName: req.body.userName}, {stages: true},function(err, user){
		if(err) return next(err);
		res.status(200);
		res.json(user.stages);
	});
});

/* route to get existing users' stages states */
router.put('/stages', function(req, res, next){
	/* check if app user exists */
	User.findOne({userName: req.body.userName}, function(err, user){
		if(err) return next(err);
		user.stages = req.body.stages;
		user.save(function(err){
			if(err) return next(err);
			res.status(200);
			res.json(user.stages);
		});
	});
});

module.exports = router;
