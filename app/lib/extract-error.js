import Ember from 'ember';

var FALLBACK_ERROR_MESSAGE = 'Unknown error.';

function extractErrorMessage(response) {
  if (Ember.isEmpty(response)) {
    return FALLBACK_ERROR_MESSAGE;
  } else if (Ember.isPresent(response.errorThrown)) {
    return response.errorThrown;
  } else if (Ember.isPresent(response.message)) {
    return extractErrorFromResponseMessage(response.message);
  } else if (Ember.isPresent(response.error)) {
    return response.error;
  } else if (typeof response === 'string') {
    return response;
  } else {
    return FALLBACK_ERROR_MESSAGE;
  }
}

function extractErrorFromResponseMessage(message) {
  if (typeof message === 'string') {
    return message;
  } else if (Ember.isPresent(message.error)) {
    return message.error;
  } else {
    return FALLBACK_ERROR_MESSAGE;
  }
}

export default extractErrorMessage;