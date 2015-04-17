export default {
  name: 'subdomain-adapter',
  after: 'subdomain',
  initialize: function (container, application) {
    application.inject('adapter', 'urlChecker', 'url-checker:main');
  }
};
