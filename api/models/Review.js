/**
 * Review.js
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
    userId:{
      model:'user'
    },
    description: {
      type: 'string'
    },
    rating:{
      type:'number'
    },
    restaurantId:{
      model:'restaurant'
    }
  },

  addReview: function (review,cb) {

    var restaurantId = review.restaurantId;
    if(Restaurant.doGetRestaurant(restaurantId,function (err,foundRestaurant) {

      if(err || !foundRestaurant){
        var restaurant  = {};
        sails.log.debug("Inside found restaurant", restaurantId);
        restaurant.restaurantId = restaurantId;
        restaurant.name = review.name;
        Restaurant.doAddRestaurant(restaurant,function (err,newRestaurant) {
          sails.log.debug("Inside found restaurant", restaurantId);

          if(!err){
            review.restaurantId = newRestaurant.id;
            Review.createReview(review,function (err, review) {
              if(!err){
                cb(null,review);
              }else{
                cb(err)
              }
            });
          }else{
            cb(err);
          }
        });
      }else{
        review.restaurantId = foundRestaurant.id;
        Review.createReview(review,function (err, review) {
          if(!err){
            cb(null,review);
          }else{
            cb(err)
          }

        });
      }
    }));

  },

  createReview: function (review,cb) {
    Review.create(review,function (err, createdReview) {
      if(!err){
        cb(null,createdReview);
      }else{
        cb(err);
      }

    });
  }

};

