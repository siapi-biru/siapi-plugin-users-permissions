'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');

module.exports = siapi => {
  return {
    beforeInitialize() {
      siapi.config.middleware.load.before.unshift('users-permissions');
    },

    initialize() {
      _.forEach(siapi.admin.config.routes, value => {
        if (_.get(value.config, 'policies')) {
          value.config.policies.unshift('plugins::users-permissions.permissions');
        }
      });

      _.forEach(siapi.config.routes, value => {
        if (_.get(value.config, 'policies')) {
          value.config.policies.unshift('plugins::users-permissions.permissions');
        }
      });

      if (siapi.plugins) {
        _.forEach(siapi.plugins, plugin => {
          _.forEach(plugin.config.routes, value => {
            if (_.get(value.config, 'policies')) {
              value.config.policies.unshift('plugins::users-permissions.permissions');
            }
          });
        });
      }
    },
  };
};
