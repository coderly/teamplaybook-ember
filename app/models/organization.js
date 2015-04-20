import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  subdomain: DS.attr('string'),
  users: DS.hasMany('user')
});
