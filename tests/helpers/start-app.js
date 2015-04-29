import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import UrlInfo from 'teamplaybook-ember/lib/url-info';

function setUrlInfoMockSubdomain(subdomain) {
  UrlInfo.reopen({
    subdomain: subdomain,
    apiUrl: ''
  });
}

function resetUrlInfo() {
  UrlInfo.reopen({
    subdomain: function(){
      return this._computeSubdomain();
    }.property('hostname'),
    apiUrl: function() {
      return this._buildApiURL();
    }.property('apiProtocol', 'subdomain', 'hostname', 'apiPort'),
  });
}

export default function startApp(attrs) {
  var application;

  var attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  var runningWithCustomSubdomain = Ember.isPresent(attrs) && Ember.isPresent(attrs.subdomain);

  if (runningWithCustomSubdomain) {
    setUrlInfoMockSubdomain(attrs.subdomain);
  }

  Ember.run(function() {
    application = Application.create(attributes);

    if (runningWithCustomSubdomain) {
      var reset = application.reset;
      application.reset = function() {
        resetUrlInfo();
        reset.call(application);
      };
    }

    application.setupForTesting();
    application.injectTestHelpers();

  });

  window.localStorage.clear();

  return application;
}
