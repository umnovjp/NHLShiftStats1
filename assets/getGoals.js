function getGoals(event) {
    var requestURL = 'https://statsapi.web.nhl.com/api/v1/game/' + gameId + '/feed/live';
    fetch(requestURL, {
      "method": "GET", "headers": {
        //   "x-rapidapi-host": "data-imdb1.p.rapidapi.com",
      }
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var goalTitle = document.createElement('h3');
        goalTitle.setAttribute('id', 'drama');
        goalTitle.innerHTML = 'Goals - shot location figure will be added';
        document.getElementById('gameInfo').appendChild(goalTitle);
        const arrayGoals = [];

        for (i = 0; i < data.liveData.plays.scoringPlays.length; i++) {
          scoringPlay = data.liveData.plays.scoringPlays[i];
          var newGoal = document.createElement('p');
          newGoal.innerHTML = 'Period: ' + data.liveData.plays.allPlays[scoringPlay].about.period + ' Time: ' + data.liveData.plays.allPlays[scoringPlay].about.periodTime + ' Score: ' + data.liveData.plays.allPlays[scoringPlay].about.goals.away + ' : ' + data.liveData.plays.allPlays[scoringPlay].about.goals.home + ' Shot Location: ' + data.liveData.plays.allPlays[scoringPlay].coordinates.x + ' : ' + data.liveData.plays.allPlays[scoringPlay].coordinates.y;
          document.getElementById('gameInfo').appendChild(newGoal);
          var coordinates = { x: data.liveData.plays.allPlays[scoringPlay].coordinates.x, y: data.liveData.plays.allPlays[scoringPlay].coordinates.y };
          arrayGoals.push(coordinates);

          for (j = 0; j < data.liveData.plays.allPlays[scoringPlay].players.length; j++) {
            var goalEvent = document.createElement('span');

            goalEvent.innerHTML = 'Name: ' + data.liveData.plays.allPlays[scoringPlay].players[j].player.fullName + ' Type: ' + data.liveData.plays.allPlays[scoringPlay].players[j].playerType;
            document.getElementById('gameInfo').appendChild(goalEvent);

            if (data.liveData.plays.allPlays[scoringPlay].players[j].playerType == 'Scorer') {
              var goal = document.createElement('span');
              goal.innerHTML = 'GO,';
              const scorer = data.liveData.plays.allPlays[scoringPlay].players[j].player.fullName;
              document.getElementById(scorer).appendChild(goal);
            }
            else if (data.liveData.plays.allPlays[scoringPlay].players[j].playerType == 'Assist') {
              var assist = document.createElement('span');
              assist.innerHTML = 'AS,';
              const assistant = data.liveData.plays.allPlays[scoringPlay].players[j].player.fullName;
              document.getElementById(assistant).appendChild(assist);
            }
            else if (data.liveData.plays.allPlays[scoringPlay].players[j].playerType == 'Goalie') {
              var goal = document.createElement('span');
              goal.innerHTML = 'AL,';
              const Goalie = data.liveData.plays.allPlays[scoringPlay].players[j].player.fullName;
              document.getElementById(Goalie).appendChild(goal);
            }
          }
        }
        console.log(arrayGoals);

      });
  };