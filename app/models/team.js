import DS from 'ember-data';

var Team = DS.Model.extend({
  name: DS.attr('string'),
  subdomain: DS.attr('string'),
  owner: DS.belongsTo('user', { async: true})
});

export default Team;
