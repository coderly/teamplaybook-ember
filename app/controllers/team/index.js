import Ember from 'ember';

export default Ember.Controller.extend({
  rootPageNodes: Ember.computed('model.@each', function() {
    return this.get('model').filterProperty('rootNode', true);
  }),
  actions: {
    createRootPage: function(){
      var controller = this;
      var page = this.store.createRecord('page', {});
      page.on('didCommit', function(page){
        controller.onPageCreated(page);
      })
      this.send('openModal', 'new-page-modal', page);
    }
  },

  onPageCreated: function(page){
    this.get('model').pushObject(page);
  }
});