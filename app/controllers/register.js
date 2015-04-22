import Ember from 'ember';
import teamPlaybookAuth from 'teamplaybook-ember/lib/teamplaybook-auth';
import extractError from 'teamplaybook-ember/lib/extract-error';

export default Ember.Controller.extend({
  email: null,
  password: null,
  passwordConfirmation: null,

  showError: false,
  errorMessage: null,

  passwordsMatch : function () {
    return this.get('password') === this.get('passwordConfirmation');
  }.property('password', 'passwordConfirmation'),

  canRegister: function () {

    var email = this.get('email'),
        password = this.get('password'),
        passwordsMatch = this.get('passwordsMatch');

    return Ember.isPresent(email) && Ember.isPresent(password) && passwordsMatch;

  }.property('email', 'password', 'passwordsMatch'),

  registrationNotAllowed: Ember.computed.not('canRegister'),

  actions: {
    register: function () {

      var credentials = {
        email: this.get('email'),
        password: this.get('password'),
        passwordConfirmation: this.get('passwordConfirmation')
      };

      var session = this.get('session'),
          controller = this;


      var redirectToBaseRoute = function () {
        controller.transitionToRoute('/');
      };

      var success = function() {
        session.authenticate('authenticator:custom', {
          email: credentials.email,
          password: credentials.password
        }).then(redirectToBaseRoute);
      };

      var failure = function (response) {
        controller.setProperties({
          showError: true,
          errorMessage: extractError(response)
        });
      };

      teamPlaybookAuth.register(credentials).then(success, failure);
    }
  }
});