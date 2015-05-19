var basicTeamMembershipResponse = {
  data: {
    id: 1,
    email: 'membership@test.com',
    type: 'team-memberships'
  }
};

var listOfTeamMembershipsOneOfEachRole = {
  data: [
    { id: 'invitee', email: 'invite@test.com', type: 'team-memberships', roles: ['invitee']},
    { id: 'member', email: 'member@ŧest.com', type: 'team-memberships', roles: ['member'], links: { user: { linkage: { type: 'users', id: 'member'} } }  },
    { id: 'admin', email: 'admin@test.com', type: 'team-memberships', roles: ['admin'], links: { user: { linkage: { type: 'users', id: 'admin'} } }  },
    { id: 'owner', email: 'owner@test.com', type: 'team-memberships', roles: ['owner'], links: { user: { linkage: { type: 'users', id: 'owner'} } }  }
  ]
};

export {
  basicTeamMembershipResponse,
  listOfTeamMembershipsOneOfEachRole
};