/**
 * VentController
 *
 * @description :: Server-side logic for managing Vents
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  uploadVent: function (request, response) {
    var userId = request.user_details.id;
    Vent.doUpload(request.body, userId, function (error, userData) {
      if (error) {
        response.status(error.status).json({error: error});
      } else {
        userData.ventId = userData.id;
        delete userData.id;
        response.json(userData);
      }
    });
  },

  getMyVentCount: function (request, response) {
    var userId = request.user_details.id;
    Vent.getMyTotalVentCount(userId, function (error, ventCount) {
      if (error) {
        response.status(error.status).json({error: error});
      } else {
        response.json(ventCount);
      }
    });
  },

  getMyVents: function (request, response) {
    var userId = request.user_details.id;
    Vent.getMyVentList(request.query, userId, function (error, userList) {
      if (error) {
        response.status(error.status).json({error: error});
      } else {
        response.json(userList);
      }
    });
  },

  getAllVents: function (request, response) {
    Vent.getAllVentList(request.query, function (error, userList) {
      if (error) {
        response.status(error.status).json({error: error});
      } else {
        response.json(userList);
      }
    });
  },

  deleteVent: function (request, response) {
    var userId = request.user_details.id;
    Vent.doDeleteVent(request.body, userId, function (error, userData) {
      if (error) {
        response.status(error.status).json({error: error});
      } else {
        response.json({
          message: "Vent Deleted Successfully"
        });
      }
    });
  },

  searchVent: function (request, response) {
    if (!request.query) {
      response.status(400).json({status: 400, message: "ERROR! Query is empty"});
    } else {
      Vent.searchVent(request.query, function (error, ventList) {
        if (error) {
          response.status(error.status).json({error: error});
        } else {
          response.json(ventList);
        }
      });
    }
  }
};

