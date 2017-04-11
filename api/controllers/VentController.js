/**
 * VentController
 *
 * @description :: Server-side logic for managing Vents
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  uploadVent: function (request, response) {
    if (!request.body) {
      response.status(400).json({status: 400, message: "ERROR! payload missing"});
    } else {
      Vent.doUpload(request.body, function (error, userData) {
        if (error) {
          response.status(error.status).json({error: error});
        } else {
          userData.ventId = userData.id;
          delete userData.id;
          response.json(userData);
        }
      });
    }
  },

  getMyVentCount: function (request, response) {
    if (!request.query.userId) {
      response.status(400).json({status: 400, message: "ERROR! userId is missing"});
    } else {
      Vent.getMyTotalVentCount(request.query, function (error, ventCount) {
        if (error) {
          response.status(error.status).json({error: error});
        } else {
          response.json(ventCount);
        }
      });
    }
  },

  getMyVents: function (request, response) {
    if (!request.query.userId) {
      response.status(400).json({status: 400, message: "ERROR! userId is missing"});
    } else {
      Vent.getMyVentList(request.query, function (error, userList) {
        if (error) {
          response.status(error.status).json({error: error});
        } else {
          response.json(userList);
        }
      });
    }
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
    if (!request.body) {
      response.status(400).json({status: 400, message: "ERROR! payload missing"});
    } else if (!request.body.userId) {
      response.status(400).json({status: 400, message: "ERROR! parameter User Id is missing"});
    } else if (!request.body.ventId) {
      response.status(400).json({status: 400, message: "ERROR! parameter vent Id is missing"});
    } else {
      Vent.doDeleteVent(request.body, function (error, userData) {
        if (error) {
          response.status(error.status).json({error: error});
        } else {
          response.json({
            message: "Vent Deleted Successfully"
          });
        }
      });
    }
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

