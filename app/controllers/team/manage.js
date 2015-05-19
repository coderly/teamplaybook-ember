import Ember from 'ember';
import extractError from 'teamplaybook-ember/lib/extract-error';
import ajax from 'ic-ajax';
import ENV from 'teamplaybook-ember/config/environment';

export default Ember.Controller.extend({

  showError: false,
  errorMessage: null,
  cardToken: null,

  currentPlan: Ember.computed('model.planSlug', function (){
    var plans = this.store.all('plan');
    return plans.findBy('slug', this.get('model.planSlug'));
  }),

  currentPlanIsPaid: Ember.computed.alias('currentPlan.isPaid'),

  plans: Ember.computed(function(){
    return this.store.find('plan');
  }),

  actions: {
    delete: function() {
      var team = this.get('model');
      var controller = this;

      if (window.confirm('Are you sure you wish to disband this team?') === true) {
        team.deleteRecord();
        team.save().then(function () {
          controller.setProperties({
            showError: false,
            errorMessage: null
          });
        }).catch(function(response) {
          controller.setProperties({
            showError: true,
            errorMessage: extractError(response)
          });
        });
      }
    },
    changePlan: function(){
      var controller = this;
      if(this.get('currentPlanIsPaid')){
        this.createStripeToken().then(function(){
          controller.requestPlanChange();
        });
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

  createStripeToken: function(){
    var Stripe = window.Stripe;
    Stripe.setPublishableKey(ENV.STRIPE_PUBLIC_KEY);
    var controller = this;
    var $form = $('#payment-form');

    return new Ember.RSVP.Promise(function(resolve) {
      Stripe.card.createToken($form, function(status, response) {
        controller.set('cardToken', response.id);
        resolve();
      });
    });
  }
});