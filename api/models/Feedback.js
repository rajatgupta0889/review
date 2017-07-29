/**
 * Feedback.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    feedback: {
      type: 'string'
    }
  },
  add: function (feedback, cb) {
    Feedback.create(feedback, function (error, createdFeedback) {
      if (error) {
        cb(error, null);
      } else {
        // Emotions.notifyUser(updateData, ventData);
        sails.log.debug('create', createdFeedback);
        cb(null, createdFeedback);
      }
    });
  }
};

