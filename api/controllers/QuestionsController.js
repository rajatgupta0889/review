/**
 * QuestionsController
 *
 * @description :: Server-side logic for managing questions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  getQuestions: function (req, res) {
    Questions.getQuestion(function (err, question) {
      if (err) {
        res.negotiate(err);
      } else {
        res.json(question);
      }
    });

  },
  uploadQuestions: function (req, res) {
    sails.log.debug(req.body);
    Questions.createQuestion(req.body, function (err, question) {
      if (err) {
        res.negotiate(err);
      } else {
        res.json(question);
      }
    });

  }
};

