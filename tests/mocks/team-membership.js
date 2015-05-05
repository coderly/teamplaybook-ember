var basicTeamMembershipResponse = {
  data: {
    id: 1,
    email: 'membership@test.com',
    type: 'team-memberships'
  }
};

var listOfTeamMembershipsOneOfEachRole = {
  data: [
    { id: 1, email: 'invite@test.com', type: 'team-memberships' },
    { id: 2, email: 'member@ŧest.com', type: 'team-memberships' },
    { id: 3, email: 'admin@test.com', type: 'team-memberships' },
    { id: 4, email: 'owner@test.com', type: 'team-memberships' }
  ]
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
  listOfTeamMembershipsOneOfEachRole,
  listOfNTeamMembershipsResponseBuilder
};
