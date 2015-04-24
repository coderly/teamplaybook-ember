import Ember from 'ember';

function extractBaseUrlFromHostname(hostname) {
  var lastTwoPiecesOfHostnameRegex = new RegExp('[a-z-0-9]{2,63}.[a-z.]{2,5}$');
  return lastTwoPiecesOfHostnameRegex.exec(hostname);
}

function extractSubdomainFromHostname(hostname) {

  var subdomain = '';
  var baseUrl = extractBaseUrlFromHostname(hostname);

  if(Ember.isPresent(baseUrl)) {
    var subdomainWithTrailingDot = hostname.replace(baseUrl,'');
    subdomain = subdomainWithTrailingDot.slice(0, -1);
  }

  return subdomain;
}

export {
  extractBaseUrlFromHostname,
  extractSubdomainFromHostname
};
