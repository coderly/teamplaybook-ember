import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  teams: DS.hasMany('teams', { async: true, inverse: 'members' }),
  teamMemberships: DS.hasMany('team-membership', { async: true })
});
