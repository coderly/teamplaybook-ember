import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
moduleForComponent('image-upload-button');

test('clicking the button sends a "browseAndUpload" action', function(assert) {
  var targetObject = {
    browseAndUpload: function() {
      assert.ok(true, 'action was sent');
    }
  };

  var component = this.subject();
  component.set('browseAndUpload', 'browseAndUpload');
  component.set('targetObject', targetObject);

  this.$().find('button').click();
});