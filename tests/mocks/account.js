var loginSuccessResponse = {
  data: {
    type: 'users',
    id: 0,
    email: 'test@example.com',
    authentication_token: 'test_token'
  }
};

var registrationSuccessResponse = {
  data: {
    type: 'users',
    id: 0,
    email: 'test@example.com',
    authentication_token: 'test_token'
  }
};

function loginResponseForSpecificRole(role) {
  return {
    data: {
      type: 'users',
      id: role,
      role: role,
      email: 'test@example.com',
      authentication_token: 'test_token'
    }
  };
}

export {
  loginSuccessResponse,
  loginResponseForSpecificRole,
  registrationSuccessResponse
};
