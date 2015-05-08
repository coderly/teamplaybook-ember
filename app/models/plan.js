import DS from 'ember-data';

export default DS.Model.extend({
  slug: DS.attr('string'),
  name: DS.attr('string'),
  trial_period_days: DS.attr('number'),
  amount: DS.attr('number'),
  isPaidPlan: Ember.computed.gt('amount', 0)
});