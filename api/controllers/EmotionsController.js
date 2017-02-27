/**
 * EmotionsController
 *
 * @description :: Server-side logic for managing emotions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  addEmotion: function (request, response) {
    if (!request.body) {
      response.status(400).json({status: 400, message: "ERROR! payload missing"});
    } else if (!request.body.userId) {
      response.status(400).json({status: 400, message: "ERROR! parameter User Id is missing"});
    } else if (!request.body.ventinfo) {
      response.status(400).json({status: 400, message: "ERROR! parameter vent id is missing"});
    } else if (!request.body.emotion) {
      response.status(400).json({status: 400, message: "ERROR! parameter Emotion Object is missing"});
    } else if (!request.body.emotion.emotionValue) {
      response.status(400).json({status: 400, message: "ERROR! parameter Emotion value is missing"});
    } else if (!request.body.emotion.emotionMessage) {
      response.status(400).json({status: 400, message: "ERROR! parameter Emotion message is missing"});
    } else {
      Emotions.doAddEmotion(request.body, function (error, userData) {
        if (error) {
          response.status(error.status).json({error: error});
        } else {
          response.json(userData);
        }
      });
    }
  },

  removeEmotion: function (request, response) {
    if (!request.body) {
      response.status(400).json({status: 400, message: "ERROR! payload missing"});
    } else if (!request.body.userId) {
      response.status(400).json({status: 400, message: "ERROR! parameter User Id is missing"});
    } else if (!request.body.ventinfo) {
      response.status(400).json({status: 400, message: "ERROR! parameter vent id is missing"});
    } else if (!request.body.express) {
      response.status(400).json({status: 400, message: "ERROR! parameter Express value is missing"});
    } else {
      Emotions.doRemoveEmotion(request.body, function (error, userData) {
        if (error) {
          response.status(error.status).json({error: error});
        } else {
          response.json(userData);
        }
      });
    }
  }

};
