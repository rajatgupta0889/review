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

  doAddEmotion: function (request, callBack) {
    Vent.findOne({id: request.ventId}).exec(function (error, ventData) {
      if (error) {
        callBack(error, null);
      } else if (!ventData) {
        callBack({
          status: 400,
          message: "No Vent found"
        }, null);
      } else {
        User.findOne({id: request.userId}).exec(function (error, userData) {
          if (error) {
            callBack(error, null);
          } else if (!userData) {
            callBack({
              status: 400,
              message: "No User found"
            }, null);
          } else {
            Emotions.findOne({
              userId: request.userId,
              vent: request.ventId
            }).exec(function (error, emotionData) {
              var payload = {
                userId: request.userId,
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
                  userId: request.userId,
                  vent: request.ventId
                }, payload, function (error, updateData) {
                  if (error) {
                    callBack(error, null);
                  } else {
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
    User.findOne({id: updateData.userId}).populateAll().exec(function (error, userData) {
      var payload = {
        notification: {
          title: "Vent Out",
          body: userData.name + " " + updateData.emotionMessage + " your Vent"
        },
        data: {
          ventId: updateData.vent
        }
      };
      User.findOne({id: ventData.user}).populateAll().exec(function (error, ventUserData) {
        sails.log.debug(ventUserData);
        NotificationService.sendToDevice(ventUserData.fcmToken, payload, null, function (error, response) {
          if (error) {
            console.log("Error sending message:", error);
          } else {
            console.log("Successfully sent message:", response);
          }
        });
      });

    });
  },

  doRemoveEmotion: function (request, callBack) {
    Vent.findOne({id: request.ventId}).exec(function (error, ventData) {
      if (error) {
        callBack(error, null);
      } else if (!ventData) {
        callBack({
          status: 400,
          message: "No Vent found"
        }, null);
      } else {
        User.findOne({id: request.userId}).exec(function (error, userData) {
          if (error) {
            callBack(error, null);
          } else if (!userData) {
            callBack({
              status: 400,
              message: "No User found"
            }, null);
          } else {
            Emotions.findOne({
              userId: request.userId,
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
                  userId: request.userId,
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
