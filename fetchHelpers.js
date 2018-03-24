const fetch = require('node-fetch');

const fetchAllTeamIds = () => {
    fetch(`http://statsapi.mlb.com/api/v1/teams`)
        .then(res => res.json())
        .then(res => res.teams.filter(team => team.sport.id === 1).map(team => team.id))
        .catch(error => console.error(error));
}
