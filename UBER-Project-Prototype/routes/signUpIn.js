var ejs = require("ejs");

/**
 * Opening Login page
 */
exports.signIn=function(req, res) {

	ejs.renderFile('./views/signInPg.ejs', function(err, result) {

		if (!err) {
			res.end(result);
		}

		else { 
			res.end('An error occurred');
			console.log(err);
		}
	});
};
/**
 * Opening SignUp page
 */
exports.signUp=function(req, res) {

	ejs.renderFile('./views/signUpPg.ejs', function(err, result) {

		if (!err) {
			res.end(result);
		}

		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};
/**
 * Opening Customer Login page
 */
exports.customerSignIn=function(req, res) {

	ejs.renderFile('./views/customerSignin.ejs', function(err, result) {

		if (!err) {
			res.end(result);
		}

		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};
/**
 * Opening Driver Login page
 */
exports.driverSignIn=function(req, res) {

	ejs.renderFile('./views/driverSignin.ejs', function(err, result) {

		if (!err) {
			res.end(result);
		}

		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};
/**
 * Opening admin Login page
 */
exports.adminSignIn=function(req, res) {

	ejs.renderFile('./views/adminSignin.ejs', function(err, result) {

		if (!err) {
			res.end(result);
		}

		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};
/**
 * Opening Customer Signup page
 */
exports.customerSignUp=function(req, res) {

	ejs.renderFile('./views/customerSignup.ejs', function(err, result) {

		if (!err) {
			res.end(result);
		}

		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};
/**
 * Opening Driver Signup page
 */
/*exports.driverSignUp=function(req, res) {

	ejs.renderFile('./views/driverSignup.ejs', function(err, result) {

		if (!err) {
			res.end(result);
		}

		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
};*/