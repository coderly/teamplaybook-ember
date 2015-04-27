import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  subdomain: DS.attr('string'),
  owner: DS.belongsTo('user', { async: true })
});
