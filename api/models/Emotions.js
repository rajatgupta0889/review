/**
 * Emotions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
    emotionValue: {
      type: 'integer',
      enum: [1, 2, 3, 4],
      defaultsTo: 1
    },
    emotionMessage: {
      type: 'string',
      enum: ["Like", "HaHa", "Sad", "Angry"],
      defaultsTo: "Like"
    },

    userId: {
      model: 'user'
    },

    vent: {
      model: 'vent'
    }
  },

  doAddEmotion: function (request, userId, callBack) {
    var payload = {
      userId: userId,
      vent: request.ventId,
      emotionValue: request.emotion.emotionValue,
      emotionMessage: request.emotion.emotionMessage
    };
    Emotions.findOne({userId: userId, vent: request.ventId}).exec(function (error, emotionData) {
      if (error) {
        callBack(error, null);
      } else if (!emotionData) {
        Emotions.create(payload, function (error, emotion) {
          if (error) {
            callBack(error, null);
          } else {
            Emotions.notifyUser(emotion);
            callBack(null, emotion);
          }
        });
      } else {
        Emotions.update({
          userId: userId,
          vent: request.ventId
        }, payload, function (error, updatedEmotion) {
          if (error) {
            callBack(error, null);
          } else {
            sails.log.debug(updatedEmotion[0]);
            callBack(null, updatedEmotion[0]);
            Emotions.notifyUser(updatedEmotion[0]);
          }
        });
      }
    });

  },

  notifyUser: function (emotion) {
    // sails.log.debug('Vent data', vent);
    sails.log.debug('Updated Data', emotion);
    Notification.addNotification(emotion, function (error, notification) {
      if (error) {
        response.negotiate(error);

      } else {
        sails.log.debug('notification added');
        Emotions.find({vent: emotion.vent,emotionValue : 1}).populateAll().exec(function (error, emotions) {
          sails.log.debug(emotions);

          if (!error || !emotions && emotions.length > 0) {
            var msg= " dittoed you.";
            if(emotions.length == 1){
              msg = "1 person has" + msg
            }else {
              msg = emotions.length + " have" + msg;
            }
            var payload = {
              notification: {
                title: "Gargle",
                body: msg
              }
            };
            User.userExistsById(emotions[0].vent.user, function (error, user) {
              NotificationService.sendToDevice(user.deviceId, payload, null, function (error, response) {
                if (error) {
                  console.log("Error sending message:", error);
                } else {
                  console.log("Successfully sent message:", response);
                }
              });
            });
          } else {
            sails.log.debug("Error while finding notif")
          }
        });
      }

    });


  },

  doRemoveEmotion: function (request, userId, callBack) {
    Vent.findOne({id: request.ventId}).exec(function (error, ventData) {
      if (error) {
        callBack(error, null);
      } else if (!ventData) {
        callBack({
          status: 400,
          message: "No Vent found"
        }, null);
      } else {
        Emotions.findOne({userId: userId, vent: request.ventId}).exec(function (error, emotionData) {
          if (error) {
            callBack(error, null);
          } else {
            Emotions.destroy({userId: userId, vent: request.ventId}).exec(function (error, destroyData) {
              if (error) {
                callBack(error, null);
              } else {
                callBack(null, destroyData);
              }
            });
            Notification.destroy({userId: userId, vent: request.ventId}).exec(function (error, destroyData) {
              if (error) {
                sails.log.error(error);
              } else {
                sails.log.debug('success');
              }
            })
          }
        });
      }
    });
  }

};
