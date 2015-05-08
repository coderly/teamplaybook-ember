import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  planName: DS.attr('string'),
  planSlug: DS.attr('string'),
  subdomain: DS.attr('string'),
  owner: DS.belongsTo('user', { async: true }),
  teamMemberships: DS.hasMany('team-membership', { async: true }),
  members: DS.hasMany('user')
});