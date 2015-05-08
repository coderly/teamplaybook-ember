import Ember from 'ember';
import UrlInfo from 'teamplaybook-ember/lib/url-info';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  cardToken: null,

  plans: Ember.computed(function(){
    return this.store.find('plan');
  }),

  actions:{
    changePlan: function(){
      var plans = this.store.all('plan');
      var plan = plans.findBy('slug', this.get('model.planSlug'));

      if(plan.isPaidPlan){
        createStripeToken(requestPlanChange);
      }else{
        requestPlanChange();
      }
    }
  },

  _buildURL: function(path) {
    var apiUrl = this.get('urlInfo.apiUrl');
    return apiUrl + '/' + path;
  },

  requestPlanChange: function(){
    var controller = this;

    ajax({
     type: 'POST',
     url: this._buildURL('team/change_plan'),
     data: {
       plan_slug: this.get('model.planSlug'),
       card_token: this.get('cardToken')
     }
    }).then(function(){
      controller.get('model').reload();
    });
  },

  createStripeToken: function(callback){
    var controller = this;
    var $form = $('#payment-form');

    stripeCallback = function(status, response){
      controller.set('cardToken', response.id);
      callback();
    }
    Stripe.card.createToken($form, stripeCallback);
  }
});
