/**
 * FeedbackController
 *
 * @description :: Server-side logic for managing feedbacks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  add: function (req, res) {
    Feedback.add(req.body, function (err, resp) {
      if (err)
        res.negotiate(err);
      else
        res.json(resp);
    });
  }
};

