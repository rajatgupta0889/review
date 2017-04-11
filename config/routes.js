/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  // '/': {
  //   view: 'homepage'
  // }

  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   *  If a request to a URL doesn't match any of the custom routes above, it  *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/

  /****************
   * USER APIS *
   ****************/
  // 'POST   /user/add': 'UserController.addUser',
  'POST   /user/updateProfile': 'UserController.updateProfile',
  'GET   /user/getProfile/:id?': 'UserController.getProfile',
  // 'DELETE   /user/delete': 'UserController.deleteUser',
  // 'POST   /user/login': 'UserController.login',
  'GET   /user/logout': 'UserController.logout',
  // 'GET   /user/forgotPassword': 'UserController.forgotPassword',
  // 'POST   /user/changePassword': 'UserController.changePassword',
  'POST   /user/verifyOTP': 'UserController.verifyOTP',
  'POST   /user/signup': 'UserController.signup',

  /****************
   * Vent APIS *
   ****************/
  'POST /vent/api/uploadVent': 'VentController.uploadVent',
  'GET /vent/api/getMyVentCount': 'VentController.getMyVentCount',
  'GET /vent/api/getMyVents': 'VentController.getMyVents',
  'GET /vent/api/getAllVents': 'VentController.getAllVents',
  'DELETE /vent/api/deleteVent': 'VentController.deleteVent',

  'GET  /vent/api/searchVent' : 'VentController.searchVent',

  /****************
   * Emotion APIS *
   ****************/
  'POST /vent/api/addEmotion': 'EmotionsController.addEmotion',
  'DELETE /vent/api/removeEmotion': 'EmotionsController.removeEmotion',

  /****************
   * Notification APIS *
   ****************/
  'GET /vent/api/sendNotificationToUser': 'NotificationController.sendNotificationToUser',
};
