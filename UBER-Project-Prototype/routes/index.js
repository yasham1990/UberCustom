
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('driver', { title: 'Express' });
};
exports.partials=function(req,res){
	console.log('came in');
	var filename = req.params.filename;
	console.log('File name is '+filename);
	if(!filename) return;  // might want to change this
	  {
		  res.render("partials/" + filename );
		  console.log('Where u trying here?')
	  }
	
};