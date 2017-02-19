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
    fakeName: {
      type: 'string'
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
      type: 'string'
    }
  }
};

