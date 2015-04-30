var basicTeamMembershipResponse = {
  data: {
    email: 'membership@test.com',
    type: 'team-memberships'
  }
};

function listOfNTeamMembershipsResponseBuilder(membershipCount) {
  var data = [];
  for (let i = 0; i < membershipCount; i++) {
    var membership = { id: i, email: `membership${i}@test.com`, type: 'team-memberships' };
    data.push(membership);
  }

  return { data: data };
}

export {
  basicTeamMembershipResponse,
  listOfNTeamMembershipsResponseBuilder
};
