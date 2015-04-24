import DS from 'ember-data';

var User = DS.Model.extend({
  username: DS.attr('string'),
  teams: DS.hasMany('teams', { async: true }),
  teamMemberships: DS.hasMany('team-membership', { async: true })
});

export default User;
