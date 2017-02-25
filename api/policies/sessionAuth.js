/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function (req, res, next) {

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  var apiKey = req.headers.apikey;
  token = req.headers.token;


  if (apiKey === "$2a$10$.CPkZU3.R3bRE3bDI5epUuuHrUe63EbqW7HhhOriSj5beFwTdT16W") {
    Token.findOne({id: token}, function (err, tokenDetails) {
      if (!err) {
        if (tokenDetails) {

          chkExpiredToken(tokenDetails, function (err, isTokenExpired) {
            if (!err) {
              if (!(isTokenExpired)) {
                req.user_details = tokenDetails.user_details;
                next();
              } else {
                return res.status(401).json({"message": "Token is expired"});
              }
            } else {
              return res.json(err);
            }
          });

        } else {
          return res.status(401).json({"message": "user token is either not valid or expired"});
        }
      } else {
        sails.config.globals.logger.error(err);
        return res.json(err);
      }
    });
  } else {
    return res.status(401).json({"message": "API key is not valid"});
  }


  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  /*if (req.session.user_details) {
   return next();
   }*/

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.forbidden('You are not permitted to perform this action.');
  //return res.status(401).json({"message" : "user is not logged in"});

};


var chkExpiredToken = function (tokenDetail, cb) {
  var currentDateTime = new Date();
  var tokenExpireTime = tokenDetail.expire;

  if (tokenExpireTime > currentDateTime) {
    //not expired
    return cb(null, false);
  } else {
    Token.destroy({id: tokenDetail.id}, function (err, result) {
      if (!err) {
        return cb(null, true);
      } else {
        sails.config.globals.logger.error(err);
        return cb(null, true);
      }
    });
  }
};
