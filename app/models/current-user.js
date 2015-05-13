import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  authenticationToken: DS.attr('string'),
  password: DS.attr('string'),
  passwordConfirmation: DS.attr('string'),
  role: DS.attr('string'),

  currentTeamMembership: DS.belongsTo('team-membership', { async: true })
});
