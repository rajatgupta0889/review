/**
 * EmotionsController
 *
 * @description :: Server-side logic for managing emotions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  addEmotion: function (request, response) {
    var userId = request.user_details.id;
    Emotions.doAddEmotion(request.body, userId, function (error, userData) {
      if (error) {
        response.negotiate(error);
      } else {
        response.json(userData);
      }
    });
  },

  removeEmotion: function (request, response) {
    var userId = request.user_details.id;
    Emotions.doRemoveEmotion(request.body, userId, function (error, userData) {
      if (error) {
        response.negotiate(error);
      } else {
        response.json({
          message: "Emotion removed Successfully"
        });
      }
    });
  }

};
