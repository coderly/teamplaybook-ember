import DS from 'ember-data';

var Organization = DS.Model.extend({
  name: DS.attr('string'),
  subdomain: DS.attr('string'),
  members: DS.hasMany('user', { async: true })
});

Organization.reopenClass({
  FIXTURES: [
    { id: 1, name: 'First test organization', subdomain: 'test1', members: [1, 2] },
    { id: 2, name: 'Second test organization', subdomain: 'test2', members: [2, 3] }
  ]
});

export default Organization;
