/**
 * Created by praful on 06/03/17.
 */
var user = require("firebase-admin");



var serviceAccount = require("/Users/rajat/Documents/NodeProjects/personal/VentOut-Backend/vent-userjson.json");

user.initializeApp({
  credential: user.credential.cert(serviceAccount),
  databaseURL: "https://ventout-b1390.firebaseio.com"
},"user");

// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: " ventout-b1390",
//     clientEmail: "firebase-adminsdk-j5jia@gcm-app-160507.iam.gserviceaccount.com",
//     privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDKm6CB+FZHovT0\nRMOA/j2z7E0/p/BWyPdUJC5kjQWDSh5VsjvybaVf8UULWimsgWgtHnTAxLT82IeK\n6S4yPQwCic2O9FXamByNhLFmqXAzCPyWoE0oOAWZFUiSUeVIuAz35z9xSn03Bp30\n6Xo1kLcykfdwc6pnlkwsFs3JjjcAzfcCRSkihmMgYeM0N4KKHRTDQbyBjSMfq35m\nFZTfeBljI+TP20uWeS8nW4DSRzShsECZzZXXKkhXnh7UsSG/mpUXY33dti1U15cT\nx3i+60Easbco0nV4cmFL1NY5Fxaftw5pB44cb6UNm0BjnM2Bnmev1XIzaCkbJD5Q\nqAWhRXGvAgMBAAECggEABcpW1wAS7y8wEv8YG0qo1siNGKGjE8fgka4LCWKiYrMu\nlMJoRjBuBoTttTpZcI2uPYPeUFgO2B8UGJs7b8Ig4r2ve0NuZLXuMvk03LtA8qRy\nG5fvPJQFTO+3yD7A78gazsb0IDfBxl3RC9vUW02Mfsx/Jt6XYyh/es8YCIeg+Mvd\nGzrO0XXUlSPkTJiKzlbZfc4gaIZSRDRhcXp3Og5s5wkrAouJ7878bBvsx3/zfPTl\nz6aB8sghX0u1Z1rnAKYmQaM7+7wH/nWvvVYp8n1xTikXK4Amcx8fX99T+CyaRC3A\nIs/dYP4Tc28W3ONMh45C29yn+VvYDHzBomXAg7a2OQKBgQDoB5+VBVnLbyq0mpw7\nmlcwB3FCMAelTCFxD+nZbomHZ6ntoo9P6/If37DSnIqpClOZ9MWHdPB4uKtGLLb1\n2oxmNqXt3IVyPI2B9AVn7VKxGilmbkkfbPa3CwbLOdMCt/KAayZh17IoTCjKbteQ\nj7DIysJmsm3oNQSwXFRdgTTtywKBgQDfieXyqMWH12u+Ud8m1U3pkIoPEq+eAr3m\nz/bgruUlH2nUxeRzfHouKAvf5y7PiIw/PYWVHBlCpX+Hu8D9nzEMmbyoVnnkKw7f\niu19qaHieU1/h1/t27QusicK7bFcYAsJvwHQKpKCbS3OqfwgQyTrSBir045+ofJv\nCzxu7gJPLQKBgQDIpp8IHaJzXGUP3Ywxttyi+iylUieqeFWLEnnlv8NKxwiaKbPJ\nJ38wtR6SYzE90WJOhu+ynhu+KeRjQRPPM/mqAqQnOEZmbZrpwH5US1TxNnCK1eCC\nPpZz4CM154FknnIlP4PnpMG6O3Ii7QuZRclZOo42hSKqZf7yDEYgvjVpVQKBgF6O\nbFBrB7Ngclj9NNGuZNippVye4N6L9lxOF/YOxSsg0JmKZApd2yjvE6bQmcJ71idi\nFMFwM1c3vmxiBU7DKfJUjbL/cWwMsqvojnEbcjjkat3JG9D3oI4oGc/Ln7yde83R\nmCi/+V1mZXwH93iGLnW/93+na50xT+Wc8SFTWHK5AoGASjVeJ/q0AMy10FZEojgO\nV72UylpbsJIAe20zgO5/+hennfudO4fz/KYwTg7dhdPC4BAeM5fs6msTzk9ttZgg\nM4YdqgXgASZnX7zAaala/18zj98FhQkgB5MlXzWHbgKtv72keWdE2ajXlxaSZMxL\nF0pczdzkKOnhCK/226DS1kc=\n-----END PRIVATE KEY-----\n"
//   }),
//   databaseURL: "https://gcm-app-160507.firebaseio.com"
// });


// var payload = {
//   notification: {
//     title: "$GOOG up 1.43% on the day",
//     body: "$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day."
//   },
//   data: {
//     stock: "GOOG",
//     open: 829.62,
//     close: "635.67
//   }
// };
//


exports.sendToDevice = function (FCMToken, payload, options, callBack) {

  var option = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

  user.messaging().sendToDevice(FCMToken, payload, option)
    .then(function (response) {
      callBack(null, response);
    })
    .catch(function (error) {
      callBack(error, null);
    });

};



