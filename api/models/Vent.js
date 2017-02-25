/**
* Vent.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    text: {
      type: 'string'
    },
    location: {
      type: 'json'
    },
    user: {
      model: 'user'
    },
    isAnonymous: {
      type: 'boolean',
      defaultsTo: false
    },
    isSensitive: {
      type: 'boolean',
      defaultsTo: false
    },
    expresses: {
      collection: 'express',
      via: 'vent'
    }
  }
};

