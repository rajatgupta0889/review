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
    email: {
      type: 'string',
      unique: true
    },
    mobile: {
      type: 'string',
      required: true,
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
      type: 'integer',
      defaultsTo: 0

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
      defaultsTo: 'user',
      enum: ["user", "admin"]
    },
    isSensitiveMedia: {
      type: 'boolean',
      defaultsTo: false
    },
    // loginType: {
    //   type: 'string',
    //   enum: ['facebook', 'simple', 'google'],
    //   defaultsTo: 'simple'
    // },
    isVerified: {
      type: 'boolean',
      defaultsTo: false
    },
    otp: {
      type: 'string'
    }
  },

  getProfile: function (id, cb) {
    User.userExistsById(id, cb);
  },

  updateProfile: function (user, cb) {
    User.updateUser(user, cb);
  },

  deleteUser: function (user, cb) {
    User.userExistsById(user.id, function (error, foundUser) {
      if (error) {
        return cb(error);

      }
      if (!foundUser)    //puppies dying in this line!!!!
        cb({msg: "User does not exist."});
      User.destroy({id: foundUser.id}).exec(function (err) {
        if (err) {
          cb(err);
        }
        sails.log('User have now been deleted.');
        cb(null, {msg: "User have now been deleted."});
      });
    })


  },

  logout: function (id, cb) {
    if (id) {
      User.userExistsById(id, function (err, user) {
        if (!err) {
          sails.log.debug('user found ', user);
          user.active = false;
          User.updateProfile(user, function (err, user) {
            if (!err) {
              cb(null, {msg: "User has been logged out."});
            } else {
              cb(err);
            }
          });
        } else {
          cb(err);
        }
      });

    }
  },

  signup: function (mobile, cb) {
    User.findOne({"mobile": mobile}, function (err, foundUser) {
      if (!err) {
        if (foundUser) {
          sails.log.debug('user found ', foundUser);
          User.generateOTP(foundUser, cb);
        } else {
          var user = {};
          user.mobile = mobile;

          User.create(user, function (err, newUser) {
            if (!err) {
              console.log("User created ", newUser);
              User.generateOTP(newUser, cb);
            }
            else
              cb(err);
          });
        }
      }
    });
  },


  verifyOTP: function (user, cb) {
    if (user) {
      User.findOne({"mobile": user.mobile}, function (err, foundUser) {
        if (!err) {
          sails.log.debug('user found ', foundUser);
          if (foundUser.otp == user.otp) {
            foundUser.isVerified = true;
            foundUser.active = true;
            cb(null, foundUser);
            User.updateUser(foundUser, function (err, updatedUser) {
              if (!err) {
                sails.log.debug("user is updated successfully");
              } else {
                sails.log.error(err);
              }
            });
          } else {
            cb({message: "OTP is not valid", status: 401});
          }
        } else {
          cb(err);
        }
      });
    }
  },
  userExistsById: function (id, cb) {
    //sails.log.debug("inside create: ",user);
    User.findOne({"id": id}, function (err, foundUser) {
      if (!err) {
        if (foundUser) {
          sails.log.debug('user found ', foundUser);
          cb(null, foundUser);
        } else {
          cb({message: "User does not exist", status: 400});
        }
      }
    });
  },
  updateUser: function (user, cb) {
    User.update({"id": user.id}, user, function (err, updatedUser) {
      if (!err) {
        if (user.length == 0) {
          cb({message: "User is not found", status: 400});
        } else {
          sails.log.debug('user found', updatedUser);
          cb(null, updatedUser[0]);
        }
      } else {
        if (err.invalidAttributes) {
          cb({message: "Fake Name Already exist", status: 400});
        } else {
          cb(err);
        }
      }
    });
  },
  generateOTP: function (user, cb) {

    // var otp = Math.floor(Math.random() * 9000) + 1000;
    var otp = '0000';
    //send otp
    //sendOTP(otp);
    user.otp = otp;

    User.updateProfile(user, function (err, updatedUser) {
      if (!err) {
        delete updatedUser.otp
        cb(null, updatedUser);
      }
      else {
        cb(err);
      }
    });
  },

  sendNotificationToAdmin : function (ventData) {

    User.find({role: "admin"},function (err,users) {
      if(!err){
        if(users){
          _.each(users, function(user) {
            var payload = {
              notification: {
                title: "Gargle",
                body: ventData,
                type: "new_post"
              }
            };
            NotificationService.sendToDevice(user.deviceId, payload, null, function (error, response) {
              if (error) {
                console.log("Error sending message:", error);
              } else {
                console.log("Successfully sent message:", response);
              }
            });
          });

        }else {
          sails.log.debug("No admin user found");
        }
      }else{
        sails.log.error(err)
      }

    })


  }

};




