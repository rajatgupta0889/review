/**
 * Restaurant.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  reviews:{
    collection: 'review',
    via: 'restaurantId'
  },
  name:{
    type:'string'
  },
  restaurantId: {
    type:'string',
    required: true,
    unique: true
  }
  },

  doAddRestaurant:function (req,cb) {
    sails.log.debug('add Restarant')

    Restaurant.create(req, function (err, restaurant) {

      if (!err) {
        console.log("Restaurant Created ", restaurant);
        cb(null,restaurant);
      }
      else
        cb(err);
    });
  },
  doGetRestaurant: function (id,cb) {
    Restaurant.findOne({"restaurantId" : id}, function (err, restaurant) {
      if (!err) {
        console.log("Restaurant Found ", restaurant);
        cb(null,restaurant);
      } else {
        console.log("Restaurant Found ", err);
        cb(err);
      }
    });
  },
  getRestaurantReviews:  function (id,cb) {
    Restaurant.findOne({"restaurantId" : id}).populateAll().exec(function (err, restaurant) {
      if (!err) {
        console.log("getRestaurantReviews detaails ", restaurant);
        cb(null,restaurant);
      }
      else {
        cb(err);
      }
    });

  }


};

