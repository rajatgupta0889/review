/**
 * Vent.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    text: {
      type: 'string'
    },
    location: {
      type: 'json'
    },
    user: {
      model: 'user'
    },
    isAnonymous: {
      type: 'boolean',
      defaultsTo: false
    },
    isSensitive: {
      type: 'boolean',
      defaultsTo: false
    },

    emotion: {
      collection: 'emotions',
      via: 'vent'
    }

  },

  doUpload: function (request, callBack) {
    User.findOne({id: request.user}).exec(function (error, userData) {
      if (error) {
        callBack(error, null);
      } else if (!userData) {
        callBack({
          status: 400,
          message: "No User found"
        }, null);
      } else {
        Vent.create(request, function (error, ventData) {
          if (error) {
            callBack(error, null);
          } else {
            callBack(null, ventData);
          }
        });
      }
    });
  },

  afterCreate: function (demo, cb) {

    var doc = demo;
    sails.log("vent  :", doc);
    SearchService.index(doc, {id: doc.id, type: "vent"}, function (err, indexDoc) {
      if (err) {
        sails.log.error('ES: vent index error', err);
      } else {
        sails.log.debug('ES: vent indexed.', indexDoc);
      }
    });
    cb();

  },

  searchVent: function (request, callBack) {

    var options = {};

    var query = {
      "query": {
        "match": {
          "text": request.ventMsg
        }
      }
    };

    SearchService.search(options, query, true, function (error, searchData) {
      if (!error)
        callBack(null, searchData);
      else {
        callBack(error);
      }
    });

  },

  getMyTotalVentCount: function (request, callBack) {
    User.findOne({id: request.userId}).exec(function (error, userData) {
      if (error) {
        callBack(error, null);
      } else if (!userData) {
        callBack({
          status: 400,
          message: "No User found"
        }, null);
      } else {
        Vent.find({user: request.userId}).exec(function (error, ventData) {
          if (error) {
            callBack(error, null);
          } else {
            callBack(null, {totalVent: ventData.length});
          }
        });
      }
    });
  },

  getMyVentList: function (request, callBack) {
    Vent.find({
      createdAt: {'<': request.createdAt},
      user: request.userId
    }).limit(10).sort('createdAt DESC').populateAll().exec(
      function (error, ventData) {
        if (error) {
          callBack(error, null);
        } else if (!ventData) {
          callBack({
            status: 400,
            message: "No Vent found"
          }, null);
        } else {
          var ventLength = ventData.length;
          for (var i = 0; i < ventLength; i++) {
            Vent.getEmotionCount(ventData[i], function (emotionObject) {
              ventData[i].emotionCounts = emotionObject;
            });
          }
          callBack(null, ventData);
        }
      });
  },

  getEmotionCount: function (ventData, emotionObject) {
    // ventData.user.userId = ventData.user.id;
    // delete ventData.user.id;
    //
    // ventData.ventId = ventData.id;
    // delete ventData.id;

    var Like = 0;
    var HaHa = 0;
    var Sad = 0;
    var Angry = 0;
    var emotionLength = ventData.emotion.length;
    for (var j = 0; j < emotionLength; j++) {
      var item = ventData.emotion[j].emotionValue;
      if (item == 1) {
        ++Like;
      } else if (item == 2) {
        ++HaHa;
      } else if (item == 3) {
        ++Sad;
      } else if (item == 4) {
        ++Angry;
      }
    }
    var emotionCounts = {
      like: Like,
      haha: HaHa,
      sad: Sad,
      angry: Angry
    };
    emotionObject(emotionCounts);
  },

  getAllVentList: function (request, callBack) {
    Vent.find({createdAt: {'<': request.createdAt}}).limit(10).sort('createdAt DESC').populateAll().exec(function (error, ventData) {
      if (error) {
        callBack(error, null);
      } else if (!ventData) {
        callBack({
          status: 400,
          message: "No Vent found"
        }, null);
      } else {
        var ventLength = ventData.length;
        for (var i = 0; i < ventLength; i++) {
          Vent.getEmotionCount(ventData[i], function (emotionObject) {
            ventData[i].emotionCounts = emotionObject;
          });

          if (ventData[i].isAnonymous) {
            delete ventData[i].user;
          }
        }
        callBack(null, ventData);
      }
    });
  },

  doDeleteVent: function (request, callBack) {
    Vent.findOne({user: request.userId, id: request.ventId}).exec(function (error, ventData) {
      if (error) {
        callBack(error, null);
      } else if (!ventData) {
        callBack({
          status: 400,
          message: "No Vent found"
        }, null);
      } else {
        Vent.destroy({user: request.userId, id: request.ventId}).exec(function (error, ventData) {
          if (error) {
            callBack(error, null);
          } else if (!ventData) {
            callBack({
              status: 400,
              message: "No Vent found"
            }, null);
          } else {
            callBack(null, ventData[0]);
          }
        });
      }
    });
  }
};

