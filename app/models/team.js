import DS from 'ember-data';

var Team = DS.Model.extend({
  name: DS.attr('string'),
  subdomain: DS.attr('string'),
  members: DS.hasMany('user', { async: true })
});

Team.reopenClass({
  FIXTURES: [
    { id: 1, name: 'First test team', subdomain: 'test1', members: [1, 2] },
    { id: 2, name: 'Second test team', subdomain: 'test2', members: [2, 3] }
  ]
});

export default Team;
