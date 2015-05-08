
import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
moduleForComponent('team-options-menu');

test('The dropdown menu', function(assert) {
  assert.expect(5);

  var component = this.subject();
  assert.equal(this.$().find('.menu').length, 0, 'Is hidden by default');

  Ember.run(function() {
    component.set('isMenuVisible', true);
  });

  assert.equal(this.$().find('.menu').length, 1, 'Is rendered if "isMenuVisible" is set to true');

  Ember.run(function() {
    component.set('isMenuVisible', false);
  });

  assert.equal(this.$().find('.menu').length, 0, 'Is not rendered if "isMenuVisible" is set to false');

  Ember.run(function() {
    component.showMenu();
  });
  assert.equal(this.$().find('.menu').length, 1, 'Is made visible by calling "showMenu"');

  Ember.run(function() {
    component.hideMenu();
  });
  assert.equal(this.$().find('.menu').length, 0, 'Is made hidden by calling "hideMenu"');
});

test('An anonymous user', function(assert) {
  assert.expect(2);

  var component = this.subject();

  Ember.run(function() {
    component.set('isMenuVisible', true);
    component.set('currentUser', null);
  });

  assert.equal(component.get('isCurrentUserAllowedToLeaveTeam'), false, 'Cannot leave the team, since they are not a member');
  assert.equal(this.$().find('.leave-team').length, 0, 'Does not see the button for leaving the team');
});

test('A team member', function(assert) {
  assert.expect(2);

  var component = this.subject();

  Ember.run(function() {
    component.set('isMenuVisible', true);
    component.set('currentUser', Ember.Object.create({ role: 'member' }));
  });

  assert.equal(component.get('isCurrentUserAllowedToLeaveTeam'), true, 'Can leave the team');
  assert.equal(this.$().find('.leave-team').length, 1, 'Sees the button for leaving the team');
});

test('A team admin', function(assert) {
  assert.expect(2);

  var component = this.subject();

  Ember.run(function() {
    component.set('isMenuVisible', true);
    component.set('currentUser', Ember.Object.create({ role: 'admin' }));
  });

  assert.equal(component.get('isCurrentUserAllowedToLeaveTeam'), true, 'Can leave the team');
  assert.equal(this.$('.leave-team').length, 1, 'Sees the button for leaving the team');
});

test('A team owner', function(assert) {
  assert.expect(2);

  var component = this.subject();

  Ember.run(function() {
    component.set('isMenuVisible', true);
    component.set('currentUser', Ember.Object.create({ role: 'owner' }));
  });

  assert.equal(component.get('isCurrentUserAllowedToLeaveTeam'), false, 'Cannot leave the team');
  assert.equal(this.$().find('.leave-team').length, 0, 'Does not see the button for leaving the team');
});

test('"Leave team" action', function(assert) {
  assert.expect(4);

  var component = this.subject();

  var targetObject = {
    testLogoutAction: function() {
      assert.ok('Sends logout action to target');
    }
  };

  var fakeUser = {
    get: function(property) {
      assert.equal(property, 'currentTeamMembership', 'Attempts to fetch current user\'s team membership');
      return {
        id: 0,
        deleteRecord: Ember.K,
        save: function() {
          assert.ok(true, 'Attempts to delete the team membership');
          return new Ember.RSVP.Promise(function(resolve) {
            resolve();
          });
        }
      };
    }
  };

  var fakeStore = {
    find: function(type) {
      assert.equal(type, 'current-user', 'Attempts to fetch current user');
      return new Ember.RSVP.Promise(function(resolve) {
        resolve(fakeUser);
      });
    }
  };

  component.set('logout', 'testLogoutAction');
  component.set('targetObject', targetObject);
  Ember.run(function() {
    component.set('store', fakeStore);
    component.set('isMenuVisible', true);
    component.set('currentUser', Ember.Object.create({ role: 'member' }));
  });

  this.$().find('.leave-team').click();
});
