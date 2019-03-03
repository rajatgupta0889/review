var Request = require("request");


var baseUrl = "https://developers.zomato.com/api/v2.1/"
var apiKey = "d62942927e6733d1b56b0b8f20d4be87"

module.exports = {
  postRequest: function (request, url, cb) {
    Request.post({
      "headers": {"content-type": "application/json", "user-key": apiKey},
      "url": baseUrl + url,
      "body": JSON.stringify(request)
    }, (error, response, body) => {
      if (error) {
        cb(error)
      } else {
        cb(null, JSON.parse(body))
      }
    });
  },


  getRequest: function (url, id, cb) {
    console.log(baseUrl + url + id);
    Request.get({
      "headers": {"content-type": "application/json", "user-key": apiKey},
      "url": baseUrl + url + id,
    }, (error, response, body) => {
      if (error) {
        cb(error)
      } else {
        console.log(JSON.parse(body))
        cb(null, JSON.parse(body))
      }
    });
  }
}
