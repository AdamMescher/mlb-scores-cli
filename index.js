const _ = require('lodash');
const Table = require('cli-table2');
const MLBAPI = require('./apiWrapper');

const api = new MLBAPI();

const displayTodaysGames = async () => {
  const games = await api.generateCleanGameData();

  games.forEach((game) => {
    const head = [];
    if (game.status.abstractGameState === 'Final') {
      head.push(game.status.detailedState);
    } else {
      head.push(game.currentInning);
    }
    head.push('R', 'H', 'E');

    const scoreboard = new Table({
      head,
    });

    scoreboard.push(
      [`${game.away.name} (${game.away.wins}-${game.away.losses})`, game.away.runs, game.away.hits, game.away.errors],
      [`${game.home.name} (${game.home.wins}-${game.home.losses})`, game.home.runs, game.home.hits, game.home.errors],
    );

    console.log(scoreboard.toString());
  });
};

const displayTodaysLinescores = async () => {
  const games = await api.generateCleanGameData();

  return games.forEach((game) => {
    const head = [];
    const home = [game.home.name];
    const away = [game.away.name];

    if (game.status.abstractGameState === 'Final' || game.status.abstractGameState === 'Postponed') {
      head.push(game.status.detailedState);
    } else if (game.currentInning === 'undefined undefined') {
      head.push(game.firstPitch);
    } else {
      head.push(game.currentInning);
    }

    if (game.innings.length <= 9) {
      for (let i = 1; i < 10; i++) {
        head.push(i);
      }
    } else {
      for (let i = 1; i < game.innings.length + 1; i++) {
        head.push(i);
      }
    }
    head.push('R', 'H', 'E');

    const scoreboard = new Table({
      head,
    });

    if (!game.innings.length) {
      for (let i = 0; i < 9; i++) {
        home.push('');
        away.push('');
      }
    }

    game.innings.forEach((inning) => {
      away.push(inning.away.runs);

      if (_.isUndefined(inning.home)) {
        home.push('X');
      } else {
        home.push(inning.home.runs);
      }
    });

    while (away.length < 10) {
      away.push('');
    }

    while (home.length < 10) {
      home.push('');
    }

    away.push(game.away.runs, game.away.hits, game.away.errors);
    home.push(game.home.runs, game.home.hits, game.home.errors);

    scoreboard.push(away, home);

    console.log(scoreboard.toString());
  });
};

// displayTodaysGames();
displayTodaysLinescores();

