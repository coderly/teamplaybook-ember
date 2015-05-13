import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  slug: DS.attr('string'),
  name: DS.attr('string'),
  trial_period_days: DS.attr('number'),
  amount: DS.attr('number'),
  isPaid: Ember.computed.gt('amount', 0)
});