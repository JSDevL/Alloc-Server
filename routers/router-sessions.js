const _ = require('underscore');
const express = require('express');
const Router = new express.Router(); 

const {Session} = require('../models.js');

Router.param("sessionID", function(req, res, next, sessionID){
	Session.findById(sessionID).exec(function(err, session){
		if(err) return next(err);
		req.session = session;
		next();
	});
});

/* get all sessions */
Router.get('/sessions', function(req, res, next){
	Session.find({}, function(err, sessions){
		if(err) return next(err);
		res.status(200);
		res.json(sessions);
	});
});

/* get all sessions populated with batches */
Router.get('/sessions/populated', function(req, res, next){
	Session.find({}).populate('batches').exec( function(err, sessions){
		if(err) return next(err);
		res.status(200);
		res.json(sessions);
	});
});

/* create a session */
Router.post('/sessions', function(req, res, next){
	const session = new Session({
		name: req.body.name,
		start: req.body.start,
		end: req.body.end,
		batches: []
	});

	session.save(function(err, session){
		if(err) return next(err);
		res.status(200);
		res.json(session);
	});
});

/* delete a session */
Router.delete('/sessions/:sessionID', function(req, res, next){
	Session.findByIdAndRemove(req.session, function(err, session){
		if(err) return next(err);
		res.json(session);
	});
});

/* post a batch to a session */
Router.post('/sessions/:sessionID/batches', function(req, res, next){
	req.session.batches.push(req.body.batch);
	req.session.save(function(err){
		if(err) return next(err);
		Session.find({}, function(err, sessions){
			res.status(200);
			res.json(sessions);
		});
	});
});

/* delete a batch from a session */
Router.delete('/sessions/:sessionID/batches/:batchID', function(req, res, next){
	req.session.batches = _.reject(req.session.batches, function(batch){ return batch.toString() === req.params.batchID.toString(); } );
	req.session.save(function(err){
		if(err) return next(err);
		Session.find({}, function(err, sessions){
			res.status(200);
			res.json(sessions);
		});
	});
});

module.exports = Router;