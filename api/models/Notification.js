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
      sails.log.debug('Pay load', payload);
      if (error) {
        callBack(error, null);
      } else if (!emotionData) {
        Notification.create(payload, function (error, updateData) {
          if (error) {
            callBack(error, null);
          } else {
            // Emotions.notifyUser(updateData, ventData);
            sails.log.debug('create', updateData);
            callBack(null, updateData);
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
            sails.log.debug('update', updateData[0]);
            callBack(null, updateData[0]);
          }
        });
      }
    });
  },

  getAllNotification: function (request, userId, cb) {
    if (!request.createdAt) {
      request.createdAt = new Date();
      sails.log.debug(request);
    }
    Vent.find({
      user: userId,
      createdAt: {'<': request.createdAt}
    }).limit(10).sort('createdAt DESC').populateAll().exec(function (err, vents) {
      if (err) {
        cb(err);
      } else {
        var result = [];
        _.each(vents, function (vent) {
          var resultObj = {};
          if (vent.emotion.length > 1) {
            if (vent.emotion.length == 1) {
              if (vent.emotion[0].userId == userId) {
              } else {
                resultObj.count = vent.emotion.length;
                result.push(resultObj);
              }
            } else {
              resultObj.count = vent.emotion.length;
              result.push(resultObj);
            }
          }
        });

        cb(null, result);
      }
    });
  }
};

