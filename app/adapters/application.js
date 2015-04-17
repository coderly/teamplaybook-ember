import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: function () {
    var hostname = this.get('urlChecker.hostname');
    return 'https://' + hostname + ':5000';
  }.property('urlChecker.hostname')
});