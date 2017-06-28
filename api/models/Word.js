/**
 * Word.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var fs = require('fs');
var parse = require('csv-parse');

module.exports = {

  attributes: {

    text: {
      type: 'string'
    },
    isBadWord: {
      type: 'boolean',
      defaultsTo: false
    }
  },

  readCsv: function (req, isGood, cb) {

    // var output = [];
    // var parser = parse({delimiter: ','})
    // var input = fs.createReadStream('/assets/goodword.csv');
    // input.pipe(parser).pipe(transformer).pipe(process.stdout);
    console.log(isGood);
    var inputFile = '';
    if (isGood == 'true') {
      inputFile = '/Users/rajat/Documents/NodeProjects/personal/VentOut-Backend/assets/goodword.csv';
    } else {
      inputFile = '/Users/rajat/Documents/NodeProjects/personal/VentOut-Backend/assets/badword.csv';
    }
    sails.log.debug('Input file', inputFile);

    var output = []
    var parser = parse({delimiter: ','}, function (err, data) {

      // when all countries are available,then process them
      // note: array element at index 0 contains the row of headers that we should skip
      if (!err) {
        data.forEach(function (line) {
          // create country object out of parsed fields
          var data = {
            text: line[0],
            isBadWord: line[1].toLowerCase()
          };
          output.push(data)
        });
      }
      console.log(output);
      Word.addGoodWordBulk(output, cb);
    });

// read the inputFile, feed the contents to the parser
    fs.createReadStream(inputFile).pipe(parser);


  },


  addGoodWord: function (word, cb) {
    Word.findOne({text: word}).exec(function (error, word) {
      if (!error && word) {
        cb(null, word);

      } else {
        Word.create({text: word}, function (err, newWord) {
          if (!err) {
            cb(null, newWord)
          } else {
            cb(err);
          }
        });
      }
    });
  },
  addGoodWordBulk: function (word, cb) {
    Word.create(word, function (err, result) {
      if (!err) {
        cb(null, result)
      } else {
        cb(err);
      }
    });
  },
  addBadWord: function (word, cb) {
    Word.findOne({text: word}).exec(function (error, word) {
      if (!error && word) {
        cb(null, word);

      } else {
        Word.create({text: word, isBadWord: true}, function (err, newWord) {
          if (!err) {
            cb(null, newWord)
          } else {
            cb(err);
          }
        });
      }
    });
  },
  getAllBadWords: function (cb) {
    Word.find({isBadWord: true}).exec(function (error, badWords) {
      if (!error && badWords) {
        var words = []
        _.each(badWords, function (word, index) {
          words.push(word.text);
        });
        cb(null, words);
      } else {
        cb(error)
      }
    });
  },
  getAllGoodWords: function (cb) {
    Word.find({isBadWord: false}).exec(function (error, goodWords) {
      if (!error && goodWords) {
        var words = []
        _.each(goodWords, function (word, index) {
          words.push(word.text);
        });
        cb(null, words);
      } else {
        cb(error)
      }
    });
  }

};

