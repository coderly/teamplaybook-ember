function listOfNTeamMembersResponseBuilder(memberCount) {
  var data = [];
  for (let i = 0; i < memberCount; i++) {
    var teamMember = { id: i, email: `member${i}@test.com`, type: 'users' };
    data.push(teamMember);
  }

  return { data: data };
}

export {
  listOfNTeamMembersResponseBuilder
};
