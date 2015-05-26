
import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
moduleForComponent('team-options-menu');

test('The dropdown menu is hidden by default', function(assert) {
  assert.expect(1);

  var component = this.subject();
  assert.equal(this.$().find('.menu').length, 0, 'Is hidden by default');
});

test('The dropdown menu visibility is determined by the "isMenuVisible" flag', function(assert) {
  assert.expect(2);

  var component = this.subject();

  Ember.run(function() {
    component.set('isMenuVisible', true);
  });

  assert.equal(this.$().find('.menu').length, 1, 'Is rendered if "isMenuVisible" is set to true');

  Ember.run(function() {
    component.set('isMenuVisible', false);
  });

  assert.equal(this.$().find('.menu').length, 0, 'Is not rendered if "isMenuVisible" is set to false');
});

test('The "isMenuVisible" flag value is controlled by "showMenu" and "hideMenu"', function(assert) {
  assert.expect(2);

  var component = this.subject();

  Ember.run(function() {
    component.showMenu();
  });
  assert.equal(component.get('isMenuVisible'), true, '"showMenu" sets flag to true');

  Ember.run(function() {
    component.hideMenu();
  });
  assert.equal(component.get('isMenuVisible'), false, '"hideMenu" sets flag to false');
});

test('An anonymous user cannot leave the team', function(assert) {
  assert.expect(2);

  var component = this.subject();

  Ember.run(function() {
    component.set('isMenuVisible', true);
    component.set('currentUser', null);
  });

  assert.equal(component.get('isCurrentUserAllowedToLeaveTeam'), false, 'Flag is set to false');
  assert.equal(this.$().find('.leave-team').length, 0, 'Button is not rendered');
});

test('A team member can leave the team', function(assert) {
  assert.expect(2);

  var component = this.subject();

  Ember.run(function() {
    component.set('isMenuVisible', true);
    component.set('currentUser', Ember.Object.create({ role: 'member' }));
  });

  assert.equal(component.get('isCurrentUserAllowedToLeaveTeam'), true, 'Flag is set to true');
  assert.equal(this.$().find('.leave-team').length, 1, 'Button is rendered');
});

test('A team admin can leave the team', function(assert) {
  assert.expect(2);

  var component = this.subject();

  Ember.run(function() {
    component.set('isMenuVisible', true);
    component.set('currentUser', Ember.Object.create({ role: 'admin' }));
  });

  assert.equal(component.get('isCurrentUserAllowedToLeaveTeam'), true, 'Flag is set to true');
  assert.equal(this.$().find('.leave-team').length, 1, 'Button is rendered');
});

test('A team owner cannot leave the team', function(assert) {
  assert.expect(2);

  var component = this.subject();

  Ember.run(function() {
    component.set('isMenuVisible', true);
    component.set('currentUser', Ember.Object.create({ role: 'owner' }));
  });

  assert.equal(component.get('isCurrentUserAllowedToLeaveTeam'), false, 'Flag is set to false');
  assert.equal(this.$().find('.leave-team').length, 0, 'Button is not rendered');
});

test('Clicking the button to leave team sends a delete action to target, followed by logging the user out', function(assert) {
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

test('Navigation link for "manage" route is not available for regular members', function(assert) {
  assert.expect(1);

  var component = this.subject({
    isMenuVisible: true,
    currentUser: Ember.Object.create({ role: 'member' })
  });

  assert.equal(this.$().find('.manage-team').length, 0, 'Navigation link is not present');
});

test('Navigation link for "manage" route is not available for admins', function(assert) {
  assert.expect(1);

  var component = this.subject({
    isMenuVisible: true,
    currentUser: Ember.Object.create({ role: 'member' })
  });

  assert.equal(this.$().find('.manage-team').length, 0, 'Navigation link is not present');
});

test('Navigation link for "manage" route is available for team owners', function(assert) {
  assert.expect(1);

  var component = this.subject({
    isMenuVisible: true,
    currentUser: Ember.Object.create({ role: 'owner' })
  });

  assert.equal(this.$().find('.manage-team').length, 1, 'Navigation link is present');
});

test('Navigation link for "team-members" route is rendered', function(assert) {
  assert.expect(1);

  var component = this.subject({
    isMenuVisible: true
  });

  assert.equal(this.$().find('.team-members').length, 1, 'Navigation link is present');
});

test('Navigation link for "team.pages" route is rendered', function(assert) {
  assert.expect(1);

  var component = this.subject({
    isMenuVisible: true
  });

  assert.equal(this.$().find('.pages').length, 1, 'Navigation link is present');
});

test('Clicking a navigation link hides the dropdown', function(assert) {
  assert.expect(3);

  var component = this.subject({
    isMenuVisible: true,
    hideMenu: function() {
      assert.ok(true, 'assertion needs to be called once for each link');
    },
    currentUser: Ember.Object.create({ role: 'owner' })
  });

  this.$().find('.navigation.pages').click();
  this.$().find('.navigation.manage-team').click();
  this.$().find('.navigation.team-members').click();
});
