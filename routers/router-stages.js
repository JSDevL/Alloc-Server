const _ = require('underscore');
const express = require('express');
const Router = new express.Router;

const {User} = require('../models.js');

/* requesting stages state for user */
Router.get('/stages/:userName', function(req, res, next){
	User.findOne({userName: req.params.userName}, {stages: true}, function(err, user){
		res.status(200);
		res.json(user.stages);
	});
});

module.exports = Router;