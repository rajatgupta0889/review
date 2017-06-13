/**
 * Notification.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    emotion: {
      model: 'emotions'
    },
    user: {
      model: 'user'
    },
    vent: {
      model: 'vent'
    },
    notificationType: {
      type: 'integer',
      defaultsTo: 0
    }

  },


  addNotification: function (request, callBack) {


    Notification.findOne({user: request.userId, vent: request.vent}).exec(function (error, emotionData) {
      var payload = {
        user: request.userId,
        vent: request.vent,
        emotionId: request.id
      };
      sails.log.debug('Pay load',payload);
      if (error) {
        callBack(error, null);
      } else if (!emotionData) {
        Notification.create(payload, function (error, updateData) {
          if (error) {
            callBack(error, null);
          } else {
            // Emotions.notifyUser(updateData, ventData);
            sails.log.debug('create',updateData);
            callBack(null,updateData);
          }
        });
      } else {
        Notification.update({
          user: request.userId,
          vent: request.vent
        }, payload, function (error, updateData) {
          if (error) {
            callBack(error, null);
          } else {
            // Emotions.notifyUser(updateData[0], ventData);
            sails.log.debug('update',updateData[0]);
            callBack(null,updateData[0]);
          }
        });
      }
    });
  },
};

