/**
* Notification.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	emotionId: {
      type: 'emotion'
    },

    userId: {
      model: 'user'
    },

    vent: {
      model: 'vent'
    }

  },


  addNotification: function (ventId, userId, callBack) {


  	Notification.findOne({userId: userId,
              vent: ventId
            }).exec(function (error, emotionData) {
              var payload = {
                userId: userId,
                vent: ventId,
                emotionId: request.emotion
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
                  userId: userId,
                  vent: request.ventId
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

