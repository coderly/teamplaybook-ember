import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['page-node'],
  model: null,
  hasChildren: Ember.computed.notEmpty('model.children'),
  actions: {
    addChild: function(){
      console.log('onAddchild');
      console.log(this.get('model'));
      this.sendAction('createChild', this.get('model'));
    }
  }
});
