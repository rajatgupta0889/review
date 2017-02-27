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

    emotion: {
      collection: 'emotions',
      via: 'vent'
    }

  },

  doUpload: function (request, callBack) {
    Vent.create(request, function (error, userData) {
      if (error) {
        callBack(error, null);
      } else {
        callBack(null, userData);
      }
    });
  },

  getMyVentList: function (request, callBack) {
    Vent.find({user: request.userId}).populateAll().exec(function (error, userData) {
      if (error) {
        callBack(error, null);
      } else if (!userData) {
        callBack({
          status: 400,
          message: "No User found"
        }, null);
      } else {
        callBack(null, userData);
      }
    });
  },

  getAllVentList: function (request, callBack) {
    Vent.find().populateAll().exec(function (error, userData) {
      if (error) {
        callBack(error, null);
      } else if (!userData) {
        callBack({
          status: 400,
          message: "No User found"
        }, null);
      } else {
        callBack(null, userData);
      }
    });
  },

  doDeleteVent: function (request, callBack) {
    Vent.findOne({id: request.userId, id: request.ventId}).exec(function (error, userData) {
      if (error) {
        callBack(error, null);
      } else if (!userData) {
        callBack({
          status: 400,
          message: "No Vent found"
        }, null);
      } else {
        Vent.destroy({userId: request.userId, id: request.ventId}).exec(function (error, userData) {
          if (error) {
            callBack(error, null);
          } else if (!userData) {
            callBack({
              status: 400,
              message: "No User found"
            }, null);
          } else {
            callBack(null, userData[0]);
          }
        });
      }
    });
  }
};

