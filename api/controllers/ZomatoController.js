/**
 * ZomatoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  getCategories: function (req, res) {

    HttpServiceHelper.getRequest("establishments", "?city_id=4", function (err, data) {
      if (err) {
        res.negotiate(err);
      } else {
        res.json(data);
      }

    })

  },
  getCollections: function (req, res) {

    HttpServiceHelper.getRequest("collections", "?city_id=4", function (err, data) {
      if (err) {
        res.negotiate(err);
      } else {
        res.json(data);
      }

    })

  },
  getCuisines: function (req, res) {

    HttpServiceHelper.getRequest("cuisines", "?city_id=4", function (err, data) {
      if (err) {
        res.negotiate(err);
      } else {
        res.send(data);
      }

    })

  },

  searchRestaurants: function (req,res) {
    var params = req.body.params;
    var data  = "entity_id=4&entity_type=city"+ (params? params : "");
    HttpServiceHelper.getRequest("search", "?"+data, function (err, data) {
      if (err) {
        res.negotiate(err);
      } else {
        res.json(data);
      }

    })

  },
  getRestaurantDetails: function (req,res) {
    HttpServiceHelper.getRequest("restaurant",  "?res_id=" + req.param('id'), function (err, data) {
      if (err) {
        res.negotiate(err);
      } else {
        res.json(data);
      }

    })

  }

}


