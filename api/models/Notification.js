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


    Notification.findOne({userId: request.userId, vent: request.vent}).exec(function (error, emotionData) {
      var payload = {
        userId: request.userId,
        vent: request.vent,
        emotionId: request.id
      };
      if (error) {
        callBack(error, null);
      } else if (!emotionData) {
        Notification.create(payload, function (error, updateData) {
          if (error) {
            callBack(error, null);
          } else {
            // Emotions.notifyUser(updateData, ventData);
            callBack(null, updateData);
          }
        });
      } else {
        Notification.update({
          userId: request.userId,
          vent: request.vent
        }, payload, function (error, updateData) {
          if (error) {
            callBack(error, null);
          } else {
            // Emotions.notifyUser(updateData[0], ventData);
            callBack(null, updateData[0]);
          }
        });
      }
    });
  },
};

