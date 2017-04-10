/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string'
    },
    email:{
      type: 'string',
      unique: true
    },
    mobile:{
      type: 'integer',
      unique: true
    },
    fakeName: {
      type: 'string',
      unique: true
    },
    gender: {
      type: 'string'
    },
    profession: {
      type: 'string'
    },
    hobbies: {
      type: 'array'
    },
    deviceId: {
      type: 'string'
    },
    city: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    avatar: {
      type: 'string'
    },
    ventCount: {
      type: 'integer'
    },
    passcode: {
      type: 'string'
    },
    active: {
      type: 'boolean',
      defaultsTo: false
    },
    role: {
      type: 'string',
      defaultsTo: 'user'
    },
    isSensitiveMedia: {
      type: 'boolean',
      defaultsTo: false
    },
    loginType: {
      type: 'string',
      enum: ['facebook', 'simple','google'],
      defaultsTo: 'simple'
    },
    isVerified: {
      type: 'boolean',
      defaultsTo: false
    },
    otp: {
      type: 'int'
    },
    fcmToken:{
      type:'string'
    }
  },



add: function(user, cb){

        // sails.log.debug('points models', user_id, event);
        if(user.loginType==='facebook'){

          createUser(user,cb);
        }
        else if(user.loginType==='google'){
          createUser(user,cb);
        }
        else
          cb({message:"invalid login type",status:"failure"});

    },

    getProfile: function(id, cb){

        //sails.log.debug("Start time ", new Date());
      if(id){
        User.findOne({"id": id}, function(err,user){
          if(!err){
            sails.log.debug('user found ' ,user);
             cb(null,user);
          }else{
            cb(err);
          }
        });
      }
      else{
        User.find().exec(function(err, users){
          if(!err){

             sails.log.debug('user found ' ,users);
             cb(null,users);

          }else{
            cb(err);
          }

        });
      }
    },

    updateProfile: function(user, cb){

        User.update({"id": user.id}, user, function(err,updatedUser){
          if(!err){
            if(user.length==0){
              cb({message: "User is not found", status:400});
            }else{
              sails.log.debug('user found' ,updatedUser);
              cb(null,updatedUser[0]);
            }
          }else{
            cb(err);
          }

        });

    },


    deleteUser: function (user, cb) {

    User.findOne({id: user.id}).exec(function (error, user){
      if(error){
        return cb(error);

      }
      if(!user)    //puppies dying in this line!!!!
        return cb({msg: "User does not exist."});

      User.destroy({id: user.id}).exec(function (err) {
      if (err) {
        return cb(err);
      }
      sails.log('User have now been deleted.');
      return cb(null, {msg: "User have now been deleted."});
    });
    });


  },

  login: function(cred, cb){
        if(cred){
        User.findOne({"fakeName": cred.fakeName}, function(err,user){
          if(!err){
            sails.log.debug('user found ' ,user);
            if(user.password==cred.password){
              active=true;
              cb(null,user);
            }
          }else{
            cb(err);
          }
        });
      }
    },

    logout: function(id, cb){
      if(id){
        User.findOne({"id": id}, function(err,user){
          if(!err){
            sails.log.debug('user found ' ,user);
            active=false;
             cb(null,{msg: "User has been logged out."});
          }else{
            cb(err);
          }
        });
      }
    },

    forgotPassword: function(fakeName, cb){
        User.findOne({"fakeName": fakeName}, function(err,user){
          if(!err){
            sails.log.debug('user found ' ,user);
            if(user.isVerified){
             //otpAuth();
             cb(null,user);
            }
          }else{
            cb(err);
          }
        });

    },

    changePassword: function(cred, cb){
        if(cred){
        User.findOne({"fakeName": cred.fakeName}, function(err,user){
          if(!err){
            sails.log.debug('user found ' ,user);

            if(!cred.oldPassword || user.password==cred.oldPassword){
                user.password=cred.newPassword;
                User.update({"id": user.id}, user, function(err,updatedUser){
                if(!err){
                  if(user.length==0){
                  cb({message: "User is not found", status:400});
                }else{
                  sails.log.debug('user found' ,updatedUser);
                  cb(null,updatedUser[0]);
                }
              }else{
                cb(err);
              }
            });
        }
          }else{
            cb(err);
          }
        });
      }
    },


    signup: function(mobile, cb){
        User.findOne({"mobile": mobile}, function(err,foundUser){
          if(!err){
            if(foundUser){
             sails.log.debug('user found ' ,foundUser);
              generateOTP(foundUser,cb);
           }else{
              var user = {};
              user.mobile = mobile;

              User.create(user,function(err,newUser){
              if(!err){
                console.log("User created ",newUser);
                generateOTP(newUser,cb);
              }
              else
                cb(err);
            });
           }
          }
      });
    },

    verifyOTP: function(user, cb){
        if(user){
        User.findOne({"mobile": user.mobile}, function(err,foundUser){
          if(!err){
            sails.log.debug('user found ' ,foundUser);
            if(foundUser.otp == user.otp){
              cb(null, foundUser);
            }else{
              cb({message: "OTP is not valid", status:401});
            }
          }else{
            cb(err);
          }
        });
      }
    }

};


function createUser(user, cb){
  //sails.log.debug("inside create: ",user);
     User.findOne({"email": user.email}, function(err,foundUser){
          if(!err){
            if(foundUser){
             sails.log.debug('user found ' ,foundUser);
             cb(null,foundUser);
           }else{
              cb({message:"user can not be created",status:400});
           }
          }
          else{
            user.isVerified=true;
             User.create(user,function(err,newUser){
              if(!err){
                console.log("User created ",newUser);
                cb(null,newUser);
              }
              else
                cb(err);
            });
          }
      });

    }

    function generateOTP(user,cb){

      var otp = Math.floor(Math.random() * 9000) + 1000;
      //send otp
      //sendOTP(otp);
      user.otp = otp;
      User.updateProfile(user,function(err,updatedUser){
        if(!err){
          cb(null,updatedUser);
        }
        else{
          cb(err);
        }
      });
    }

};
