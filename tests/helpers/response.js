function response(statusCode, data) {
  return function() {
    return buildResponse(statusCode, data);
  };
}

function responseQueue(statusCode, data) {
  return function() {
    var queue = data.copy();
    return buildResponse(statusCode, queue.shift());
  };
}

function buildResponse(statusCode, data) {
  return [statusCode, {'Content-Type': 'application/vnd.api+json'}, JSON.stringify(data)];
}

export { response, responseQueue, buildResponse };
