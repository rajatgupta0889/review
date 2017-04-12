/**
 * Token.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {},

  checkTokenId: function (token, cb) {
    Token.findOne({id: token}, function (err, tokenDetails) {
      if (!err) {
        if (tokenDetails) {
          if (!tokenExpired(tokenDetails)) {
            cb(null, tokenDetails);
          } else {
            cb({"message": "user token is either not valid or expired"});
          }
        } else {
          cb({"message": "user token is either not valid or expired"});
        }
      } else {
        sails.log.error(err);
        cb(err);
      }
    });
  },

  createToken: function (reqBody, cb) {
    var d = new Date();
    d.setMonth(d.getMonth() + 3);
    reqBody.expire = d;
    Token.create(reqBody, function (err, tokenDetail) {
      return cb(err, tokenDetail);
    });
  },

  sendToken: function (userObj, cb) {
    chkTokenExist(userObj.email, function (err, tokenDetail) {
      if (!err) {
        if (tokenDetail && !tokenExpired(tokenDetail)) {
          userObj.token = {
            "access_token": tokenDetail.id,
            "expires_on": tokenDetail.expire
          };
          cb(null, userObj);
        } else {
          var reqBody = {user_details: userObj};
          Token.createToken(reqBody, function (err, tokenDetail) {
            if (!err) {
              userObj.token = {
                "access_token": tokenDetail.id,
                "expires_on": tokenDetail.expire
              };
              cb(null, userObj);
            } else {
              sails.log.error(err);
              cb(err);
            }
          });
        }
      } else {
        sails.log.error(err);
        cb(err);
      }
    });
  },

  deleteToken: function (id, cb) {
    Token.destroy({id: id}, function (err, result) {
      if (!err) {
        return cb(null, true);
      } else {
        sails.log.error(err);
        return cb(null, true);
      }
    });
  }

};

function tokenExpired(tokenDetail) {
  // body...
  var currentDateTime = new Date();
  var tokenExpireTime = tokenDetail.expire;

  if (tokenExpireTime > currentDateTime) {
    //not expired
    return false;
  } else {
    Token.deleteToken(tokenDetail.id, function (err, result) {
      return true;
    });

  }
}

function chkTokenExist(email, cb) {
  Token.findOne({"user_details.email": email}, function (err, tokenDetail) {
    return cb(err, tokenDetail);
  });
}




