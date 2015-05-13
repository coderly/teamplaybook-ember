var basicTeamResponse = {
  data: {
    type: 'teams',
    id: 1,
    subdomain: 'test',
    name: 'test'
  }
};

var teamResponseWithOwnerLinkage = {
  data: {
    type: 'teams',
    id: 'teamWithOwner',
    subdomain: 'test',
    name: 'test',
    links: { owner: { linkage: { type: 'users', id: 'owner'} } }
  }
};

export {
  basicTeamResponse,
  teamResponseWithOwnerLinkage
};
