import Ember from 'ember';
import extractError from 'teamplaybook-ember/lib/extract-error';

export default Ember.Controller.extend({
  showError: false,
  errorMessage: null,

  actions: {
    close: function() {
      console.log('on close');
      this.send('closeModal');
    },
    save: function(){
      var controller = this;
      var page = this.get('model');

      var onSaveSucess = function(){
        controller.send('closeModal');
      };

      var onSaveFailure = function(response){
        controller.setProperties({
          showMessage: false,
          showError: true,
          errorMessage: extractError(response)
        });
      };

      page.save().then(onSaveSucess, onSaveFailure);
    }
  }
});