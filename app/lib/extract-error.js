import Ember from 'ember';

var extractErrorMessage = function (response) {
  if (Ember.isPresent(response.errorThrown)) {
    return response.errorThrown;
  } else if (Ember.isPresent(response.message)) {
    return response.message;
  } else {
    return 'Uknown error.';
  }
};

export default extractErrorMessage;