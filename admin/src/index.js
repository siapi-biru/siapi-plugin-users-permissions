// NOTE TO PLUGINS DEVELOPERS:
// If you modify this file by adding new options to the plugin entry point
// Here's the file: siapi/docs/3.0.0-beta.x/plugin-development/frontend-field-api.md
// Here's the file: siapi/docs/3.0.0-beta.x/guides/registering-a-field-in-admin.md
// Also the siapi-generate-plugins/files/admin/src/index.js needs to be updated
// IF THE DOC IS NOT UPDATED THE PULL REQUEST WILL NOT BE MERGED
import React from 'react';
import { CheckPagePermissions } from 'siapi-helper-plugin';
import pluginPkg from '../../package.json';
import pluginLogo from './assets/images/logo.svg';
import pluginPermissions from './permissions';
import layout from '../../config/layout';
import pluginId from './pluginId';
import trads from './translations';
import RolesPage from './containers/Roles';
import ProvidersPage from './containers/Providers';
import EmailTemplatesPage from './containers/EmailTemplates';
import AdvancedSettingsPage from './containers/AdvancedSettings';
import getTrad from './utils/getTrad';

export default siapi => {
  const pluginDescription = pluginPkg.siapi.description || pluginPkg.description;
  const icon = pluginPkg.siapi.icon;
  const name = pluginPkg.siapi.name;

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon,
    id: pluginId,
    initializer: null,
    isReady: true,
    injectedComponents: [],
    isRequired: pluginPkg.siapi.required || false,
    layout,
    mainComponent: null,
    name,
    pluginLogo,
    preventComponentRendering: false,
    trads,
    settings: {
      menuSection: {
        id: pluginId,
        title: getTrad('Settings.section-label'),
        links: [
          {
            title: {
              id: getTrad('HeaderNav.link.roles'),
              defaultMessage: 'Roles',
            },
            name: 'roles',
            to: `${siapi.settingsBaseURL}/${pluginId}/roles`,
            Component: () => (
              <CheckPagePermissions permissions={pluginPermissions.accessRoles}>
                <RolesPage />
              </CheckPagePermissions>
            ),
            permissions: pluginPermissions.accessRoles,
          },
          {
            title: {
              id: getTrad('HeaderNav.link.providers'),
              defaultMessage: 'Providers',
            },
            name: 'providers',
            to: `${siapi.settingsBaseURL}/${pluginId}/providers`,
            Component: () => (
              <CheckPagePermissions permissions={pluginPermissions.readProviders}>
                <ProvidersPage />
              </CheckPagePermissions>
            ),
            permissions: pluginPermissions.readProviders,
          },
          {
            title: {
              id: getTrad('HeaderNav.link.email-templates'),
              defaultMessage: 'Email templates',
            },
            name: 'email-templates',
            to: `${siapi.settingsBaseURL}/${pluginId}/email-templates`,
            Component: () => (
              <CheckPagePermissions permissions={pluginPermissions.readEmailTemplates}>
                <EmailTemplatesPage />
              </CheckPagePermissions>
            ),
            permissions: pluginPermissions.readEmailTemplates,
          },
          {
            title: {
              id: getTrad('HeaderNav.link.advanced-settings'),
              defaultMessage: 'Advanced Settings',
            },
            name: 'advanced-settings',
            to: `${siapi.settingsBaseURL}/${pluginId}/advanced-settings`,
            Component: () => (
              <CheckPagePermissions permissions={pluginPermissions.readAdvancedSettings}>
                <AdvancedSettingsPage />
              </CheckPagePermissions>
            ),
            permissions: pluginPermissions.readAdvancedSettings,
          },
        ],
      },
    },
  };

  return siapi.registerPlugin(plugin);
};
