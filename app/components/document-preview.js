
/*global Showdown*/
import Ember from 'ember';

export default Ember.Component.extend({
  converter: null,
  markdown: null,

  html: function() {
    var source = this.get('markdown') || '';
    return new Ember.Handlebars.SafeString(this.get('converter').makeHtml(source));
  }.property('markdown'),

  createConverter: function() {
    this.set('converter', new Showdown.converter({ extensions: ['github'] }));
  }.on('init')

});