/**
 * NotificationController
 *
 * @description :: Server-side logic for managing Notifications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */



var registrationTokens = [
  "e4wV8m5Zo38:APA91bE5WLRKhCo88dI1eHcroTEn-h6s0gZrMYYHLlSEcotX1nYceJbeUGoEvW1gLY2HHB7EiP8O-jQCqlNa0dKjbuoe8jlRiLrHfzM34HE0sMH_AdjEEqtV1etQMHS-MotTPyB5xnMj",
  "e4wV8m5Zo38:APA91bE5WLRKhCo88dI1eHcroTEn-h6s0gZrMYYHLlSEcotX1nYceJbeUGoEvW1gLY2HHB7EiP8O-jQCqlNa0dKjbuoe8jlRiLrHfzM34HE0sMH_AdjEEqtV1etQMHS-MotTPyB5xnMj"
];
var payload = {
  data: {
    score: "850",
    time: "2:45"
  }
};

module.exports = {

  sendNotificationToUser: function (request, response) {
    admin.messaging().sendToDevice(registrationTokens, payload)
      .then(function (response) {
        console.log("Successfully sent message:", response);
      })
      .catch(function (error) {
        console.log("Error sending message:", error);
      });
  },

  getNotification: function (request, response) {
    var userId = request.user_details.id;
    Vent.getNotification(request.query, userId, function (error, userList) {
      if (error) {
        response.negotiate(error);
      } else {
        response.json(userList);
      }
    });
  },

  getAllNotifications: function (request, response) {
    var userId = request.user_details.id;
    Notification.getAllNotification(request.query,userId, function (error, notifications) {
      if (error) {
        response.negotiate(error);
      } else {
        sails.log.debug("Return vent list", notifications);
        response.json(notifications);
      }
    });
  }
};

