import Ember from 'ember';

export default Ember.Object.extend({

  filepicker: null,

  handleDrop: function() {
    event.preventDefault();
    event.stopPropagation();

    var imageFile = event.dataTransfer.files[0];

    return new Ember.RSVP.Promise(function (resolve) {
      if (Ember.isPresent(imageFile)) {
        filepicker.store(imageFile, {}, function(response) {
          resolve(response);
        });
      }
    });
  },
});
