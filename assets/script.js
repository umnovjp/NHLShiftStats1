var scheduleContent = document.getElementById('schedule');
var gameId;
var inputVal = '2021';
const homeRosterArray = [];
const awayRosterArray = [];
const homeRosterIdArray = [];
const awayRosterIdArray = [];
const homeRosterDArray = [];

// two lines below will allow user to search by year
function getInputValue() {
  // var inputVal = document.getElementById('myInput').value;
  var inputVal = document.getElementById('datepicker').value;
  console.log('inputVal= ' + inputVal);

  var date = inputVal.split('/');
  console.log(date);
  var formatted = date[2] + '-' + date[0] + '-' + date[1];
  console.log(formatted)
  var requestURL = 'https://statsapi.web.nhl.com/api/v1/schedule/?date=' + formatted;
  console.log(requestURL);
  fetch(requestURL, {
    "method": "GET", "headers": {
    }
  })

    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('I am in schedule then')
      console.log(data.dates[0].games);
      console.log(data.dates[0].games[0].teams.away.leagueRecord);
      var numberOfGames = data.dates[0].games.length;
      // var obj = data.gameData.players;
      // var keys = Object.keys(obj);
      scheduleContent.textContent = '';
      for (var i = 0; i < numberOfGames; i++) {

        var gameName = document.createElement('button');
        gameName.setAttribute('id', 'game' + i);
        var idx = gameName.getAttribute('id');
        // console.log(idx);
        gameName.innerHTML = 'Game ' + i + ': ' + data.dates[0].games[i].teams.away.team.name + ' ' + data.dates[0].games[i].teams.away.leagueRecord.wins + 'W ' + data.dates[0].games[i].teams.away.leagueRecord.losses + 'L ' + data.dates[0].games[i].teams.away.leagueRecord.ot + 'O vs ' + data.dates[0].games[i].teams.home.team.name + ' ' + data.dates[0].games[i].teams.home.leagueRecord.wins + 'W ' + data.dates[0].games[i].teams.home.leagueRecord.losses + 'L ' + data.dates[0].games[i].teams.home.leagueRecord.ot + 'O ';
        document.getElementById('schedule').appendChild(gameName);
        gameName.addEventListener('click', displayGameData);
      }
    
      function displayGameData(event) {
        idx = event.currentTarget;
        //    console.log(typeof idx)
        idxString = event.currentTarget.textContent;
        idxArray = idxString.split(':');
        idxNumber = idxArray[0].split(' ');
        console.log(idxNumber);
        gameNumber = idxNumber[1];

        const gameId = data.dates[0].games[gameNumber].gamePk;
        console.log(gameId);
        var requestURL = 'https://statsapi.web.nhl.com/api/v1/game/' + gameId + '/feed/live';
        fetch(requestURL, {
          "method": "GET", "headers": {
            //   "x-rapidapi-host": "data-imdb1.p.rapidapi.com",
            //   "x-rapidapi-key": "f567ffdbe0msh246ba4a9ef34553p1195c8jsn6e946070d30d"
          }
        })

          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log('I am in second then')
            // console.log(data);
            const gameInfo = document.createElement('section');
            gameInfo.setAttribute('id', 'gameInfo');
            document.getElementById('schedule').appendChild(gameInfo);
            const gameInfoHome = document.createElement('section');
            gameInfoHome.setAttribute('id', 'gameInfoHome');
            document.getElementById('schedule').appendChild(gameInfoHome);
            const gameInfoAway = document.createElement('section');
            gameInfoAway.setAttribute('id', 'gameInfoAway');
            document.getElementById('schedule').appendChild(gameInfoAway);
            var gameTitle = document.createElement('h2');
            gameTitle.textContent = '';
            gameTitle.innerHTML = 'You are watching stats for ' + data.gameData.teams.away.name + ' at ' + data.gameData.teams.home.name + ' game';
            document.getElementById('gameInfo').appendChild(gameTitle);

            var goalButton = document.createElement('button');
            goalButton.setAttribute('class', 'searchParameter');
            goalButton.textContent = 'Print Goals';
            document.getElementById('gameInfo').appendChild(goalButton);
            goalButton.addEventListener('click', getGoals);

            //           var rosterButton = document.createElement('button');
            //           rosterButton.setAttribute('class', 'searchParameter');
            //           rosterButton.textContent = 'Print Rosters';
            //           document.getElementById('gameInfo').appendChild(rosterButton);
            // //          rosterButton.addEventListener('click', getRoster);
          });
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

              new Chart("myChart", {
                type: "scatter",
                data: {
                  datasets: [{
                    pointRadius: 4,
                    pointBackgroundColor: "rgb(0,0,255)",
                    data: arrayGoals
                  }]
                },
                options: {
                  legend: { display: false },
                  scales: {
                    xAxes: [{ ticks: { min: -100, max: 100 } }],
                    yAxes: [{ ticks: { min: -42.5, max: 42.5 } }],
                  }
                }
              });

            });
        };

        getShifts();
        function getShifts(event) {
          // lines 235-277 generate home roster and away roster line number may change
          var rosterURL = 'https://statsapi.web.nhl.com/api/v1/game/' + gameId + '/feed/live';
          fetch(rosterURL, {
            "method": "GET", "headers": {}
          })
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              console.log(data.gameData.players)

              var obj = data.gameData.players;
              var keys = Object.keys(obj);

              for (var i = 0; i < keys.length; i++) {
                var val = obj[keys[i]];
                if (val.currentTeam.id == data.gameData.teams.away.id) {
                  //  document.getElementById('awayTeamId').appendChild(playerName);
                  awayRosterArray.push(val.primaryNumber);
                  awayRosterArray.push(val.fullName);
                  awayRosterArray.push(val.primaryPosition.abbreviation);
                  awayRosterArray.push(keys[i]);
                  hId = keys[i].split('ID');
                  //  hIdNumber = Number(hId[1]);
                  awayRosterIdArray.push(hId[1]);
                }
                else if (val.currentTeam.id == data.gameData.teams.home.id) {
                  homeRosterArray.push(val.primaryNumber);
                  homeRosterArray.push(val.fullName);
                  homeRosterArray.push(val.primaryPosition.abbreviation);
                  homeRosterArray.push(keys[i]);
                  hId = keys[i].split('ID');
                  //   hIdNumber = Number(hId[1]);
                  homeRosterIdArray.push(hId[1]);
                }
              }
              console.log(homeRosterArray);
              console.log(awayRosterArray);
              console.log(homeRosterIdArray, awayRosterIdArray);
            });
          console.log(gameId);
          //     getRoster();
          var shiftURL = 'https://cors-anywhere.herokuapp.com/https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=' + gameId;
          fetch(shiftURL, {
            "method": "GET", "headers": {}
          })
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              console.log('I am in third then');
              console.log(data.data);
              playerChart1 = [];
              playerChart2 = [];
              playerChart3 = [];
              startingLineup = [];
              totalChart = [];
              idChart = [];
              // that's a complex cycle that creates arrays of each player time shifts in each of three periods, also arary of playerIDs who actually played the game, not just were in the roster, also starting lineups are created
              for (i = 0; i < data.data.length - 1; i++) {
                if (data.data[i].typeCode === 517) {
                  const playerId = data.data[i].playerId;
                  if (data.data[i].playerId == data.data[i + 1].playerId) {
                    if (data.data[i].period == 1) {
                      shiftStart = data.data[i].startTime;
                      shiftStart1 = shiftStart.split(':');
                      minutes = Number(shiftStart1[0]);
                      seconds = Number(shiftStart1[1]);
                      shiftStart2 = minutes * 60 + seconds;
                      playerChart1.push(shiftStart2);
                      shiftEnd = data.data[i].endTime;
                      shiftEnd1 = shiftEnd.split(':');
                      minutes = Number(shiftEnd1[0]);
                      seconds = Number(shiftEnd1[1]);
                      shiftEnd2 = minutes * 60 + seconds;
                      playerChart1.push(shiftEnd2)
                      if (shiftStart2 == 0) { startingLineup.push(data.data[i].playerId) }
                    }

                    else if (data.data[i].period == 2) { playerChart2.push(data.data[i].startTime) }
                    else if (data.data[i].period == 3) { playerChart3.push(data.data[i].startTime) }
                    else { console.log('shift not added') }
                  } //, data.data[i].endTime, data.data[i].duration

                  else {
                    if (data.data[i].period == 3) { playerChart3.push(data.data[i].startTime); }
                    else if (data.data[i].period == 2) { playerChart2.push(data.data[i].startTime); }
                    else if (data.data[i].period == 1) { playerChart1.push(data.data[i].startTime); }
                    else { console.log('error in adding last shift') }
                    totalChart.push(playerChart1);
                    totalChart.push(playerChart2);
                    totalChart.push(playerChart3);
                    idChart.push(playerId);
                    playerChart1 = [];
                    playerChart2 = [];
                    playerChart3 = [];
                  }

                  if (i == data.data.length - 2) {// console.log('i = ', i);
                    //    console.log(playerChart1, playerChart2, playerChart3);
                    totalChart.push(playerChart1);
                    totalChart.push(playerChart2);
                    totalChart.push(playerChart3);
                    idChart.push(playerId);
                  }
                }
              } // end for cycle for shift processing data next six lines just last shift of last pleyer
              if (data.data[data.data.length - 1].period == 3) { playerChart3.push(data.data[data.data.length - 1].startTime); }
              else if (data.data[data.data.length - 1].period == 2) { playerChart2.push(data.data[data.data.length - 1].startTime); }
              else if (data.data[data.data.length - 1].period == 1) { playerChart1.push(data.data[data.data.length - 1].startTime); }
              console.log(startingLineup);
              console.log(totalChart, idChart);
              console.log(homeRosterIdArray, awayRosterIdArray)
              // next loop determines starting lineup for both teams currently lines 287-297
              homeStartingLineup = [];
              homeStartingDLineup = [];
              homeStartingFLineup = [];
              for (i = 0; i < 12; i++) {
                tempVariable = startingLineup[i];
                tempString = tempVariable.toString();
                if (homeRosterIdArray.includes(tempString)) {
                  console.log(homeRosterIdArray.indexOf(tempString), 'home', homeRosterArray[4 * homeRosterIdArray.indexOf(tempString) + 1], homeRosterArray[4 * homeRosterIdArray.indexOf(tempString) + 2])
                  if (homeRosterArray[4 * homeRosterIdArray.indexOf(tempString) + 2] == 'D') { homeStartingDLineup.push(tempVariable) }
                  else if (homeRosterArray[4 * homeRosterIdArray.indexOf(tempString) + 2] == 'G') { homeStartingLineup.push(tempVariable) }
                  else { homeStartingFLineup.push(tempVariable) }
                }

                else if (awayRosterIdArray.includes(tempString)) {
                  console.log(awayRosterIdArray.indexOf(tempString), 'away', awayRosterArray[4 * awayRosterIdArray.indexOf(tempString) + 1], awayRosterArray[4 * awayRosterIdArray.indexOf(tempString) + 2])
                }
                else { console.log(tempString, 'fatal') }
              } // end for cycle startingLineup
              homeStartingLineup.push(homeStartingDLineup);
              homeStartingLineup.push(homeStartingFLineup);
              console.log(homeStartingLineup);

              homeRosterGArray = [];
              homeRosterFArray = [];
              for (i = 0; i < idChart.length; i++) {
                tempValue = 'ID' + idChart[i];
                if (homeRosterArray.includes(tempValue)) {
                  tempVariable = homeRosterArray.indexOf(tempValue);
                  //      console.log(tempVariable, homeRosterArray[tempVariable - 3], homeRosterArray[tempVariable - 1])
                  if (homeRosterArray[tempVariable - 1] == 'D') { homeRosterDArray.push(idChart[i]) }
                  else if (homeRosterArray[tempVariable - 1] == 'G') { homeRosterGArray.push(idChart[i]) }
                  else if (homeRosterArray[tempVariable - 1] == 'C') { homeRosterFArray.push(idChart[i]) }
                  else if (homeRosterArray[tempVariable - 1] == 'RW') { homeRosterFArray.push(idChart[i]); }
                  else if (homeRosterArray[tempVariable - 1] == 'LW') { homeRosterFArray.push(idChart[i]); }
                  else (console.log('he does not have a position', tempValue))
                }
              } // end for idChart loop
              console.log(homeRosterDArray, homeRosterGArray, homeRosterFArray);
              //     }
              getDPairs();
              function getDPairs() {
                shiftsArray = [];
                TOIArray = [];
                pairingsArray = [];
                for (i = 0; i < homeRosterDArray.length; i++) {
                  shiftsArray.push(totalChart[3 * idChart.indexOf(homeRosterDArray[i])]);
                  //       console.log(idChart.indexOf(homeRosterDArray[i]), shiftsArray);                
                } // end first for loop
                console.log(shiftsArray);
                for (i = 0; i < shiftsArray.length; i++) {
                  totalShiftLength = 0;
                  tempArray = shiftsArray[i];
                  for (j = 0; j < 0.5 * tempArray.length; j++) {
                    const shiftLength = tempArray[2 * j + 1] - tempArray[2 * j];
                    //      console.log(shiftLength);
                    totalShiftLength = totalShiftLength + shiftLength;
                  } // end j loop
                  TOIArray.push(totalShiftLength);
                } // end i loop
                //   
                for (i = 0; i < shiftsArray.length; i++) // i < shiftsArray.length
                { // console.log(i);
                  for (j = i + 1; j < shiftsArray.length; j++) {
                    //         console.log(i, j);
                    tempTime = [];
                    for (k = 0; k < 0.5 * shiftsArray[i].length; k++) {
                      tempArray = shiftsArray[i];
                      //          console.log(i, j, k, tempArray[2 * k]); 

                      for (l = 0; l < 0.5 * shiftsArray[j].length; l++) {
                        tempArray2 = shiftsArray[j];
                        //      big if starts
                        if (tempArray2[2 * l] >= tempArray[2 * k] && tempArray2[2 * l] <= tempArray[2 * k + 1]) {
                          if (tempArray2[2 * l + 1] >= tempArray[2 * k + 1]) {
                            tempTime.push(tempArray[2 * k + 1] - tempArray2[2 * l]);
                            // console.log('case 1', tempTime, i, j, k, l, tempArray2[2 * l], tempArray[2 * k + 1] - tempArray2[2 * l]) 
                          }
                          else {
                            tempTime.push(tempArray2[2 * l + 1] - tempArray2[2 * l]);
                            // console.log('case 2', tempTime, i, j, k, l, tempArray2[2 * l], tempArray2[2 * l + 1] - tempArray2[2 * l]) 
                          }
                        }
                        else if (tempArray2[2 * l] <= tempArray[2 * k] && tempArray2[2 * l + 1] >= tempArray[2 * k]) {
                          if (tempArray2[2 * l + 1] >= tempArray[2 * k + 1]) {
                            tempTime.push(tempArray2[2 * l + 1] - tempArray[2 * k]);
                            //  console.log('case 3', tempTime, i, j, k, l, tempArray2[2 * l], tempArray2[2 * l + 1] - tempArray[2 * k]) 
                          }
                          else {
                            tempTime.push(tempArray2[2 * l + 1] - tempArray[2 * k]);
                            // console.log('case 4', tempTime, i, j, k, l, tempArray2[2 * l], tempArray2[2 * l + 1] - tempArray[2 * k])
                          }
                        }
                      }
                    } // end k cycle
                    shifts = 0;
                    const sum = tempTime.reduce((partialSum, a) => partialSum + a, 0);
                    for (m = 0; m < tempTime.length; m++) { if (tempTime[m] >= 10) { shifts = shifts + 1 } }
                    pairingsArray.push(sum);
                    pairingsArray.push(shifts);
                    //              console.log(tempTime, i, j, sum, shifts);
                  }
                }
                console.log(pairingsArray, TOIArray);
                const maxTime = Math.max(...pairingsArray);
                const numberOnePair = pairingsArray.indexOf(maxTime);
                const tempArray3 = pairingsArray;
                tempArray3[numberOnePair] = 0;
               // console.log(tempArray3);
                const maxTime2 = Math.max(...tempArray3);
                const numberTwoPair = tempArray3.indexOf(maxTime2);
             //   const tempArray = pairingsArray;
                tempArray3[numberTwoPair] = 0;
            //    console.log(tempArray3);
                const maxTime3 = Math.max(...tempArray3);
                const numberThreePair = tempArray3.indexOf(maxTime3);
                if (pairingsArray.length == 42) { arrayDs = [0, [0, 1], 2, [0, 2], 4, [0, 3], 6, [0, 4], 8, [0, 5], 10, [0, 6], 12, [1, 2], 14, [1, 3], 16, [1, 4], 18, [1, 5], 20, [1, 6], 22, [2, 3], 24, [2, 4], 26, [2, 5], 28, [2, 6], 30, [3, 4], 32, [3, 5], 34, [3, 6], 36, [4, 5], 38, [4, 6], 40, [5, 6]] }
                else if (pairingsArray.length == 30) { arrayDs = [0, [0, 1], 2, [0, 2], 4, [0, 3], 6, [0, 4], 8, [0, 5], 10, [1, 2], 12, [1, 3], 14, [1, 4], 16, [1, 5], 18, [2, 3], 20, [2, 4], 22, [2, 5], 24, [3, 4], 26, [3, 5], 28, [4, 5]] }
                else if (pairingsArray.length == 20) { arrayDs = [0, [0, 1], 2, [0, 2], 4, [0, 3], 6, [0, 4], 8, [1, 2], 10, [1, 3], 12, [1, 4], 14, [2, 3], 16, [2, 4], 18, [3, 4]] }
                else if (pairingsArray.length == 12) { arrayDs = [0, [0, 1], 2, [0, 2], 4, [0, 3], 6, [1, 2], 8, [1, 3], 10, [2, 3]] }
          
                console.log(numberOnePair, maxTime, arrayDs[numberOnePair + 1], numberTwoPair, maxTime2, arrayDs[numberTwoPair + 1], numberThreePair, maxTime3, arrayDs[numberThreePair + 1]);
              //  const twoPairs = arrayDs[numberOnePair + 1];
              //  var top3D = arrayDs[numberOnePair + 1];
                
                const top3D = arrayDs[numberOnePair + 1].push(arrayDs[numberTwoPair + 1][0]);
                console.log(top3D);
                console.log(arrayDs[numberTwoPair + 1][0], arrayDs[numberTwoPair + 1][1], top3D)
                top3D = top3D.push(arrayDs[numberTwoPair + 1][1]);
                console.log(top3D);
              } // end function getDPairs
            });
        }
      }
    }
  );
}