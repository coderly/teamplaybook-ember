import Ember from 'ember';
import ajax from 'ic-ajax';

var url = function () {
  return 'placeholder';
};

export default Ember.create({
  login: function (credentials) {
    return ajax({
      type: 'POST',
      url: url(),
      data: {
        credentials: credentials
      }
    });
  }
});