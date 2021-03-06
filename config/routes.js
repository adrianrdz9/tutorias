/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': 'Tutorship.index',

  //
  // ──────────────────────────────────────────────── I ──────────
  //   :::::: A U T H : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────
  //

  'GET /users/sign_up': 'Auth.signupForm',
  'POST /users/sign_up':'Auth.signup',
  
  'GET /users/login': 'Auth.loginForm',
  'POST /users/login': 'Auth.login',

  'DELETE /users': 'Auth.logout',

  'GET /users/update': 'Auth.updateForm',
  'POST /users/update': 'Auth.update',
  
  //
  // ──────────────────────────────────────────────────────── I ──────────
  //   :::::: S U B J E C T S : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────
  //

  'GET /subjects':'Subject.index',

  'GET /subjects/new':'Subject.create',
  'POST /subjects':'Subject.store',

  'GET /subjects/:id': 'Subject.show',

  //
  // ──────────────────────────────────────────────────────────── I ──────────
  //   :::::: T U T O R S H I P S : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────
  //

  'GET /tutorships': 'Tutorship.index',

  'GET /tutorships/new': 'Tutorship.create',
  'POST /tutorships': 'Tutorship.store',

  'GET /tutorships/manage': 'Tutorship.manage',
  'POST /tutorships/request/:id': 'Tutorship.respondRequest',

  'GET /tutorships/:id': 'Tutorship.show',

  'POST /tutorships/:id/request': 'Tutorship.request',

  //
  // ────────────────────────────────────────────────────────────────── I ──────────
  //   :::::: N O T I F I C A T I O N S : :  :   :    :     :        :          :
  // ────────────────────────────────────────────────────────────────────────────
  //

  'GET /notifications': 'Notification.index',



  //
  // ──────────────────────────────────────────────────────── I ──────────
  //   :::::: C A L E N D A R : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────
  //

  'GET /users/calendar': 'Auth.calendar',
  'GET /events': 'Auth.events'

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝



  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
