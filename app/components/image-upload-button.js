import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    browseAndUpload: function() {
      this.sendAction('browseAndUpload');
    }
  },
});
