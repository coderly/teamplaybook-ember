import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    contentChanged: function() {
      var page = this.get('model');

      page.save();
    }
  }
});
