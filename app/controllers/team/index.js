import Ember from 'ember';

export default Ember.Controller.extend({
  rootPageNodes: Ember.computed('model.@each', function() {
    return this.get('model').filterProperty('root', true);
  })
});