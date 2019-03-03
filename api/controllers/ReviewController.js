/**
 * ReviewController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  addReview: function (req , res) {
    Review.addReview(req.body,function (err,review) {
      if(!err){
        res.json(review);
      }else{
        res.negotiate(err);
      }

    })

  }


};

