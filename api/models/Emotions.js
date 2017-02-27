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
      enum: [0, 1, 2, 3, 4, 5, 6],
      defaultsTo: 0
    },
    emotionMessage: {
      type: 'string',
      enum: ["", "Like", "Love", "HaHa", "Wow", "Sad", "Angry"],
      defaultsTo: ""
    },

    userId:{
      model:'user'
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
        User.findOne({id: request.userId}).exec(function (error,userData) {
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
                emotionValue:request.emotion.emotionValue,
                emotionMessage:request.emotion.emotionMessage
              };
              if (error) {
                callBack(error, null);
              } else if (!emotionData) {
                Emotions.create(payload, function (error, updateData) {
                  if (error) {
                    callBack(error, null);
                  } else {
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
                    callBack(null, updateData);
                  }
                });
              }
            });
          }
        });
      }
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
