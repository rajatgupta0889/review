/**
 * Emotions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    expressValue: {
      type: 'string'
    },

    expressMsg: {
      type: 'string'
    },

    ventinfo: {
      model: 'vent'
    }
  },

  doAddEmotion: function (request, callBack) {
    Vent.findOne({id: request.ventinfo}).populateAll().exec(function (error, userData) {
      if (error) {
        callBack(error, null);
      } else if (!userData) {
        callBack({
          status: 400,
          message: "No Vent found"
        }, null);
      } else {
        Emotions.findOne({
          userId: request.userId,
          ventinfo: request.ventinfo
        }).populateAll().exec(function (error, userData) {
          if (error) {
            callBack(error, null);
          } else if (!userData) {
            Emotions.create(request, function (error, updateData) {
              if (error) {
                callBack(error, null);
              } else {
                callBack(null, updateData);
              }
            });
          } else {
            Emotions.update({
              userId: request.userId,
              ventinfo: request.ventinfo
            }, request, function (error, updateData) {
              if (error) {
                callBack(error, null);
              } else {
                callBack(null, updateData);
              }
            });
          }
        });

      }
    });
  },

  doRemoveEmotion: function (request, callBack) {
    Vent.findOne({id: request.ventinfo}).populateAll().exec(function (error, userData) {
      if (error) {
        callBack(error, null);
      } else if (!userData) {
        callBack({
          status: 400,
          message: "No Vent found"
        }, null);
      } else {
        Emotions.findOne({
          userId: request.userId,
          ventinfo: request.ventinfo
        }).populateAll().exec(function (error, userData) {
          if (error) {
            callBack(error, null);
          } else if (!userData) {
            callBack({
              status: 400,
              message: "No Vent found"
            }, null);
          } else {
            Emotions.destroy({
              userId: request.userId,
              ventinfo: request.ventinfo
            }).exec(function (error, updateData) {
              if (error) {
                callBack(error, null);
              } else {
                callBack(null, updateData);
              }
            });
          }
        });

      }
    });
  }

};
