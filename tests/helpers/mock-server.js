import Pretender from 'pretender';

function createPretender(...mocks) {
  var server = new Pretender();

  mocks.forEach(function(mock) {
    mock.call(server);
  });

  server.unhandledRequest = function(verb, path, request) {
    console.error('Unhandled request.', verb, path, request);
  };

  return server;
}

export default createPretender;
