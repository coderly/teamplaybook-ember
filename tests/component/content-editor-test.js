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

test('The ".toolbar" rendering is determined by "disableToolbar" flag', function(assert) {
  var component = this.subject({
    disableToolbar: false
  });

  assert.equal(this.$().find('.toolbar').length, 1, 'toolbar is rendered');

  Ember.run(function() {
    component.set('disableToolbar', true);
  });

  assert.equal(this.$().find('.toolbar').length, 0, 'toolbar is not rendered');
});
