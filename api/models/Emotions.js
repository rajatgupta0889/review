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
    Vent.findOne({id: request.ventId}).exec(function (error, ventData) {
      if (error) {
        callBack(error, null);
      } else if (!ventData) {
        callBack({
          status: 400,
          message: "No Vent found"
        }, null);
      } else {
        User.findOne({id: userId}).exec(function (error, userData) {
          if (error) {
            callBack(error, null);
          } else if (!userData) {
            callBack({
              status: 400,
              message: "No User found"
            }, null);
          } else {
            Emotions.findOne({
              userId: userId,
              vent: request.ventId
            }).exec(function (error, emotionData) {
              var payload = {
                userId: userId,
                vent: request.ventId,
                emotionValue: request.emotion.emotionValue,
                emotionMessage: request.emotion.emotionMessage
              };
              if (error) {
                callBack(error, null);
              } else if (!emotionData) {
                Emotions.create(payload, function (error, updateData) {
                  if (error) {
                    callBack(error, null);
                  } else {
                    Emotions.notifyUser(updateData, ventData);
                    callBack(null, updateData);

                  }
                });
              } else {
                Emotions.update({
                  userId: userId,
                  vent: request.ventId
                }, payload, function (error, updateData) {
                  if (error) {
                    callBack(error, null);
                  } else {
                    sails.log.debug(updateData[0]);
                    Emotions.notifyUser(updateData[0], ventData);
                    callBack(null, updateData[0]);
                  }
                });
              }
            });
          }
        });
      }
    });
  },

  notifyUser: function (updateData, ventData) {
    sails.log.debug(ventData, updateData);
    if(!updateData)
      return;
    Notification.addNotification(updateData, function (error, userData) {
      if (error) {
        response.negotiate(error);

      } else {
        sails.log.debug('notification added');
        Emotions.notifyUser(updateData[0], ventData);
      }

    });

    Notification.find({id: updateData.vent}).populateAll().exec(function (error, notifications) {
      if (!error || !notifications) {

        var payload = {
          notification: {
            title: "Gargle",
            body: notifications.size + " people have dittoed you"
          }
        };
        NotificationService.sendToDevice(notifications[0].userId.deviceId, payload, null, function (error, response) {
          if (error) {
            console.log("Error sending message:", error);
          } else {
            console.log("Successfully sent message:", response);
          }
        });
      } else {
        sails.log.debug("Error while creating notif")
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
        User.findOne({id: userId}).exec(function (error, userData) {
          if (error) {
            callBack(error, null);
          } else if (!userData) {
            callBack({
              status: 400,
              message: "No User found"
            }, null);
          } else {
            Emotions.findOne({
              userId: userId,
              vent: request.ventId
            }).exec(function (error, emotionData) {
              if (error) {
                callBack(error, null);
              } else if (!emotionData) {
                callBack({
                  status: 400,
                  message: "No Emotion found"
                }, null);
              } else {
                Emotions.destroy({
                  userId: userId,
                  vent: request.ventId
                }).exec(function (error, destroyData) {
                  if (error) {
                    callBack(error, null);
                  } else {
                    callBack(null, destroyData);
                  }
                });
              }
            });
          }
        });
      }
    });
  }

};
