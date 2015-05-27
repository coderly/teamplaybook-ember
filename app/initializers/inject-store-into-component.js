export default {
  name: 'inject-store-into-component',
  initialize: function(container, application) {
    application.inject('component', 'store', 'store:main');  
  },
};