/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */
// This policies are necessary to al views
const decorators = ['flashMessages', 'parseCustomLocals', 'getUser'];
module.exports.policies = {
  '*': [...decorators, 'auth'],
  AuthController: {
    '*': [...decorators],
    'calendar': [...decorators, 'auth'],
    'events': [...decorators, 'auth'],
    'update': [...decorators, 'auth'],
    'updateForm': [...decorators, 'auth'],
  }, 
  TutorshipController: {
    'index': [...decorators],
  },

  SubjectController: {
    'index': [...decorators],
    'show': [...decorators]
  }
};
