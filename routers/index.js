const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();


/* all routes before authentication */
const loginRouter = require('./login.js');


/* all routes after authentication */
const routerStages = require('./router-stages.js');
const routerCampus = require('./router-campus.js');
const routerBatches = require('./router-batches.js');
const routerSessions = require('./router-sessions.js');


const authenticate = function(req, res, next) {
    // check query for token
	var token = req.cookies.token || req.headers.token;
    // decode token
	if (token) {
        // verifies secret and checks exp
		jwt.verify(token, "super-secret-key", function(err) {
			if (err) {
				let err = new Error("Failed to authenticate token.");
				next(err);
			} else {
				next();
			}
		});
	} else {
        // if there is no token, return an error
		let err = new Error("Need to login");
		next(err);
	}
};

router.use(loginRouter, authenticate, routerCampus, routerStages, routerBatches, routerSessions);

module.exports = router;
