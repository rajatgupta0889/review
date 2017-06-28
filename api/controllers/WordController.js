/**
 * WordController
 *
 * @description :: Server-side logic for managing words
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  readCsv: function (req, res) {
    var isGood = req.param('good');
    console.log(isGood);
    console.log(typeof(isGood));
    Word.readCsv(req, isGood, function (error, data) {
      if (error)
        res.negotiate(error);
      else {
        res.json(data);
      }
    })
  }
};

