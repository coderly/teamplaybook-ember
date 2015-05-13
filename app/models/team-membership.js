import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  role: DS.attr('string'),
  team: DS.belongsTo('team', { async: true }),
  user: DS.belongsTo('user', { async: true }),
});
