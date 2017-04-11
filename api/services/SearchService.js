/**
 * Created by praful on 10/04/17.
 */
var elasticsearch = require('elasticsearch');
var esearch = new elasticsearch.Client({
  host: "localhost:9200",
  keepAlive: true,
  log: 'error',
  requestTimeout: 6000,
  maxSockets: 100,
  deadTimeout: 6000
});

esearch.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 1000
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

exports.index = function (doc, options, cb) {
  sails.log.debug('indexing doc ', doc, 'with options', options);
  esearch.index({
    index: options && options.index ? options.index : 'vent',
    type: options && options.type ? options.type : 'vent',
    body: doc,
    id: options.id
  }, function (err, resp) {
    if (err) {
      cb(err);
    } else {
      cb(null, resp);
    }
  });
};

exports.search = function (options, query, override, cb) {
  var body = override ? query : {query: query};
  console.log('ES: search query ', body,'with options', options);
  esearch.search({
    index: options && options.index ? options.index : 'vent',
    type: options && options.type ? options.type : 'vent',
    body: body,
    size: options && options.size ? options.size : 10
  }, function (err, resp) {
    if (err) {
      cb(err);
    } else {
      resp = _.pluck(resp.hits.hits, "_source");
      cb(null, resp);
    }
  });
};
