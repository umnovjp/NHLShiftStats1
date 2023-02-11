var scheduleContent = document.getElementById('schedule');
var gameId;
var inputVal = '2021';
const homeRosterArray = [];
const awayRosterArray = [];
const homeRosterIdArray = [];
const awayRosterIdArray = [];
const homeRosterDArray = [];
const awayRosterDArray = [];

// two lines below will allow user to search by year
function getInputValue() {
  // var inputVal = document.getElementById('myInput').value;
  var inputVal = document.getElementById('datepicker').value;
  console.log('inputVal= ' + inputVal);

  var date = inputVal.split('/');
  //console.log(date);
  var formatted = date[2] + '-' + date[0] + '-' + date[1];
  console.log(formatted)
  var requestURL = 'https://statsapi.web.nhl.com/api/v1/schedule/?date=' + formatted;
  //console.log(requestURL);
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
      // console.log(data.dates[0].games[0].teams.away.leagueRecord);
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

          });

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
               console.log(data.liveData.boxscore.teams.away.skaters, data.liveData.boxscore.teams.home.skaters, data.gameData.players);
               skatersHome = data.liveData.boxscore.teams.home.skaters;
               skatersAway = data.liveData.boxscore.teams.away.skaters;
               goaliesHome = data.liveData.boxscore.teams.home.goalies;
               goaliesAway = data.liveData.boxscore.teams.away.goalies;

              var obj = data.gameData.players;
              var keys = Object.keys(obj);

              for (var i = 0; i < keys.length; i++) {
                var val = obj[keys[i]];
                console.log(val.id, val.currentTeam.id, data.gameData.teams.away.id);
                // console.log(val.currentTeam, data.gameData.teams.away.id, val.fullName)
                if (skatersAway.includes(val.id) || goaliesAway.includes(val.id))// if (val.currentTeam.id == data.gameData.teams.away.id) 
                {
                  //  document.getElementById('awayTeamId').appendChild(playerName);
                  awayRosterArray.push(val.primaryNumber);
                  awayRosterArray.push(val.fullName);
                  awayRosterArray.push(val.primaryPosition.abbreviation);
                  awayRosterArray.push(keys[i]);
                  // hId = keys[i].split('ID');
                  //  hIdNumber = Number(hId[1]);
                  awayRosterIdArray.push(val.id);
                }
                else if (skatersHome.includes(val.id) || goaliesHome.includes(val.id))// else if (val.currentTeam.id == data.gameData.teams.home.id) 
                {
                  homeRosterArray.push(val.primaryNumber);
                  homeRosterArray.push(val.fullName);
                  homeRosterArray.push(val.primaryPosition.abbreviation);
                  homeRosterArray.push(keys[i]);
                  // hId = keys[i].split('ID');
                  //   hIdNumber = Number(hId[1]);
                  homeRosterIdArray.push(val.id);
                }
                else { console.log(val.id, 'player probably changed team') }
              }
              console.log(homeRosterArray, skatersHome, goaliesHome);
              console.log(awayRosterArray, skatersAway, goaliesAway);
              //console.log(homeRosterIdArray, awayRosterIdArray);
            });
          // console.log(gameId);
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
              // console.log(data.data);
              playerChart1 = [];
              playerChart2 = [];
              playerChart3 = [];
              startingLineup = [];
              totalChart = [];
              idChart = [];
              // that's a complex cycle that creates arrays of each player time shifts in each of three periods, also arary of playerIDs who actually played the game, not just were in the roster, also starting lineups are created
              for (i = 0; i < data.data.length - 1; i++) {
                if (data.data[i].typeCode == 517) {
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

                    else if (data.data[i].period == 2) {
                      shiftStart = data.data[i].startTime;
                      shiftStart1 = shiftStart.split(':');
                      minutes = Number(shiftStart1[0]);
                      seconds = Number(shiftStart1[1]);
                      shiftStart2 = minutes * 60 + seconds;
                      playerChart2.push(shiftStart2);
                      shiftEnd = data.data[i].endTime;
                      shiftEnd1 = shiftEnd.split(':');
                      minutes = Number(shiftEnd1[0]);
                      seconds = Number(shiftEnd1[1]);
                      shiftEnd2 = minutes * 60 + seconds;
                      playerChart2.push(shiftEnd2)
                    }

                    else if (data.data[i].period == 3) {
                      shiftStart = data.data[i].startTime;
                      shiftStart1 = shiftStart.split(':');
                      minutes = Number(shiftStart1[0]);
                      seconds = Number(shiftStart1[1]);
                      shiftStart2 = minutes * 60 + seconds;
                      playerChart3.push(shiftStart2);
                      shiftEnd = data.data[i].endTime;
                      shiftEnd1 = shiftEnd.split(':');
                      minutes = Number(shiftEnd1[0]);
                      seconds = Number(shiftEnd1[1]);
                      shiftEnd2 = minutes * 60 + seconds;
                      playerChart3.push(shiftEnd2)
                    }
                    else { console.log('shift not added') }
                    // if (data.data[i+1].period == 5 && i < data.data.length - 2) { console.log(data.data[i+1].lastName, i, data.data.length)
                    //   totalChart.push(playerChart1, playerChart2, playerChart3);
                    //   idChart.push(playerId);}
                  }

                  else {
                    if (data.data[i].period == 3) {
                      shiftStart = data.data[i].startTime;
                      shiftStart1 = shiftStart.split(':');
                      minutes = Number(shiftStart1[0]);
                      seconds = Number(shiftStart1[1]);
                      shiftStart2 = minutes * 60 + seconds;
                      playerChart3.push(shiftStart2);
                      shiftEnd = data.data[i].endTime;
                      shiftEnd1 = shiftEnd.split(':');
                      minutes = Number(shiftEnd1[0]);
                      seconds = Number(shiftEnd1[1]);
                      shiftEnd2 = minutes * 60 + seconds;
                      playerChart3.push(shiftEnd2)
                      //playerChart3.push(data.data[i].startTime); 
                      //      console.log(data.data[i].startTime, data.data[i].typeCode, typeof data.data[i].typeCode, i)
                    }
                    else if (data.data[i].period == 2) {
                      shiftStart = data.data[i].startTime;
                      shiftStart1 = shiftStart.split(':');
                      minutes = Number(shiftStart1[0]);
                      seconds = Number(shiftStart1[1]);
                      shiftStart2 = minutes * 60 + seconds;
                      playerChart2.push(shiftStart2);
                      shiftEnd = data.data[i].endTime;
                      shiftEnd1 = shiftEnd.split(':');
                      minutes = Number(shiftEnd1[0]);
                      seconds = Number(shiftEnd1[1]);
                      shiftEnd2 = minutes * 60 + seconds;
                      playerChart2.push(shiftEnd2)
                    }
                    else if (data.data[i].period == 1) {
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
                    }
                    else { console.log('error in adding last shift', data.data[i].period) }
                    totalChart.push(playerChart1, playerChart2, playerChart3);
                    // totalChart.push(playerChart2);
                    // totalChart.push(playerChart3);
                    idChart.push(playerId);
                    console.log(playerId, idChart.length);
                    playerChart1 = [];
                    playerChart2 = [];
                    playerChart3 = [];
                  }

                  if (i == data.data.length - 2) {// console.log('i = ', i);
                    totalChart.push(playerChart1, playerChart2, playerChart3);
                    // totalChart.push(playerChart2);
                    console.log(i, playerId, idChart.length);
                    idChart.push(playerId);
                  }
                }
              } // end for cycle for shift processing data next six lines just last shift of last pleyer
              if (data.data[data.data.length - 1].period == 3) {
                playerChart3.push(data.data[data.data.length - 1].startTime);
                console.log(data.data[data.data.length - 1].startTime)
              }
              else if (data.data[data.data.length - 1].period == 2) { playerChart2.push(data.data[data.data.length - 1].startTime); }
              else if (data.data[data.data.length - 1].period == 1) { playerChart1.push(data.data[data.data.length - 1].startTime); }
              console.log(startingLineup);
               console.log(totalChart, idChart);
              console.log(homeRosterIdArray, awayRosterIdArray)
              // next loop determines starting lineup for both teams currently lines 287-297
              homeStartingLineup = [];
              homeStartingDLineup = [];
              homeStartingFLineup = [];
              // for (i = 0; i < 12; i++) {lines 286-302 disabled on 02/05/2023 i do not need starting lineup for now
              //   tempVariable = startingLineup[i];
              //   // tempString = tempVariable.toString();
              //   if (homeRosterIdArray.includes(tempVariable)) {
              //     // console.log(homeRosterIdArray.indexOf(tempString), 'home', homeRosterArray[4 * homeRosterIdArray.indexOf(tempString) + 1], homeRosterArray[4 * homeRosterIdArray.indexOf(tempString) + 2])
              //     if (homeRosterArray[4 * homeRosterIdArray.indexOf(tempString) + 2] == 'D') { homeStartingDLineup.push(tempVariable) }
              //     else if (homeRosterArray[4 * homeRosterIdArray.indexOf(tempString) + 2] == 'G') { homeStartingLineup.push(tempVariable) }
              //     else { homeStartingFLineup.push(tempVariable) }
              //   }

              //   else if (awayRosterIdArray.includes(tempVariable)) {
              //     //console.log(awayRosterIdArray.indexOf(tempString), 'away', awayRosterArray[4 * awayRosterIdArray.indexOf(tempString) + 1], awayRosterArray[4 * awayRosterIdArray.indexOf(tempString) + 2])
              //   }
              //   else { console.log(tempVariable, 'fatal') }
              // } // end for cycle starting Lineup
              // homeStartingLineup.push(homeStartingDLineup, homeStartingFLineup);
              // // homeStartingLineup.push(homeStartingFLineup);
              // console.log(homeStartingLineup);

              homeRosterGArray = [];
              homeRosterFArray = [];
              awayRosterGArray = [];
              awayRosterFArray = [];
              for (i = 0; i < idChart.length; i++) {
                
                tempValue = 'ID' + idChart[i];
                if (homeRosterArray.includes(tempValue)) {
                  tempVariable = homeRosterArray.indexOf(tempValue);
                  if (homeRosterArray[tempVariable - 1] == 'D') { homeRosterDArray.push(idChart[i]) }
                  else if (homeRosterArray[tempVariable - 1] == 'G') { homeRosterGArray.push(idChart[i]) }
                  else if (homeRosterArray[tempVariable - 1] == 'C') { homeRosterFArray.push(idChart[i]); console.log(i, homeRosterArray[tempVariable - 2]) }
                  else if (homeRosterArray[tempVariable - 1] == 'RW') { homeRosterFArray.push(idChart[i]); console.log(i, homeRosterArray[tempVariable - 2])}
                  else if (homeRosterArray[tempVariable - 1] == 'LW') { homeRosterFArray.push(idChart[i]); console.log(i, homeRosterArray[tempVariable - 2])}
                  else (console.log('he does not have a position', tempValue))
                }
              } // end for home idChart loop
              for (i = 0; i < idChart.length; i++) {
                tempValue = 'ID' + idChart[i];
                if (awayRosterArray.includes(tempValue)) {
                  tempVariable = awayRosterArray.indexOf(tempValue);
                  //      console.log(tempVariable, homeRosterArray[tempVariable - 3], homeRosterArray[tempVariable - 1])
                  if (awayRosterArray[tempVariable - 1] == 'D') { awayRosterDArray.push(idChart[i]) }
                  else if (awayRosterArray[tempVariable - 1] == 'G') { awayRosterGArray.push(idChart[i]) }
                  else if (awayRosterArray[tempVariable - 1] == 'C') { awayRosterFArray.push(idChart[i]) }
                  else if (awayRosterArray[tempVariable - 1] == 'RW') { awayRosterFArray.push(idChart[i]); }
                  else if (awayRosterArray[tempVariable - 1] == 'LW') { awayRosterFArray.push(idChart[i]); }
                  else (console.log('he does not have a position', tempValue))
                }
              } // end for away idChart loop
              console.log(homeRosterDArray, homeRosterGArray, homeRosterFArray);
              console.log(awayRosterDArray, awayRosterGArray, awayRosterFArray);
              for (i = 0; i < 3; i++) { tempVar1 = homeRosterFArray.indexOf(homeStartingFLineup[i]);
              homeStartingLineup.push(tempVar1)}
              // console.log(homeStartingLineup)
              //     }
              getDPairs();
              function getDPairs() {
                shiftsArray = [];
                shiftsFArray = [];
                awayShiftsArray = [];
                awayShiftsFArray = [];
                TOIArray = [];
                TOIFArray = [];
                pairingsArray = [];
                linesArray = [];
                for (i = 0; i < homeRosterDArray.length; i++) { shiftsArray.push(totalChart[3 * idChart.indexOf(homeRosterDArray[i])]);
                  awayShiftsArray.push(totalChart[3 * idChart.indexOf(awayRosterDArray[i])]) }
                for (i = 0; i < homeRosterDArray.length; i++) { shiftsArray.push(totalChart[3 * idChart.indexOf(homeRosterDArray[i]) + 1]);
                  awayShiftsArray.push(totalChart[3 * idChart.indexOf(awayRosterDArray[i]) + 1]) }
                for (i = 0; i < homeRosterDArray.length; i++) { shiftsArray.push(totalChart[3 * idChart.indexOf(homeRosterDArray[i]) + 2]);
                  awayShiftsArray.push(totalChart[3 * idChart.indexOf(awayRosterDArray[i]) + 2]) } // end first three for defense loops
                for (i = 0; i < homeRosterFArray.length; i++) { shiftsFArray.push(totalChart[3 * idChart.indexOf(homeRosterFArray[i])]);
                  awayShiftsFArray.push(totalChart[3 * idChart.indexOf(awayRosterFArray[i])]) }
                for (i = 0; i < homeRosterFArray.length; i++) { shiftsFArray.push(totalChart[3 * idChart.indexOf(homeRosterFArray[i]) + 1]);
                  awayShiftsFArray.push(totalChart[3 * idChart.indexOf(awayRosterFArray[i]) + 1]) }
                for (i = 0; i < homeRosterFArray.length; i++) { shiftsFArray.push(totalChart[3 * idChart.indexOf(homeRosterFArray[i]) + 2]); 
                  awayShiftsFArray.push(totalChart[3 * idChart.indexOf(awayRosterFArray[i]) + 2])} // end first three for forward loops
                console.log(shiftsArray, shiftsFArray, awayShiftsArray, awayShiftsFArray);
                for (i = 0; i < shiftsArray.length; i++) {
                  totalShiftLength = 0;
                  tempArray = shiftsArray[i];
                  for (j = 0; j < tempArray.length / 3; j++) {
                    const shiftLength = tempArray[2 * j + 1] - tempArray[2 * j];
                    //      console.log(shiftLength);
                    totalShiftLength = totalShiftLength + shiftLength;
                  } // end j loop
                  TOIArray.push(totalShiftLength);
                } // end i TOIArray D loop
                for (i = 0; i < shiftsFArray.length; i++) {
                  totalShiftLength = 0;
                  tempArray = shiftsFArray[i];
                  for (j = 0; j < tempArray.length / 3; j++) {
                    const shiftLength = tempArray[2 * j + 1] - tempArray[2 * j];
                    //      console.log(shiftLength);
                    totalShiftLength = totalShiftLength + shiftLength;
                  } // end j loop
                  TOIFArray.push(totalShiftLength);
                } // end i TOIFArray loop
            
                tempArray6 = [];
                tempArray4 = shiftsArray.splice(shiftsArray.length / 3);
                tempArray5 = tempArray4.splice(tempArray4.length / 2);
                tempArray6[1] = tempArray4;
                tempArray6[2] = tempArray5;
                tempArray6[0] = shiftsArray;

                for (i = 0; i < tempArray6.length; i++) { 
                  for (j = 0; j < tempArray6[i].length; j++) 
                  { tempArray5 = tempArray6[i];
                    player1 = tempArray5[j]
                    for (k = j + 1; k < tempArray6[i].length; k++) {
                      tempTime = [];
                      player2 = tempArray5[k];
                      for (l = 0; l < 0.5 * player1.length; l++) {
                        tempArray = tempArray5[j];
                        for (m = 0; m < 0.5 * player2.length; m++) {
                          tempArray2 = tempArray5[k];
                          if (tempArray2[2 * m] >= tempArray[2 * l] && tempArray2[2 * m] <= tempArray[2 * l + 1]) {
                            if (tempArray2[2 * m + 1] >= tempArray[2 * l + 1]) { tempTime.push(tempArray[2 * l + 1] - tempArray2[2 * m]) }
                            else { tempTime.push(tempArray2[2 * m + 1] - tempArray2[2 * m]) }
                          }
                          else if (tempArray2[2 * m] <= tempArray[2 * l] && tempArray2[2 * m + 1] >= tempArray[2 * l]) {
                            if (tempArray2[2 * m + 1] >= tempArray[2 * l + 1]) { tempTime.push(tempArray[2 * l + 1] - tempArray[2 * l]) }
                            else { tempTime.push(tempArray2[2 * m + 1] - tempArray[2 * l]) }
                          }
                        }
                      } // end l cycle
                      shifts = 0;
                      const sum = tempTime.reduce((partialSum, a) => partialSum + a, 0);
                      for (n = 0; n < tempTime.length; n++) {
                        if (tempTime[n] >= 10) { shifts = shifts + 1 }
                      }
                      pairingsArray.push(sum);
                      pairingsArray.push(shifts);
                    }
                  }  // end j loop each D player
                } // end i loop for 3 periods
                console.log(pairingsArray);
                // tempArray6 = [];
                tempArray4 = shiftsFArray.splice(shiftsFArray.length / 3);
                tempArray5 = tempArray4.splice(tempArray4.length / 2);
                tempArray6[1] = tempArray4;
                tempArray6[2] = tempArray5;
                tempArray6[0] = shiftsFArray;

                console.log(shiftsFArray, tempArray4, tempArray5, tempArray6);
                for (i = 0; i < tempArray6.length; i++) {
                  for (j = 0; j < tempArray6[i].length; j++) {
                    tempArray5 = tempArray6[i]
                    player1 = tempArray5[j]
                    for (k = j + 1; k < tempArray6[i].length; k++) {
                      tempTime = [];
                      player2 = tempArray5[k];
                      //    console.log(tempArray4);
                      for (l = 0; l < 0.5 * player1.length; l++) {
                        tempArray = tempArray5[j];
                        for (m = 0; m < 0.5 * player2.length; m++) {
                          tempArray2 = tempArray5[k];
                          if (tempArray2[2 * m] >= tempArray[2 * l] && tempArray2[2 * m] <= tempArray[2 * l + 1]) {
                            if (tempArray2[2 * m + 1] >= tempArray[2 * l + 1]) {
                              tempTime.push(tempArray[2 * l + 1] - tempArray2[2 * m]);
                            }
                            else {
                              tempTime.push(tempArray2[2 * m + 1] - tempArray2[2 * m]);
                            }
                          }
                          else if (tempArray2[2 * m] <= tempArray[2 * l] && tempArray2[2 * m + 1] >= tempArray[2 * l]) {
                            if (tempArray2[2 * m + 1] >= tempArray[2 * l + 1]) {
                              tempTime.push(tempArray[2 * l + 1] - tempArray[2 * l])
                            }
                            else {
                              tempTime.push(tempArray2[2 * m + 1] - tempArray[2 * l])
                            }
                          }
                        }
                      } // end l F loop                    
                      shifts = 0;
                      const sum = tempTime.reduce((partialSum, a) => partialSum + a, 0);
                      tempTime2 = [];
                      for (n = 0; n < tempTime.length; n++) {
                        if (tempTime[n] >= 10) {
                          shifts = shifts + 1
                          tempTime2.push(tempTime[n]);
                        }
                      }
                      linesArray.push(sum);
                      linesArray.push(shifts);
                    } // end k F loop
                  } // end j F loop
                } // end i F loop
                 console.log(pairingsArray, TOIArray, linesArray);
                pairingsArray2 = pairingsArray.splice(pairingsArray.length / 3);
                pairingsArray3 = pairingsArray2.splice(pairingsArray2.length / 2)
                
                linesArray2 = linesArray.splice(linesArray.length / 3);
                linesArray3 = linesArray2.splice(linesArray2.length / 2)
                console.log(linesArray, linesArray2, linesArray3, pairingsArray, pairingsArray2, pairingsArray3);
                const maxTime1 = Math.max(...pairingsArray);
                const numberOnePair = pairingsArray.indexOf(maxTime1);
                const tempArray3 = pairingsArray;
                tempArray3[numberOnePair] = 0;
                const maxTime2 = Math.max(...tempArray3);
                const numberTwoPair = tempArray3.indexOf(maxTime2);
                //   const tempArray = pairingsArray;
                tempArray3[numberTwoPair] = 0;
                if (homeRosterDArray.length == 7) { arrayDs = [0, [0, 1], 2, [0, 2], 4, [0, 3], 6, [0, 4], 8, [0, 5], 10, [0, 6], 12, [1, 2], 14, [1, 3], 16, [1, 4], 18, [1, 5], 20, [1, 6], 22, [2, 3], 24, [2, 4], 26, [2, 5], 28, [2, 6], 30, [3, 4], 32, [3, 5], 34, [3, 6], 36, [4, 5], 38, [4, 6], 40, [5, 6]] }
                else if (homeRosterDArray.length == 6) { arrayDs = [0, [0, 1], 2, [0, 2], 4, [0, 3], 6, [0, 4], 8, [0, 5], 10, [1, 2], 12, [1, 3], 14, [1, 4], 16, [1, 5], 18, [2, 3], 20, [2, 4], 22, [2, 5], 24, [3, 4], 26, [3, 5], 28, [4, 5]] }
                else if (homeRosterDArray.length == 5) { arrayDs = [0, [0, 1], 2, [0, 2], 4, [0, 3], 6, [0, 4], 8, [1, 2], 10, [1, 3], 12, [1, 4], 14, [2, 3], 16, [2, 4], 18, [3, 4]] }
                else if (homeRosterDArray.length == 4) { arrayDs = [0, [0, 1], 2, [0, 2], 4, [0, 3], 6, [1, 2], 8, [1, 3], 10, [2, 3]] }

                console.log(numberOnePair, numberTwoPair, arrayDs[numberOnePair + 1], arrayDs[numberTwoPair + 1]);
                // if (arrayDs[numberTwoPair + 1][0] === arrayDs[numberOnePair + 1][0] && arrayDs[numberTwoPair + 1][0] === arrayDs[numberOnePair + 1][1] && arrayDs[numberTwoPair + 1][1] === arrayDs[numberOnePair + 1][0] && arrayDs[numberTwoPair + 1][1] === arrayDs[numberOnePair + 1][1])
                // console.log('something is wrong!', arrayDs[numberTwoPair + 1][0], arrayDs[numberTwoPair + 1][1], arrayDs[numberOnePair + 1][0], arrayDs[numberOnePair + 1][1])
                const maxTime1b = pairingsArray2[numberOnePair];
                const maxTime2b = pairingsArray2[numberTwoPair];
                const maxTime1c = pairingsArray3[numberOnePair];
                const maxTime2c = pairingsArray3[numberTwoPair];

                const topTwo = arrayDs[numberOnePair + 1];
                // console.log(arrayDs, numberOnePair);
                topThree = topTwo.push(arrayDs[numberTwoPair + 1][0]);
                topFour = topTwo.push(arrayDs[numberTwoPair + 1][1]);
                console.log(topTwo);
                DMan1 = topTwo[0];
                DMan2 = topTwo[1];
                DManIndex1 = 'ID' + homeRosterDArray[DMan1];
                DManIndex2 = 'ID' + homeRosterDArray[DMan2];
                DManIndex1a = homeRosterArray.indexOf(DManIndex1);
                DManIndex2a = homeRosterArray.indexOf(DManIndex2);
                DMan3 = topTwo[2];
                DMan4 = topTwo[3];
                DManIndex3 = 'ID' + homeRosterDArray[DMan3];
                DManIndex4 = 'ID' + homeRosterDArray[DMan4];
                DManIndex3a = homeRosterArray.indexOf(DManIndex3);
                DManIndex4a = homeRosterArray.indexOf(DManIndex4);
                topTwo.sort();
                topTwo.reverse();
                topThree = [];
                for (i = 0; i < homeRosterDArray.length; i++) { topThree.push(i) }

                thirdPairTime = [];
                for (i = 0; i < 4; i++) { topThree.splice(topTwo[i], 1) }

                for (i = 0; i < topThree.length; i++) { thirdPairTime.push(TOIArray[topThree[i]]) }
                console.log(topThree.length, topThree);
                if (homeRosterDArray.length == 6) {
                  DMan5 = topThree[0];
                  DMan6 = topThree[1]
                }
                else if (homeRosterDArray.length == 7) {
                  thirdPairTime2 = Math.max(...thirdPairTime);
                  console.log(thirdPairTime, thirdPairTime2, thirdPairTime.indexOf(thirdPairTime2))
                  if (thirdPairTime.indexOf(thirdPairTime2) == 0) {
                    DMan5 = topThree[0];
                    DMan6 = topThree[1];
                    DMan7 = topThree[2]
                  }
                  else if (thirdPairTime.indexOf(thirdPairTime2) == 1) {
                    DMan5 = topThree[0];
                    DMan6 = topThree[2];
                    DMan7 = topThree[1]
                  }
                  else if (thirdPairTime.indexOf(thirdPairTime2) == 2) {
                    DMan5 = topThree[1];
                    DMan6 = topThree[2];
                    DMan7 = topThree[0]
                  }
                }
                const tempVar1 = thirdPairTime.reduce((iMax, currentValue, currentIndex, arr) => currentValue > arr[iMax] ? currentIndex : iMax, 0); // idea was to find max of thirdPairTime and delete do not need it anymore
                // tempVar = thirdPairTime.findIndex(tempVar1);
                DManIndex5 = 'ID' + homeRosterDArray[DMan5];
                DManIndex6 = 'ID' + homeRosterDArray[DMan6];
                DManIndex5a = homeRosterArray.indexOf(DManIndex5);
                DManIndex6a = homeRosterArray.indexOf(DManIndex6);
                for (i = 0; i < arrayDs.length / 2; i++) {

                  if (arrayDs[2 * i + 1][0] == DMan5 && arrayDs[2 * i + 1][1] == DMan6) {
                    numberThreePair = 2 * i;
                    console.log(i, topThree[0], topThree[1], pairingsArray[2 * i], pairingsArray2[2 * i], pairingsArray3[2 * i])
                  }
                }
                const maxTime3b = pairingsArray2[numberThreePair];
                const maxTime3c = pairingsArray3[numberThreePair];
                const maxTime3 = pairingsArray[numberThreePair];

                //tempArray7 = [];
                // DMan5 = topThree[tempVar1];
                console.log(DMan5, DMan6, tempVar1, topThree, thirdPairTime);

                //DMan6 = topThree[1];

                console.log(topThree, thirdPairTime, DMan5, topTwo, homeRosterDArray.length);

                var firstPair = document.createElement('p');
                firstPair.innerHTML = homeRosterArray[DManIndex1a - 2] + ' ' + homeRosterArray[DManIndex2a - 2] + ' ' + pairingsArray[numberOnePair + 1] + ' shifts ' + maxTime1 + ' seconds ' + pairingsArray2[numberOnePair + 1] + ' shifts ' + maxTime1b + ' seconds ' + pairingsArray3[numberOnePair + 1] + ' shifts ' + maxTime1c + ' seconds ';
                document.getElementById('gameInfo').appendChild(firstPair);
                var secondPair = document.createElement('p');
                secondPair.innerHTML = homeRosterArray[DManIndex3a - 2] + ' ' + homeRosterArray[DManIndex4a - 2] + ' ' + pairingsArray[numberTwoPair + 1] + ' shifts ' + maxTime2 + ' seconds ' + pairingsArray2[numberTwoPair + 1] + ' shifts ' + maxTime2b + ' seconds ' + pairingsArray3[numberTwoPair + 1] + ' shifts ' + maxTime2c + ' seconds ';
                document.getElementById('gameInfo').appendChild(secondPair);
                var thirdPair = document.createElement('p');
                thirdPair.innerHTML = homeRosterArray[DManIndex5a - 2] + ' ' + homeRosterArray[DManIndex6a - 2] + ' ' + pairingsArray[numberThreePair + 1] + ' shifts ' + maxTime3 + ' seconds ' + pairingsArray2[numberThreePair + 1] + ' shifts ' + maxTime3b + ' seconds ' + pairingsArray3[numberThreePair + 1] + ' shifts ' + maxTime3c + ' seconds ';
                document.getElementById('gameInfo').appendChild(thirdPair);
               
                gammaFunction = [0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66]
                // jstart = 0;
                // if (lineOne.includes(0) && lineOne.includes(1) && lineOne.includes(2)) { jstart = 1 }
                for (i = 0; i < 1; i++) { // period cycle starts set to 1 currectly
                  processedPlayers = [];
                  lineCombinations = [];
                
                for (j = 0; j < homeRosterFArray.length - 1; j++) { 
                  tempArray6 = [];
                  tempArray4 = [];
                  for (k = j * homeRosterFArray.length - gammaFunction[j]; k < (j + 1) * homeRosterFArray.length - gammaFunction[j+1]; k++)
                  { 
                  tempArray6.push(linesArray[2 * k]); 
                  tempArray4.push(linesArray[2 * k]);
                  
                  }  // end k cycle
                  // tempArray4 = tempArray6;
                  if (!processedPlayers.includes(j)){
                  console.log(j, tempArray6);
                  forwardTime = Math.max(...tempArray6);
                  tempIndex = tempArray6.indexOf(forwardTime);
                  tempArray5 = tempArray4.splice(tempIndex,1);
                  forwardTime2 = Math.max(...tempArray4);
                  tempIndex2 = tempArray6.indexOf(forwardTime2);
                  if (forwardTime == forwardTime2) {
                    tempIndex2 = tempArray6.indexOf(forwardTime2, tempIndex + 1);
                  console.log('equal time', tempIndex, tempIndex2)
                  }
                  
                  // console.log(tempArray6, tempArray4, tempArray5, forwardTime, tempIndex + 1, forwardTime2, tempIndex2 + 1);
                  console.log(tempArray6[tempIndex2]);
                  if (tempArray6[tempIndex2] > 147) {
                    lineOne = [j, tempIndex + 1 + j, tempIndex2 + 1 + j]; 
                    processedPlayers.push(j, tempIndex + 1 + j, tempIndex2 + 1 + j);
                    lineCombinations.push(lineOne);
                    console.log(lineOne, processedPlayers, lineCombinations)}
                    else (console.log ('forward ', j, ' did not play enough shifts' ))                    
                  } // end processedPlayers if cycle 150 or 147
                  
                    }
                } // end j cycle
                
                 topThree = [];
                  for (k = 0; k < homeRosterFArray.length; k++) { topThree.push(k) }
                  processedPlayers.sort(function(a, b){return b - a});
                  console.log(processedPlayers);
                  for (k = 0; k < processedPlayers.length; k++) { topThree.splice(processedPlayers[k], 1);
                    console.log(topThree) }
                    var firstLine = document.createElement('p1');
                    // console.log(homeRosterFArray + lineCombinations[0] + lineCombinations[0][0] + lineCombinations[0][1] + lineCombinations[0][2])
                    FManIndex1 = 'ID' + homeRosterFArray[lineCombinations[0][0]];
                    FManIndex2 = 'ID' + homeRosterFArray[lineCombinations[0][1]];
                    FManIndex3 = 'ID' + homeRosterFArray[lineCombinations[0][2]];
                    FManIndex1a = homeRosterArray.indexOf(FManIndex1);
                    FManIndex2a = homeRosterArray.indexOf(FManIndex2);
                    FManIndex3a = homeRosterArray.indexOf(FManIndex3);
                    console.log(FManIndex1, FManIndex2, FManIndex3, FManIndex1a, FManIndex2a, FManIndex3a);
                 firstLine.innerHTML = homeRosterArray[FManIndex1a - 2] + ' ' + homeRosterArray[FManIndex2a - 2] + ' ' + homeRosterArray[FManIndex3a - 2] + ' ';
                 document.getElementById('gameInfo').appendChild(firstLine);
                 if (lineCombinations.length > 1){
                  var secondLine = document.createElement('p1');
                  // console.log(homeRosterFArray + lineCombinations[0] + lineCombinations[0][0] + lineCombinations[0][1] + lineCombinations[0][2])
                  FManIndex4 = 'ID' + homeRosterFArray[lineCombinations[1][0]];
                  FManIndex5 = 'ID' + homeRosterFArray[lineCombinations[1][1]];
                  FManIndex6 = 'ID' + homeRosterFArray[lineCombinations[1][2]];
                  FManIndex4a = homeRosterArray.indexOf(FManIndex4);
                  FManIndex5a = homeRosterArray.indexOf(FManIndex5);
                  FManIndex6a = homeRosterArray.indexOf(FManIndex6);
                  console.log(FManIndex4, FManIndex5, FManIndex6, FManIndex4a, FManIndex5a, FManIndex6a);
               secondLine.innerHTML = homeRosterArray[FManIndex4a - 2] + ' ' + homeRosterArray[FManIndex5a - 2] + ' ' + homeRosterArray[FManIndex6a - 2] + ' ';
               document.getElementById('gameInfo').appendChild(secondLine);

                 }
                  
                 // end i cycle for each period, set to period 1 now
              } // end function getDPairs Joel Henley was dressed as F on 11/19 against NYI he missed entire 3rd period
            });
        }
      }
    }
    );
}