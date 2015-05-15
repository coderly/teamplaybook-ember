import Ember from 'ember';

export default Ember.Component.extend({
  model: null,
  hasChildren: Ember.computed.notEmpty('model.children')
});
