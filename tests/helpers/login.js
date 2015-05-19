function login() {
  fillIn('#email', 'test@example.com');
  fillIn('#password', '123456');
  click('#login');
}

export default login;