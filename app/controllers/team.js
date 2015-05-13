import Ember from 'ember';

export default Ember.Controller.extend({
  currentUsersRoleInTeam: Ember.computed.alias('session.secure.role'),
  currentUserIsTeamOwner: Ember.computed.equal('currentUsersRoleInTeam', 'owner'),
});