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
		User.add(data, function(err, user){
			if(err){
				res.negotiate(err);
			}else{
				sails.log.debug("User is : ", user);
				Token.sendToken(user, function(err, tokenDetail){
					if(!err){
						res.json(user);
					}else{
						res.negotiate(err);
					}
				});
			}
		});
	},

	getProfile: function(req,res){
		var id = req.param('id');
		User.getProfile(id,function(err,users){
			if(err){
				res.negotiate(err);
			}else{
				res.json(users);
			}
		});
  	},

  	updateProfile: function(req,res){
  		var data = req.body;
  		console.log("Data in req body",data);
		User.updateProfile(data,function(err,user){
			if(err){
				res.negotiate(err);
			}else{
				res.json(user);
			}
		});
  	},


	deleteUser: function(req, res){
	    var data = req.body;
	    console.log("Data in req body",data);
	    User.deleteUser(data, function(err, result){
	      if(err){
	        res.negotiate(err);
	      }else{
	        res.json(result);
	      }
	    });
  	},

  	login: function(req, res){
		var data = req.body;
		console.log("Data in req body",data);
		User.login(data, function(err, result){
			if(err){
				res.negotiate(err);
			}else{
				res.json(result);
			}
		});
	},

	logout: function(req,res){
		var id = req.param('id');
		User.logout(id,function(err,user){
			if(err){
				res.negotiate(err);
			}else{
				res.json(user);
			}
		});
	},

	forgotPassword: function(req,res){
		var fakeName = req.param('fakeName');
		User.forgotPassword(fakeName,function(err,user){
			if(err){
				res.negotiate(err);
			}else{
				res.json(user);
			}
		});
	},

	changePassword: function(req, res){
		var cred = req.body;
		console.log("Data in req body",cred);
		User.changePassword(cred, function(err, result){
			if(err){
				res.negotiate(err);
			}else{
				res.json(result);
			}
		});
	},
	
};

