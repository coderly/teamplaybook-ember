function listOfNTeamMembersResponseBuilder(memberCount) {
  var data = [];
  for (let i = 0; i < memberCount; i++) {
    var teamMember = { id: i, email: `member${i}@test.com`, type: 'users' };
    data.push(teamMember);
  }

  return { data: data };
}

var listOfUsersOneForEachRole = {
  data: [
    { id: 'member', email: 'member@ŧest.com', type: 'users' },
    { id: 'admin', email: 'admin@ŧest.com', type: 'users' },
    { id: 'owner', email: 'owner@ŧest.com', type: 'users' },
  ]
};

export {
  listOfNTeamMembersResponseBuilder,
  listOfUsersOneForEachRole
};
