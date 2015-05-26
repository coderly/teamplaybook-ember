import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['page-node'],
  model: null,
  hasChildren: Ember.computed.notEmpty('model.children'),
  actions: {
    addChild: function(){
      this.sendAction('createChild', this.get('model'));
    },
    remove: function(){
      var component = this;
      var page = this.get('model');
      page.deleteRecord();
      page.save().then(function(){
        component.destroy();
      });
    }
  }
});
