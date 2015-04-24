import UrlInfo from 'teamplaybook-ember/lib/url-info';

export default {
  name: 'inject-url-info',
  initialize: function (container, application) {
    container.register('url-info:main', UrlInfo);
    application.inject('adapter', 'urlInfo', 'url-info:main');
    application.inject('route', 'urlInfo', 'url-info:main');
    application.inject('controller', 'urlInfo', 'url-info:main');
  },
};