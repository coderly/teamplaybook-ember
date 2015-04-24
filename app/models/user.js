import DS from 'ember-data';

var User = DS.Model.extend({
  username: DS.attr('string'),
  teams: DS.hasMany('teams', { async: true })
});

User.reopenClass({
  FIXTURES: [
    { id: 1, username: 'johndoe', teams: [1] },
    { id: 2, username: 'janedoe', teams: [1, 2] },
    { id: 3, username: 'johnsmith', teams: [2] }
  ]
});

export default User;
