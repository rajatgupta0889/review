/**
 * RestaurantController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  

  getRestaurantReviews: function (req,res) {

    Restaurant.getRestaurantReviews(req.param('id'),function (err,data) {
      if(!err){
        res.json(data);
      }else{
        res.negotiated(err);
      }

    });

  }
};

