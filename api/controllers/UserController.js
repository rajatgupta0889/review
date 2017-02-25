/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	addUser: function(req, res){
		var data = req.body;
		console.log("Data in req body",data);
		User.add(data, function(err, result){
			if(err){
				res.negotiate(err);
			}else{
				res.json(result);
			}
		});
	}
	
};

