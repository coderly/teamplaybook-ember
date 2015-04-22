import DS from 'ember-data';

var User = DS.Model.extend({
  username: DS.attr('string'),
  organizations: DS.hasMany('organization')
});

User.reopenClass({
  FIXTURES: [
    { id: 1, username: 'johndoe', organizations: [1] },
    { id: 2, username: 'janedoe', organizations: [1, 2] },
    { id: 3, username: 'johnsmith', organizations: [2] }
  ]
});

export default User;
