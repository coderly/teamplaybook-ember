import Ember from 'ember';

export default Ember.Controller.extend({
  rootPageNodes: Ember.computed.filterBy('model', 'rootNode', true),
  actions: {
    createRootPage: function(){
      this.createPage();
    },

    createChildPage: function(parent){
      console.log('here');
      this.createPage(parent);
    },

    onPageCreated: function(page){
      this.get('model').pushObject(page);
    } 
  },

  createPage: function(parent){
    var controller = this;
    var params = this.paramsForPage(parent);
  
    var page = this.store.createRecord('page', params);

    page.on('didCommit', function(page){
      controller.send('onPageCreated', page);
    });

    this.send('openModal', 'new-page-modal', page);
  },

  paramsForPage: function(parent){
    if(parent){
      return {parentId: parent.get('id')};
    }else{
      return {};
    }
  }
});
