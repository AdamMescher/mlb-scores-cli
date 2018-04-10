const axios = require('axios');
const fetch = require('node-fetch');

class MLBAPI {
  constructor() {
    this.statsApiUrl = 'https://statsapi.mlb.com/api/v1';
    this.xmlApiUrl = 'https://gd2.mlb.com/components/game/mlb';

    this.generateDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (day < 10) {
        day = `0${day}`;
      }
      if (month < 10) {
        month = `0${month}`;
      }
      return {
        year: `${year}`,
        month: `${month}`,
        day: `${day}`,
      };
    };

    this.getAmericanLeagueStandings = year =>
      axios.get(`${this.url}/standings/regularSeason?leagueId=103&season=${year}`)
        .then(res => res.data)
        .catch((error) => {
          throw error;
        });

    this.getNationalLeagueStandings = year =>
      this.axios.get(`${this.statsApiUrl}/standings/regularSeason?leagueId=104&season=${year}`)
        .then(res => res.data)
        .catch((error) => {
          throw error;
        });

    this.getTeam = pk =>
      axios.get(`${this.statsApiUrl}/teams/${pk}`)
        .then(res => res.data)
        .catch((error) => {
          throw error;
        });

    this.getPlayer = id =>
      axios.get(`${this.statsApiUrl}/people/${id}`)
        .then(res => res.data)
        .catch((error) => {
          throw error;
        });

    this.getPlayerStatsForGame = (personId, gamePk) =>
      axios.get(`${this.statsApiUrl}/${personId}/stats/game/${gamePk}`)
        .then(res => res.data)
        .catch((error) => {
          throw error;
        });

    this.getPlayerStatsForGame = (personId, gamePk) =>
      axios.get(`${this.statsApiUrl}/${personId}/stats/game/${gamePk}`)
        .then(res => res.data)
        .catch((error) => {
          throw error;
        });

    this.getAllTeams = () =>
      axios.get(`${this.statsApiUrl}/teams`)
        .then(res => res.data)
        .then(res => res.teams.filter(team => team.sport.id === 1).map(team => team.id))
        .catch((error) => {
          throw error;
        });

    this.getAllVenues = () =>
      axios.get(`${this.statsApiUrl}/teams`)
        .then(res => res.data)
        .catch((error) => {
          throw error;
        });

    this.getAllGamePks = (year, month, day) =>
      axios.get(`${this.xmlApiUrl}/year_${year}/month_${month}/day_${day}/miniscoreboard.json`)
        .then(res => res.data.data)
        .then(res => res.games.game.map(game => game.game_pk))
        .catch((error) => {
          throw error;
        });

    this.getGameFeed = pk =>
      axios.get(`${this.statsApiUrl}.1/game/${pk}/feed/live`)
        .then(res => res)
        .catch((error) => {
          throw error;
        });


    this.getGameBoxscore = pk =>
      axios.get(`${this.statsApiUrl}/game/${pk}/boxscore`)
        .then(res => res.data)
        .catch((error) => {
          throw error;
        });

    this.getGameLinescore = pk =>
      axios.get(`${this.statsApiUrl}/game/${pk}/linescore`)
        .then(res => res.data)
        .catch((error) => {
          throw error;
        });

    this.getGamePlayByPlay = pk =>
      axios.get(`${this.statsApiUrl}/game/${pk}/playByPlay`)
        .then(res => res.data)
        .catch((error) => {
          throw error;
        });

    this.getGameContent = pk =>
      axios.get(`${this.statsApiUrl}/game/${pk}/content`)
        .then(res => res.data)
        .catch((error) => {
          throw error;
        });

    this.getGameWinProbability = pk =>
      axios.get(`${this.statsApiUrl}/game/${pk}/winProbability`)
        .then(res => res.data)
        .catch((error) => {
          throw error;
        });

    this.getDivision = id =>
      axios.get(`${this.statsApiUrl}/divisions/${id}`)
        .then(res => res.data)
        .catch((error) => {
          throw error;
        });

    this.getAllDivisions = () =>
      axios.get(`${this.statsApiUrl}/divisions`)
        .then(res => res.data)
        .catch((error) => {
          throw error;
        });

    this.generateCleanGameData = async () => {
      const today = this.generateDate();
      const pks = await this.getAllGamePks(today.year, today.month, today.day);
      const feeds = await Promise.all(pks.map(pk => this.getGameFeed(pk)));

      return feeds.map((feed) => {
        const firstPitch = `${feed.data.gameData.datetime.time}${feed.data.gameData.datetime.ampm}`;
        const currentInning = `${feed.data.liveData.linescore.inningHalf} ${feed.data.liveData.linescore.currentInningOrdinal}`;
        const { status } = feed.data.gameData;
        const home = {
          name: feed.data.gameData.teams.home.name,
          wins: feed.data.gameData.teams.home.record.wins,
          losses: feed.data.gameData.teams.home.record.losses,
          runs: feed.data.liveData.linescore.teams.home.runs,
          hits: feed.data.liveData.linescore.teams.home.hits,
          errors: feed.data.liveData.linescore.teams.home.errors,
        };
        const away = {
          name: feed.data.gameData.teams.away.name,
          wins: feed.data.gameData.teams.away.record.wins,
          losses: feed.data.gameData.teams.away.record.losses,
          runs: feed.data.liveData.linescore.teams.away.runs,
          hits: feed.data.liveData.linescore.teams.away.hits,
          errors: feed.data.liveData.linescore.teams.away.errors,
        };
        const { innings } = feed.data.liveData.linescore;

        return {
          firstPitch,
          away,
          home,
          innings,
          currentInning,
          status,
        };
      });
    };
  }
}

module.exports = MLBAPI;
