/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'teamplaybook-ember',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    /*jshint quotmark: false*/
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self'",
      'font-src': "'self'",
      'connect-src': "'self'",
      'img-src': "'self'",
      'style-src': "'self' 'unsafe-inline'",
      'media-src': "'self'"
    },
    /*jshint quotmark: true*/
    subdomainMapping: {
      '': 'default',
      'www': 'default'
    },
    'simple-auth': {
      routeAfterAuthentication: '/',
      authorizer: 'authorizer:custom',
      crossOriginWhitelist: ['*']
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.contentSecurityPolicy['script-src'] += ' http://*.localhost:35729';
    ENV.contentSecurityPolicy['connect-src'] += ' ws://*.localhost:35729';
    ENV.contentSecurityPolicy['connect-src'] += ' http://*.localhost:3000';

    ENV.contentSecurityPolicy['script-src'] += ' http://*.teamplaybook.dev:35729';
    ENV.contentSecurityPolicy['connect-src'] += ' ws://*.teamplaybook.dev:35729';
    ENV.contentSecurityPolicy['connect-src'] += ' http://*.teamplaybook.dev:3000';

    ENV.API_REGULAR_URL = 'http://teamplaybook.dev:3000';
    ENV.API_TEAM_URL = 'http://subdomain.teamplaybook.dev:3000';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.API_REGULAR_URL = '';
    ENV.API_TEAM_URL = '';

    ENV['simple-auth'].store = 'simple-auth-session-store:ephemeral';
  }

  if (environment === 'production') {

  }

  return ENV;
};
