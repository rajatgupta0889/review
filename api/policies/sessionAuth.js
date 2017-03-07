/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  var apiKey = req.headers.apikey;
      token = req.headers.token;


  if(apiKey === "$2a$10$.CPkZU3.R3bRE3bDI5epUuuHrUe63EbqW7HhhOriSj5beFwTdT16W"){
      Token.checkTokenId(token, function(err, tokenDetails){
          if(!err){
                req.user_details = tokenDetails.user_details;
                next();

          }else{
              sails.log.error(err);
              return res.status(401).json(err);
          }
      });
  }else{
      return res.status(401).json({"message" : "API key is not valid"});
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

