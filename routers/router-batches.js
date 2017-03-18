const _ = require('underscore');
const express = require('express');
const Router = new express.Router;

const {Batch} = require('../models.js');

/* create batch */
Router.post('/batches', function(req, res, next){
	const batch = new Batch({
		combination: req.body.combination,
		year: req.body.year,
		gradLevel: req.body.gradLevel
	});

	batch.save( function(err){
		if(err) return next(err);
		res.status(200);
		res.json(batch);
	});
});

/* read batches */
Router.get('/batches', function(req, res, next){
	Batch.find({}).exec( function(err, batches){
		if(err) return next(err);
		res.status(200);
		res.json(batches);
	});
});

Router.param('batchID', function(req, res, next, batchID){
	Batch.findById(batchID, function(err, batch){
		if(err) return next(err);
		req.batch = batch;
		next();
	});
});

/* get a batch */
Router.get('/batches/:batchID', function(req, res, next){
	res.json(req.batch);
});

/* update a batch */
Router.put('/batches/:batchID', function(req, res, next){
	/* for every property in body */
	for(let key in req.body){
		req.batch[key] = req.body[key];
	}

	req.batch.save(function(err){
		if(err) return next(err);
		res.status(200);
		res.json(req.batch);
	});
});

/* delete a batch */
Router.delete('/batches/:batchID', function(req, res, next){
	Batch.findByIdAndRemove(req.params.batchID, function(err){
		if(err) return next(err);
		res.status(200);
		res.send("deleted");
	});
});

module.exports = Router;