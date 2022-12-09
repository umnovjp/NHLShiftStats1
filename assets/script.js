var scheduleContent = document.getElementById('schedule');
var gameId;
var inputVal = '2021';
const homeRosterArray = [];
const awayRosterArray = [];
const homeRosterIdArray = [];
const awayRosterIdArray = [];
// var rosterArray;

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
          "method": "GET", "headers": {}  })
    .then(function (response) {
      return response.json();   })
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
                  "method": "GET", "headers": {  }
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
          //  playerShifts ={};
            totalChart = [];
            idChart = [];
               for (i = 0; i < data.data.length - 1; i++) {
                   if (data.data[i].typeCode === 517) {
                 // fullName = data.data[i].firstName + data.data[i].lastName
                  // console.log(data.data[i].startTime, typeof data.data[i].startTime, 'i= ',i, ' ', fullName)
               
                 const playerId = data.data[i].playerId; 
                  if (data.data[i].playerId == data.data[i+1].playerId)
                  {if (data.data[i].period == 1)
                    { shiftStart = data.data[i].startTime;                      
                      shiftStart1 = shiftStart.split(':');
                      minutes = Number(shiftStart1[0]);
                      seconds = Number(shiftStart1[1]);                      
                      shiftStart2 = minutes*60 + seconds;
                      playerChart1.push(shiftStart2);
                      shiftEnd = data.data[i].endTime;                      
                      shiftEnd1 = shiftEnd.split(':');
                      minutes = Number(shiftEnd1[0]);
                      seconds = Number(shiftEnd1[1]);                      
                      shiftEnd2 = minutes*60 + seconds;
                      playerChart1.push(shiftEnd2)  
                    if (shiftStart2 == 0) 
                  {startingLineup.push(data.data[i].playerId)}
                  }
                  
                    else if (data.data[i].period == 2)
                    { playerChart2.push(data.data[i].startTime) }
                    else if (data.data[i].period == 3)
                    { playerChart3.push(data.data[i].startTime) }
                    else {console.log ('shift not added')}
                    } //, data.data[i].endTime, data.data[i].duration
                
                 else { 
                  if (data.data[i].period == 3)
                  { playerChart3.push(data.data[i].startTime); }
                  else if (data.data[i].period == 2)
                  { playerChart2.push(data.data[i].startTime); }
                  else if (data.data[i].period == 1)
                  { playerChart1.push(data.data[i].startTime); }
                  else {console.log('error in adding last shift')}
                  totalChart.push(playerChart1);
                  totalChart.push(playerChart2);
                  totalChart.push(playerChart3);
                  idChart.push(playerId);
                   playerChart1 = [];
                   playerChart2 = [];
                   playerChart3 = [];
                  
                   }                
                    //     playerShifts = Object.assign (playerId, totalChart);
                   //  console.log(playerShifts);
                  // startTime2 = data.data[i].startTime.split("");
                  // endTime2 = data.data[i].endTime.split("");
                  // startTime3 = startTime2[0];
                  // startTime4 = Number(startTime3);
                  // startTime5 = startTime4 + 2;
                  // startTime6 = startTime5.toString();
                  // startTime2[0] = startTime6;
                  // startJoin = startTime2.join("");
                  // endTime3 = endTime2[0];
                  // endTime4 = Number(endTime3);
                  // endTime5 = endTime4 + 2;
                  // endTime6 = endTime5.toString();
                  // endTime2[0] = endTime6;
                  // endJoin = endTime2.join("");
                  // console.log(startJoin, endJoin);
                 //   playerChart.push(data.data[i].startTime, data.data[i].endTime, data.data[i].duration)
                  }
               }
               console.log(startingLineup);
               console.log(totalChart, idChart);
               console.log(homeRosterIdArray, awayRosterIdArray)
               for (i = 0; i < 12; i++)
               { tempVariable = startingLineup[i];
            //    console.log(tempVariable, i);
                tempString = tempVariable.toString();   
            //    console.log(tempString, typeof tempString);
                if (homeRosterIdArray.includes(tempString))
              {
                console.log(homeRosterIdArray.indexOf(tempString), 'home')}
                  else if (awayRosterIdArray.includes(tempString))
                  {
                    console.log(awayRosterIdArray.indexOf(tempString), 'away')}
                  else {console.log(tempString, 'fatal')}
            }
       //     }
            
            // #23 1:20-2:30, 5:06-5:41, 7:11-7:28, 9:29-10:12, 14:48-15:30
            // #2 1:20-2:30, 5:06-5:48, 7:16-7:19, 7:32-8:14, 9:29-10:09, 14:48=15:30
            // #4 00:32-1:20, 4:43-5:06, 5:48-6:30, 7:28-9:01, 10:10-11:46 1st two seconds late, 
            // #6 00:29-1:20, 4:44-5:06, 5:41-6:30, 8:14-9:02, 10:10-11:10
            // #5 00:00-00:30, 2:30-4:44, 6:30-7:16, 7:19-7:32, 9:01-9:29, 11:10-11:41
            // #20 00:00-00:29, 2:30-4:43, 6:30-7:11, 9:02-9:29, 11:46-12:41


            // 3, 6,9, 9.5, 
            // 2,5, 7
            // 1,4,8, 9.5, 
            });
        }
      }
    }
    );
}