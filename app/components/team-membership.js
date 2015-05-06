import Ember from 'ember';

export default Ember.Component.extend({
  membership: null,
  role: Ember.computed.alias('membership.role'),

  classNames: ['team-membership'],
  classNameBinding: 'role',
});
