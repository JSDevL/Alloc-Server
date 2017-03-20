// const _ = require('underscore');
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

/* update batch, add conflict */
Router.put('/batches/:batchID/add-conflict', function(req, res, next){
	/* add conflict for every batch under same combination */
	Batch.update({combination: req.batch.combination}, { $addToSet: { conflicts: req.body.target } }, { multi: true }, function(err){
		if(err) return next(err);
		/* add conflict for every batch under target combination */
		Batch.update({combination: req.body.target}, { $addToSet: { conflicts: req.batch.combination } }, { multi: true }, function(err){
			if(err) return next(err);
			/* return all batches */
			Batch.find({}, function(err, batches){
				if(err) return next(err);
				res.status(200);
				res.json(batches);
			});
		});
	});
});

/* update batch, remove conflict */
Router.put('/batches/:batchID/remove-conflict', function(req, res, next){
	/* remove conflict for every batch under same combination */
	Batch.update({combination: req.batch.combination}, { $pull: { conflicts: req.body.target } }, { multi: true }, function(err){
		if(err) return next(err);
		/* remove conflict for every batch under target combination */
		Batch.update({combination: req.body.target}, { $pull: { conflicts: req.batch.combination } }, { multi: true }, function(err){
			if(err) return next(err);
			/* return all batches */
			Batch.find({}, function(err, batches){
				if(err) return next(err);
				res.status(200);
				res.json(batches);
			});
		});
	});
});

/* delete a batch */
Router.delete('/batches/:batchID', function(req, res, next){
	// remove all batch under same combination
	Batch.remove({combination: req.batch.combination}, (err)=>{
		if(err) return next(err);
		/* remove combination as conflict for all other batches */
		Batch.update({conflicts: req.batch.combination }, { $pull: { conflicts: req.batch.combination } }, { multi: true }, (err)=>{
			if(err) return next(err);
			/* return all batches */
			Batch.find({}, function(err, batches){
				if(err) return next(err);
				res.status(200);
				res.json(batches);
			});
		});
	});
});

module.exports = Router;