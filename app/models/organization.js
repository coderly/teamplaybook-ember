import DS from 'ember-data';

let Organization = DS.Model.extend({
  name: DS.attr('string'),
  subdomain: DS.attr('string'),
  members: DS.hasMany('user')
});

Organization.reopenClass({
  FIXTURES: [
    { id: 1, name: 'First test organization', subdomain: 'test1', members: [1, 2] },
    { id: 2, name: 'Second test organization', subdomain: 'test2', members: [2, 3] }
  ]
});

export default Organization;
