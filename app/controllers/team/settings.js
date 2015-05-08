import Ember from 'ember';

export default Ember.Controller.extend({
  plans: Ember.computed(function(){
    return this.store.find('plan');
  })
});
