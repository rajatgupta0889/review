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
  doUpload: function (request, userId, callBack) {
    request.user = userId;
    User.findOne({id: userId}).exec(function (error, userData) {
      if (error) {
        callBack(error, null);
      } else if (!userData) {
        callBack({
          status: 400,
          message: "No User found"
        }, null);
      } else {
        Word.getAllBadWords(function (error, badWords) {
          var allWordsInText = request.text.split(" ");
          sails.log.debug('Words in text', allWordsInText);
          var isBadWordPresent = false;
          _.each(allWordsInText, function (word, index) {
            sails.log.debug(badWords,word);
            if (_.contains(badWords, word)) {
              isBadWordPresent = true;
            }
          });
          sails.log.debug('Is bad word present ', isBadWordPresent);
          if (isBadWordPresent) {

            callBack({
              status: 400,
              message: "Bad word present"
            }, null);
          } else {
            Word.getAllGoodWords(function (error, goodWords) {
              if (!error) {
                var allWordsInText = request.text.split(" ");
                _.each(allWordsInText, function (word, index) {
                  if (!_.contains(goodWords, word)) {
                    allWordsInText[index] =  new Array(word.length+1).join('-');
                  }
                });
                var newText = allWordsInText.join(' ');
                request.newText = newText;
                Vent.create(request, function (error, ventData) {
                  if (error) {
                    callBack(error, null);
                  } else {
                    callBack(null, ventData);
                    sails.log.debug("ventData : ", ventData);
                    User.userExistsById(ventData.user, function (error, userData) {
                      sails.log.debug("userData : ", userData);
                      if (userData) {
                        userData.ventCount = userData.ventCount + 1;
                        sails.log.debug("userData : ", userData);
                        User.updateUser(userData, function (error, updateUserData) {
                          sails.log.debug("updateUserData :", updateUserData);
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });

      }
    });
  },

  afterCreate: function (demo, cb) {

    var doc = demo;
    sails.log("vent  :", doc);
    // SearchService.index(doc, {id: doc.id, type: "vent"}, function (err, indexDoc) {
    //   if (err) {
    //     sails.log.error('ES: vent index error', err);
    //   } else {
    //     sails.log.debug('ES: vent indexed.', indexDoc);
    //   }
    // });
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
    //
    // SearchService.search(options, query, true, function (error, searchData) {
    //   if (!error)
    //     callBack(null, searchData);
    //   else {
    //     callBack(error);
    //   }
    // });

  },

  getMyTotalVentCount: function (userId, callBack) {
    User.findOne({id: userId}).exec(function (error, userData) {
      if (error) {
        callBack(error, null);
      } else if (!userData) {
        callBack({
          status: 400,
          message: "No User found"
        }, null);
      } else {
        Vent.find({user: userId}).exec(function (error, ventData) {
          if (error) {
            callBack(error, null);
          } else {
            callBack(null, {totalVent: ventData.length});
          }
        });
      }
    });
  },

  getMyVentList: function (request, userId, callBack) {

    if (!request.createdAt) {
      request.createdAt = new Date();
      sails.log.debug(request);
    }

    Vent.find({
      createdAt: {'<': request.createdAt},
      user: userId
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
          var resultVentData = [];
          for (var i = 0; i < ventLength; i++) {
            Vent.getEmotionCount(ventData[i], userId, function (emotionObject) {
              var newText = ventData[i].text;
              delete ventData[i].text;
              ventData[i].changeText = newText;
              ventData[i].emotionObject = emotionObject;
              // sails.log.debug(ventData[i].emotionObject.myEmotion.emotionValue);
              //   if(ventData[i].emotionObject.myEmotion.emotionValue != 4){
              //     resultVentData.push(ventData[i]);
              //     sails.log.debug('inside if' + ventData[i].emotionObject.myEmotion.emotionValue);
              //   }
            });
            ventData[i].emotion.length = 0;

          }

          callBack(null, ventData);
        }
      });
  },

  getEmotionCount: function (ventData, userId, emotionObject) {
    var Like = 0;
    var HaHa = 0;
    var Sad = 0;
    var Angry = 0;
    var myEmotionValue = 0;
    var myEmotionMessage = "";
    var emotionLength = ventData.emotion.length;
    for (var j = 0; j < emotionLength; j++) {
      var item = ventData.emotion[j].emotionValue;
      if (ventData.emotion[j].userId == userId) {
        myEmotionValue = ventData.emotion[j].emotionValue;
        myEmotionMessage = ventData.emotion[j].emotionMessage;
      }
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
    var emotion = {
      like: Like,
      haha: HaHa,
      sad: Sad,
      angry: Angry,
      myEmotion: {
        "emotionValue": myEmotionValue,
        "emotionMessage": myEmotionMessage
      }
    };
    emotionObject(emotion);
  },

  getAllVentList: function (request, userId, callBack) {

    if (!request.createdAt) {
      request.createdAt = new Date();
      sails.log.debug(request);
    }

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
        var resultVentData = [];
        for (var i = 0; i < ventLength; i++) {
          Vent.getEmotionCount(ventData[i], userId, function (emotionObject) {
            ventData[i].emotionObject = emotionObject;
            // sails.log.debug(ventData[i].emotionObject.myEmotion.emotionValue);
            if (ventData[i].emotionObject.myEmotion.emotionValue != 4) {
              var newText = ventData[i].text;
              delete ventData[i].text;
              ventData[i].changeText = newText;
              resultVentData.push(ventData[i]);
              // sails.log.debug('inside if' + ventData[i].emotionObject.myEmotion.emotionValue);
            }
          });
          ventData[i].emotion.length = 0;

        }

        callBack(null, resultVentData);
      }
    });
  },

  doDeleteVent: function (request, userId, callBack) {
    Vent.findOne({id: request.ventId}).exec(function (error, ventData) {
      if (error) {
        callBack(error, null);
      } else if (!ventData) {
        callBack({
          status: 400,
          message: "No Vent found"
        }, null);
      } else {
        Vent.destroy({id: request.ventId}).exec(function (error, ventData) {
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

