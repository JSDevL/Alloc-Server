const _ = require('underscore');
const express = require('express');
const router = express.Router();

const {Block, Room, Combination} = require('../models.js');

// get blocks
router.get('/alloc/blocks', function(req, res, next){
	Block.find({}).populate('floors.rooms').exec( function(err, blocks) {
		if(err) return next(err);
		res.status(200);
		res.json(blocks);
	});
});

router.param("roomID", function(req, res, next, roomID){
	Room.findById(roomID, function(err, room){
		if(err) return next(err);
		req.room = room;
		next();
	});
});

// post batch to room
router.post('/alloc/rooms/:roomID', function(req, res, next){
	req.room.batches.push(req.body.batch);
	
	/* check for conflicts */
	const currentCombiID = req.body.batch.combination;
	Combination.findById(currentCombiID, function(err, combi){
		if(err) return next(err);
		_.each(req.room.batches, function(batch){
			if( _.find(combi.conflicts, function(conflict){ return conflict.toString() == batch.toString() }) ){
				let err = new Error("batch conflict occured");
				next(err);
			}
		});

		req.room.save( function(err){
			if(err) return next(err);
			res.status(200);
			res.send();
		});
	});
});

// remove batch from room
router.put('/alloc/rooms/:roomID/batches', function(req, res, next){
	req.room.batches = _.reject(req.room.batches, (batch)=>{
		return batch.batch.toString() === req.body.batch.batch.toString();
	});

	req.room.save( function(err){
		if(err) return next(err);
		console.log(req.body.batch);
		res.status(200);
		res.send();
	});
});

module.exports = router;