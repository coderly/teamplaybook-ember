import Ember from 'ember';
import extractError from 'teamplaybook-ember/lib/extract-error';

export default Ember.Controller.extend({

  email: null,
  password: null,
  showError: false,
  errorMessage: null,

  loginAllowed: function() {
    var email = this.get('email');
    var password = this.get('password');

    return Ember.isPresent(email) && Ember.isPresent(password);
  }.property('email', 'password'),

  loginNotAllowed: Ember.computed.not('loginAllowed'),

  actions: {

    login: function() {
      var controller = this,
          credentials = controller.getProperties('email', 'password');

      var onSuccess = function() {
        controller.transitionToRoute('/');
      };

      var onFailure = function(response) {
        controller.setProperties({
          showError: true,
          errorMessage: extractError(response)
        });
      };

      this.get('session').authenticate('authenticator:custom', credentials).then(onSuccess, onFailure);
    }
  }
});
