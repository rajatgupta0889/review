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
    Vent.create(request, function (error, ventData) {
      if (error) {
        callBack(error, null);
      } else {
        callBack(null, ventData);
      }
    });
  },

  getMyVentList: function (request, callBack) {
    Vent.find({
      createdAt: {'<': request.createdAt},
      user: request.userId
    })
      .limit(10)
      .sort('createdAt DESC')
      .populateAll()
      .exec(
        function (error, ventData) {
          if (error) {
            callBack(error, null);
          } else if (!ventData) {
            callBack({
              status: 400,
              message: "No Vent found"
            }, null);
          } else {
            callBack(null, ventData);
          }
        });
  },

  getAllVentList: function (request, callBack) {
    Vent.find({
      createdAt: {'<': request.createdAt}
    }).limit(10)
      .sort('createdAt DESC')
      .populateAll().exec(function (error, ventData) {
      if (error) {
        callBack(error, null);
      } else if (!ventData) {
        callBack({
          status: 400,
          message: "No Vent found"
        }, null);
      } else {
        callBack(null, ventData);
      }
    });
  },

  doDeleteVent: function (request, callBack) {
    Vent.findOne({user: request.userId, id: request.ventId}).exec(function (error, ventData) {
      if (error) {
        callBack(error, null);
      } else if (!ventData) {
        callBack({
          status: 400,
          message: "No Vent found"
        }, null);
      } else {
        Vent.destroy({user: request.userId, id: request.ventId}).exec(function (error, ventData) {
          if (error) {
            callBack(error, null);
          } else if (!ventData) {
            callBack({
              status: 400,
              message: "No Vent found"
            }, null);
          } else {
            callBack(null, ventData[0]);
          }
        });
      }
    });
  }
};

