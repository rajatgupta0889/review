/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


  getProfile: function (req, res) {
    var id = req.param('id');
    if (!id) {
      id = req.user_details.id;
    }
    User.getProfile(id, function (err, users) {
      if (err) {
        res.negotiate(err);
      } else {
        res.json(users);
      }
    });

  },

  updateProfile: function (req, res) {
    var data = req.body;
    console.log("Data in req body", data);
    User.updateProfile(data, function (err, user) {
      if (err) {
        res.negotiate(err);
      } else {
        res.json(user);
      }
    });
  },


  deleteUser: function (req, res) {
    var data = req.body;
    console.log("Data in req body", data);
    User.deleteUser(data, function (err, result) {
      if (err) {
        res.negotiate(err);
      } else {
        res.json(result);
      }
    });
  },

  logout: function (req, res) {
    var id = req.user_details.id;
    User.logout(id, function (err, user) {
      if (err) {
        res.negotiate(err);
      } else {
        res.json(user);
      }
    });
  },

  signup: function (req, res) {
    console.log("Data in req body", req.body);
    User.signup(req.body, function (err, user) {
      if (err) {
        res.negotiate(err);
      } else {
        res.json(user);
      }
    });
  },
  login: function (req,res) {
    sails.log.debug(req.body);
    User.login(req.body, function (err, user) {
      if (err) {
        res.negotiate(err);
      } else {
        Token.sendToken(user, function (err, tokenDetail) {
          if (!err) {
            res.json(tokenDetail);
          } else {
            res.negotiate(err);
          }
        });

      }
    });
  },
  getData:function (req,res) {
    sails.log.debug("Data");
    HttpServiceHelper.getRequest("restaurant","?res_id=18627369",function (err,data) {
      if(err){
        res.negotiate(err);
      }else{
        res.json(data);
      }

    });

  }
};

