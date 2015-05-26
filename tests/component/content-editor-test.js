import Ember from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
moduleForComponent('content-editor', {
  needs: ['component:image-upload-button']
});

test('The html content of the ".content" element is set to value', function(assert) {
  var component = this.subject({
    value: '<b>Lorem</b> ipsum'
  });
  assert.equal(this.$().find('.content').html(), '<b>Lorem</b> ipsum');
});