/**
 * Questions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    question: {
      type: 'string'
    }
  },

  createQuestion: function (data, cb) {
    Question.find().exec(function (error, foundQuestion) {
      if (!err && foundQuestion) {
        foundQuestion[0].question = data.question;
        Question.update({"id": foundQuestion.id}, foundQuestion, function (err, updatedQuestion) {
          if (updatedQuestion) {
            console.log("Question update ", updatedQuestion[0]);
            cb(null, updatedQuestion[0])
          }
        });
      } else {
        Question.create(data, function (err, question) {
          if (!err) {
            console.log("Question created ", question);
            cb(null, question)
          }
          else
            cb(err);
        });
      }
    });
  },
  getQuestion: function (cb) {
    Question.find().exec(function (error, foundQuestions) {
      if (!err && foundQuestions) {
        cb(null,foundQuestions[0])
      }else{
        cb(error);
      }

    });

  }


};

