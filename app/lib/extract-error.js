import Ember from 'ember';

var extractErrorMessage = function (response) {
  if (Ember.isPresent(response.errorThrown)) {
    return response.errorThrown;
  } else {
    return 'Uknown error.';
  }
};

export default extractErrorMessage;