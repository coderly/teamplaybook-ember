import Ember from 'ember';

export default Ember.Controller.extend({
  rootPageNodes: Ember.computed.filterBy('model', 'rootNode', true)
});
