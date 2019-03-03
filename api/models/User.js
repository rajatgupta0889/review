/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
const bcrypt = require('bcrypt');
module.exports = {

  attributes: {
    name: {
      type: 'string'
    },
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    mobile: {
      type: 'string',
      unique: true
    },
    userName: {
      type: 'string',
      unique: true
    },
    password: {
      type: 'string'
    },
    avatar: {
      type: 'string'
    },
    role: {
      type: 'string',
      defaultsTo: 'user',
      enum: ["user", "admin"]
    },
    isVerified: {
      type: 'boolean',
      defaultsTo: false
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

  signup: function (user, cb) {
    User.findOne({email: user.email}, function (err, foundUser) {
      if (!err) {
        if (foundUser) {
            cb({
              status:400,
              error:"User already exists"
            })
        } else {
          bcrypt.hash(user.password, 10, function(err, hash) {
            if(!err) {
              user.password = hash;
              // Store hash in database
              User.create(user, function (err, newUser) {
                if (!err) {
                  console.log("User created ", newUser);
                  delete newUser.password;
                  cb(null,newUser)
                } else {
                  cb(err);
                }
              });
            }
          });

        }
      }else{
        cb(err);
      }
    });
  },
  login: function(user,cb){
    User.findOne({email: user.email}, function (err, foundUser) {
      if (!err) {
        if (!foundUser) {
          cb({
            status:400,
            error:"Invalid credentials"
          });
        } else {
          bcrypt.compare(user.password, foundUser.password, function(err, res) {
            if(res) {
              // Passwords match
              delete foundUser.password
              cb(null,foundUser);
            } else {
              // Passwords don't match
              cb({
                status:400,
                error:"Invalid credentials"
              });
            }
          });
        }
      }else{
        cb(err);
      }
    });
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
        if (updatedUser.length == 0) {
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
  }

};




