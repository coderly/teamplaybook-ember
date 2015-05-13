import Ember from 'ember';
import ajax from 'ic-ajax';
import ENV from 'teamplaybook-ember/config/environment';

var Stripe = window.Stripe;
var $ = window.$;

export default Ember.Controller.extend({
  cardToken: null,

  plans: Ember.computed(function(){
    return this.store.find('plan');
  }),

  actions:{
    changePlan: function(){
      var plans = this.store.all('plan');
      var plan = plans.findBy('slug', this.get('model.planSlug'));

      console.log(this.get('model.planSlug'));
      console.log(plan.get('name'));
      console.log(plan.get('amount'));

      if(plan.get('isPaid')){
        this.createStripeToken(this.requestPlanChange);
      }else{
        this.requestPlanChange();
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
      alert("You have changed your plan");
      controller.get('model').reload();
    });
  },

  createStripeToken: function(callback){
    Stripe.setPublishableKey(ENV.STRIPE_PUBLIC_KEY);
    var controller = this;
    var $form = $('#payment-form');

    var stripeCallback = function(status, response){
      controller.set('cardToken', response.id);
      callback();
    };
    Stripe.card.createToken($form, stripeCallback);
  }
});
