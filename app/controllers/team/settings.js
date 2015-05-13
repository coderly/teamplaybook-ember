import Ember from 'ember';
import ajax from 'ic-ajax';
import ENV from 'teamplaybook-ember/config/environment';
import extractError from 'teamplaybook-ember/lib/extract-error';

var $ = window.$;

export default Ember.Controller.extend({
  cardToken: null,
  currentPlan: Ember.computed('model.planSlug', function (){
    var plans = this.store.all('plan');
    return plans.findBy('slug', this.get('model.planSlug'));
  }),

  currentPlanIsPaid: Ember.computed.alias('currentPlan.isPaid'),

  plans: Ember.computed(function(){
    return this.store.find('plan');
  }),

  actions:{
    changePlan: function(){
      if(this.get('currentPlanIsPaid')){
        this.createStripeToken(this.requestPlanChange.bind(this));
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
    var team = this.get('model');

    ajax({
     type: 'POST',
     url: this._buildURL('team/change_plan'),
     data: {
       plan_slug: team.get('planSlug'),
       card_token: this.get('cardToken')
     }
    }).then(function(){
      alert("You have changed your plan");
    }, function(response){
      alert(extractError(response));
    });
  },

  createStripeToken: function(callback){
    var Stripe = window.Stripe;
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
