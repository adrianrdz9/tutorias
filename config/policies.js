/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */
const decorators = ['flashMessages', 'parseCustomLocals', 'getUser'];
module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  '*': [...decorators, 'auth'],
  AuthController: {
    '*': [...decorators],
    'calendar': [...decorators, 'auth'],
    'events': [...decorators, 'auth'],
    'update': [...decorators, 'auth'],
  }, 
  TutorshipController: {
    'index': [...decorators],
  },

  SubjectController: {
    'index': [...decorators],
    'show': [...decorators]
  }
};
