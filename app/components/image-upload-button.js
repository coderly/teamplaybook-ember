import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    browseAndUpload: function() {
      var component = this;
      this.get('eventHandler').then(function(eventHandler) {
        return eventHandler.handleManualUpload();
      }).then(function(response) {
        return component.handeManualUploadDone(response);
      });
    }
  },

  handeManualUploadDone: function(response) {
    this.sendAction('uploadDone', response.url);
  }
});
