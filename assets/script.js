var scheduleContent = document.getElementById('schedule');
var gameId;
var inputVal = '2021';
const homeRosterArray = [];
const awayRosterArray = [];
//const fs = require('fs');
var rosterArray;

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
        console.log(idx);
        gameName.innerHTML = 'Game ' + i + ': ' + data.dates[0].games[i].teams.away.team.name + ' ' + data.dates[0].games[i].teams.away.leagueRecord.wins + 'W ' + data.dates[0].games[i].teams.away.leagueRecord.losses + 'L ' + data.dates[0].games[i].teams.away.leagueRecord.ot + 'O vs ' + data.dates[0].games[i].teams.home.team.name + ' ' + data.dates[0].games[i].teams.home.leagueRecord.wins + 'W ' + data.dates[0].games[i].teams.home.leagueRecord.losses + 'L ' + data.dates[0].games[i].teams.home.leagueRecord.ot + 'O ';
        document.getElementById('schedule').appendChild(gameName);
        gameName.addEventListener('click', displayGameData);
      }

      function displayGameData(event) {
        idx = event.currentTarget;
        console.log(typeof idx)
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
            // var penaltyButton = document.createElement('button');
            // penaltyButton.setAttribute('class', 'searchParameter');
            // penaltyButton.textContent = 'Print Penalties';
            // document.getElementById('gameInfo').appendChild(penaltyButton);
            // penaltyButton.addEventListener('click', getPenalties);

            var goalButton = document.createElement('button');
            goalButton.setAttribute('class', 'searchParameter');
            goalButton.textContent = 'Print Goals';
            document.getElementById('gameInfo').appendChild(goalButton);
            goalButton.addEventListener('click', getGoals);

            var rosterButton = document.createElement('button');
            rosterButton.setAttribute('class', 'searchParameter');
            rosterButton.textContent = 'Print Rosters';
            document.getElementById('gameInfo').appendChild(rosterButton);
            rosterButton.addEventListener('click', getRoster);

            // var faceoffButton = document.createElement('button');
            // faceoffButton.setAttribute('class', 'searchParameter');
            // faceoffButton.textContent = 'Get faceoffs stats';
            // document.getElementById('gameInfo').appendChild(faceoffButton);
            // faceoffButton.addEventListener('click', getFaceoffs);

            // var blockedButton = document.createElement('button');
            // blockedButton.setAttribute('class', 'searchParameter');
            // blockedButton.textContent = 'Print Blocked Shots';
            // document.getElementById('gameInfo').appendChild(blockedButton);
            // blockedButton.addEventListener('click', getBlockedShots);

            // var missedButton = document.createElement('button');
            // missedButton.setAttribute('class', 'searchParameter');
            // missedButton.textContent = 'Print Missed Shots';
            // document.getElementById('gameInfo').appendChild(missedButton);
            // missedButton.addEventListener('click', getMissedShots);

            // var shotsButton = document.createElement('button');
            // shotsButton.setAttribute('class', 'searchParameter');
            // shotsButton.textContent = 'Print Shots';
            // document.getElementById('gameInfo').appendChild(shotsButton);
            // shotsButton.addEventListener('click', getShots);

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
              //   var newChart = document.createElement('canvas');
              //   newChart.setAttribute('height', '400px');
              //   newChart.setAttribute('width', '500px');
              // document.getElementById('goalsChart').appendChild(newChart);
              //   var arrayGoals = [{x: -58, y: 11}, {x: -90, y: -6}]

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
        // function getPenalties(event) {

        //   var requestURL = 'https://statsapi.web.nhl.com/api/v1/game/' + gameId + '/feed/live';
        //   fetch(requestURL, {
        //     "method": "GET", "headers": {
        //       //   "x-rapidapi-host": "data-imdb1.p.rapidapi.com",
        //       //   "x-rapidapi-key": "f567ffdbe0msh246ba4a9ef34553p1195c8jsn6e946070d30d"
        //     }
        //   })

        //     .then(function (response) {
        //       return response.json();
        //     })
        //     .then(function (data) {
        //       console.log('I am in second then')

        //       awayTeam1 = data.gameData.teams.away.id;
        //       homeTeam1 = data.gameData.teams.home.id;

        //       // var awayTeam = document.createElement('p');
        //       // awayTeam.innerHTML = data.gameData.teams.away.name + ' vs ' + data.gameData.teams.home.name;
        //       // document.getElementById('input2').appendChild(awayTeam);
        //       var penaltyTitle = document.createElement('h3');
        //       penaltyTitle.setAttribute('id', 'drama');
        //       penaltyTitle.innerHTML = 'Penalties - penalty location figure will be added';
        //       document.getElementById('gameInfo').appendChild(penaltyTitle);

        //       //   console.log(data.gameData.players.keys);
        //       var obj = data.gameData.players;
        //       var keys = Object.keys(obj);

        //       console.log(data.liveData.decisions);
        //       console.log(data.liveData.linescore);

        //       console.log(data.liveData.plays.allPlays.length);
        //       console.log(data.liveData.plays.penaltyPlays.length);
        //       console.log(data.liveData.plays.scoringPlays.length);
        //       const arraypenalties = [];

        //       for (i = 0; i < data.liveData.plays.penaltyPlays.length; i++) {
        //         penaltyPlay = data.liveData.plays.penaltyPlays[i];
        //         var penaltyData = document.createElement('p');

        //         penaltyData.innerHTML = ' Period: ' + data.liveData.plays.allPlays[penaltyPlay].about.period + ' Time: ' + data.liveData.plays.allPlays[penaltyPlay].about.periodTime + ', ' + data.liveData.plays.allPlays[penaltyPlay].result.penaltyMinutes + ' minutes, ' + 'Penalty Location: ' + data.liveData.plays.allPlays[penaltyPlay].coordinates.x + ' : ' + data.liveData.plays.allPlays[penaltyPlay].coordinates.y;
        //         document.getElementById('gameInfo').appendChild(penaltyData);
        //         var coordinates = { x: data.liveData.plays.allPlays[penaltyPlay].coordinates.x, y: data.liveData.plays.allPlays[penaltyPlay].coordinates.y };
        //         arraypenalties.push(coordinates);
        //         //    console.log(arraypenalties);

        //         for (j = 0; j < data.liveData.plays.allPlays[penaltyPlay].players.length; j++) {
        //           //     console.log(data.liveData.plays);
        //           var penaltyEvent2 = document.createElement('span');
        //           penaltyEvent2.innerHTML = data.liveData.plays.allPlays[penaltyPlay].result.description;
        //           document.getElementById('gameInfo').appendChild(penaltyEvent2);
        //         }
        //       }
        //       new Chart("penaltyChart", {
        //         type: "scatter",
        //         data: {
        //           datasets: [{
        //             pointRadius: 4,
        //             pointBackgroundColor: "rgb(0,0,255)",
        //             data: arraypenalties
        //           }]
        //         },
        //         options: {
        //           legend: { display: false },
        //           scales: {
        //             xAxes: [{ ticks: { min: -100, max: 100 } }],
        //             yAxes: [{ ticks: { min: -42.5, max: 42.5 } }],
        //           }
        //         }
        //       });
        //     });
        //   //        console.log(arraypenalties);

        // }
        function getRoster(event) {
          var genre = event.currentTarget.value;
          console.log('u r in get roster');

          var requestURL = 'https://statsapi.web.nhl.com/api/v1/game/' + gameId + '/feed/live';
          fetch(requestURL, {
            "method": "GET", "headers": {
            }
          })

            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              console.log(data.gameData.players)

              var obj = data.gameData.players;
              var keys = Object.keys(obj);

              var awayRoster = document.createElement('h2');
              awayRoster.innerHTML = data.gameData.teams.away.name + ' Roster ';
              awayRoster.setAttribute('id', 'awayTeamId');
              document.getElementById('gameInfoAway').appendChild(awayRoster);

              var homeRoster = document.createElement('h2');
              homeRoster.innerHTML = data.gameData.teams.home.name + ' Roster ';
              homeRoster.setAttribute('id', 'homeTeamId');
              document.getElementById('gameInfoHome').appendChild(homeRoster);
              const homeRosterArray = [];
              const awayRosterArray = [];

              for (var i = 0; i < keys.length; i++) {
                var val = obj[keys[i]];
                const playerName1 = val.fullName;
                const lastName = val.lastName;
                const primaryNumber1 = val.primaryNumber;
                const tempAttribute = playerName1;
                var playerName = document.createElement('p');
                if (val.primaryPosition.code == 'G')
                {playerName.innerHTML = val.primaryNumber + ' ' + val.fullName + ', ' + val.primaryPosition.code + ' catches:' + val.shootsCatches + ','}
                else 
                {playerName.innerHTML = val.primaryNumber + ' ' + val.fullName + ', ' + val.primaryPosition.code + ' shoots:' + val.shootsCatches + ','};
                playerName.setAttribute('id', tempAttribute);
                if (val.currentTeam.id == data.gameData.teams.away.id) {
                  document.getElementById('awayTeamId').appendChild(playerName);
                  awayRosterArray.push(primaryNumber1);
                  awayRosterArray.push(playerName1);
                  rosterArray = awayRosterArray;
                }
                else if (val.currentTeam.id == data.gameData.teams.home.id) {
                  //    console.log(val.fullName + ' ' + val.currentTeam.name + ' ' + val.currentTeam.id + data.gameData.teams.home.id);
                  document.getElementById('homeTeamId').appendChild(playerName);
                  homeRosterArray.push(primaryNumber1);
                  homeRosterArray.push(playerName1);
                }
              }
              console.log(homeRosterArray);
              console.log(awayRosterArray);
            });
        }
        // function getFaceoffs(event) {
        //   var requestURL = 'https://statsapi.web.nhl.com/api/v1/game/' + gameId + '/feed/live';
        //   fetch(requestURL, {
        //     "method": "GET"
        //   })
        //     .then(function (response) {
        //       return response.json();
        //     })
        //     .then(function (data) {
        //       console.log(data.liveData.plays);
        //       console.log(gameId);

        //       for (i = 0; i < data.liveData.plays.allPlays.length; i++) {
        //         if (data.liveData.plays.allPlays[i].result.event == 'Faceoff') {
        //           //    console.log(data.liveData.plays.allPlays[i].result);
        //           const descript = data.liveData.plays.allPlays[i].result.description
        //           descriptArray = descript.split(' faceoff');
        //           descriptArray2 = descriptArray[1].split('against ');
        //           fullNameWon = descriptArray[0];
        //           FullNameLost = descriptArray2[1];
        //           //  console.log(fullNameWon + 'lost ' + FullNameLost);
        //           var foWin = document.createElement('span');
        //           var foLoss = document.createElement('span');
        //           foWin.innerHTML = 'FW,';
        //           foLoss.innerHTML = 'FL,';
        //           document.getElementById(fullNameWon).appendChild(foWin);
        //           document.getElementById(FullNameLost).appendChild(foLoss);
        //         }
        //       }
        //     });
        // }

        // function getShots(event) {
        //   var requestURL = 'https://statsapi.web.nhl.com/api/v1/game/' + gameId + '/feed/live';
        //   fetch(requestURL, {
        //     "method": "GET"
        //   })
        //     .then(function (response) {
        //       return response.json();
        //     })
        //     .then(function (data) {
        //       console.log(data.liveData.plays);
        //       console.log(gameId);
        //       const arrayShotsHome = [];
        //       const arrayShotsRoad = [];
        //       const arrayShots = [];

        //       for (i = 0; i < data.liveData.plays.allPlays.length; i++) {
        //         if (data.liveData.plays.allPlays[i].result.event == 'Shot') {
        //   //          console.log(data.liveData.plays.allPlays[i].players);
        //             fullNameShooter = data.liveData.plays.allPlays[i].players;
        //           const onestring = data.liveData.plays.allPlays[i].players;
        //           const one = JSON.stringify(onestring);        
        //           testArray = one.split("fullName");
        //           name1 = testArray[1].slice(3);
        //           name1array = name1.split('"');
        //           fullNameShooter = name1array[0];
        //           name2 = testArray[2].slice(3);
        //           name2array = name2.split('"');
        //           fullNameSavior = name2array[0];
        //  //         console.log(testArray, fullNameShooter, fullNameSavior);
        //  //         console.log(data.liveData.plays.allPlays[i].coordinates);
        //           var foWin = document.createElement('span');
        //           var foLoss = document.createElement('span');
        //           foWin.innerHTML = 'SH,';
        //           foLoss.innerHTML = 'SV,';
        //           var check1 = document.getElementById(fullNameShooter);
        //           var check2 = document.getElementById(fullNameSavior);
        //           if (check1 == null || check2 == null)
        //           {console.log('error in shots', fullNameShooter)} //Daniel Sprong
        //           else {
        //           document.getElementById(fullNameShooter).appendChild(foWin);
        //           document.getElementById(fullNameSavior).appendChild(foLoss);
        //       console.log(fullNameShooter, fullNameSavior)}
        //           var coordinates = { x: data.liveData.plays.allPlays[i].coordinates.x, y: data.liveData.plays.allPlays[i].coordinates.y };
        //           arrayShots.push(coordinates);
        //           if (document.getElementById('gameInfoAway').textContent.includes(fullNameShooter))
        //           {arrayShotsRoad.push(coordinates)}
                  
        //            else if (document.getElementById('gameInfoHome').textContent.includes(fullNameShooter))
        //            {arrayShotsHome.push(coordinates)} 
        //            else console.log('error');
        //         }
        //       }
        //   //           console.log(arrayShots);
        //       new Chart("shotsChart", {
        //         type: "scatter",
        //         data: {
        //           datasets: [{
        //             pointRadius: 4,
        //             pointBackgroundColor: "rgb(0,0,255)",
        //             data: arrayShotsHome                    
        //           },
        //           {
        //             pointRadius: 4,
        //             pointBackgroundColor: "rgb(0,255,0)",
        //             data: arrayShotsRoad               
        //           }
        //         ]
        //         },
        //         options: {
        //           legend: { display: true,
        //           text: 'Road team' },                
        //             title: {
        //                 display: true,
        //                 text: 'Shots on goals'                  
        //         },
        //           scales: {
        //             xAxes: [{ ticks: { min: -100, max: 100 } }],
        //             yAxes: [{ ticks: { min: -42.5, max: 42.5 } }],
        //           }
        //         }
        //       });
        //       console.log(arrayShotsHome);
        //            console.log(arrayShotsRoad);
        //     });
        // }

        // function getBlockedShots(event) {
        //   var requestURL = 'https://statsapi.web.nhl.com/api/v1/game/' + gameId + '/feed/live';
        //   fetch(requestURL, {
        //     "method": "GET"
        //   })
        //     .then(function (response) {
        //       return response.json();
        //     })
        //     .then(function (data) {
        //       const arrayBlockedShotsHome = [];
        //       const arrayBlockedShotsRoad = [];
        //       for (i = 0; i < data.liveData.plays.allPlays.length; i++) {
        //         if (data.liveData.plays.allPlays[i].result.event == 'Blocked Shot') {
        //           const descript = data.liveData.plays.allPlays[i].result.description;
        //           descriptArray = descript.split(' shot');
        //           descriptArray2 = descriptArray[2].split('by ');
        //           fullNameShooter = descriptArray[0];
        //           fullNameBlocker = descriptArray2[1];
        //           var foWin = document.createElement('span');
        //           var foLoss = document.createElement('span');
        //           foWin.innerHTML = 'BL,'; // + data.liveData.plays.allPlays[i].coordinates.x + ':' + data.liveData.plays.allPlays[i].coordinates.y + ','
        //           foLoss.innerHTML = 'SB,';//<p id="Robby Fabbri">14 Robby Fabbri, C shoots or catches:L,</p>
        //           var check1 = document.getElementById(fullNameBlocker);
        //           var check2 = document.getElementById(fullNameShooter);
        //           if (check1 == null || check2 == null)
        //           {console.log('error in blocked')}
        //           else {
        //           document.getElementById(fullNameBlocker).appendChild(foWin); //Gustav Forsling shot blocked shot by Robby Fabbri
        //           document.getElementById(fullNameShooter).appendChild(foLoss); //    Pius Suter shot blocked shot by Radko Gudas Robby Fabbri Robby Fabbri
        //           console.log(foLoss.textContent, fullNameShooter);
        //           }
        //           var coordinates = { x: data.liveData.plays.allPlays[i].coordinates.x, y: data.liveData.plays.allPlays[i].coordinates.y };
        //         //  arrayBlockedShots.push(coordinates);
        //           if (document.getElementById('gameInfoAway').textContent.includes(fullNameShooter))
        //           {arrayBlockedShotsRoad.push(coordinates)}                  
        //            else if (document.getElementById('gameInfoHome').textContent.includes(fullNameShooter))
        //            {arrayBlockedShotsHome.push(coordinates)} 
        //            else console.log('error in missed');
        //         }
        //       }
        //       new Chart("blockedShotsChart", {
        //         type: "scatter",
        //         data: {
        //           datasets: [{
        //             pointRadius: 4,
        //             pointBackgroundColor: "rgb(0,0,255)",
        //             data: arrayBlockedShotsHome                    
        //           },
        //           {
        //             pointRadius: 4,
        //             pointBackgroundColor: "rgb(0,255,0)",
        //             data: arrayBlockedShotsRoad               
        //           }
        //         ]
        //         },
        //         options: {
        //           legend: { display: true,
        //           text: 'trial text'},                
        //             title: {
        //                 display: true,
        //                 text: 'Blocked Shots on goals'                  
        //         },
        //           scales: {
        //             xAxes: [{ ticks: { min: -100, max: 100 } }],
        //             yAxes: [{ ticks: { min: -42.5, max: 42.5 } }],
        //           }
        //         }
        //       });
        //       console.log(arrayBlockedShotsHome);
        //       console.log(arrayBlockedShotsRoad);
        //     });

        //   const currentPlayer = document.getElementById(rosterArray[29]);

        //   // var playerData = {BShot: count1, SBlock: count2}; // Uncaught (in promise) TypeError: Assignment to constant variable. at script.js:395:17
        //   //    string0 = JSON.stringify(currentPlayer)
        //   //   const array1 = string0.split("</span>");

        //   console.log(currentPlayer.textContent);

        //   currentPlayerArray = currentPlayer.textContent.split(',');
        //   console.log(currentPlayerArray);
        //   count1 = 0;
        //   count2 = 0;
        //   count3 = 0;
        //   count4 = 0;
        //   count5 = 0;
        //   count6 = 0;
        //   count7 = 0;
        //   for (i = 0; i < currentPlayerArray.length; i++) {

        //     if (currentPlayerArray[i] == 'FW')
        //       count1++;
        //     else if (currentPlayerArray[i] == 'FL')
        //       count2++;
        //     else if (currentPlayerArray[i] == 'GO')
        //       count3++;
        //     else if (currentPlayerArray[i] == 'AS')
        //       count4++;
        //     else if (currentPlayerArray[i] == 'SB')
        //       count5++;
        //     else if (currentPlayerArray[i] == 'BL')
        //       count6++;
        //     else if (currentPlayerArray[i] == 'MO')
        //       count7++;
        //     else if (currentPlayerArray[i] == 'MW')
        //       count7++;
        //   }
        //   console.log(count1, count2, count3, count4, count5, count6, count7);

        //   // const array2 = 
        //   //  console.log(array1);

        // }
        // function getMissedShots(event) {
        //   var requestURL = 'https://statsapi.web.nhl.com/api/v1/game/' + gameId + '/feed/live';
        //   fetch(requestURL, {
        //     "method": "GET"
        //   })
        //     .then(function (response) {
        //       return response.json();
        //     })
        //     .then(function (data) {
        //       const arrayMissedShotsHome = [];
        //       const arrayMissedShotsRoad = [];
        //       for (i = 0; i < data.liveData.plays.allPlays.length; i++) {
        //         if (data.liveData.plays.allPlays[i].result.event == 'Missed Shot') {       
        //           const descript = data.liveData.plays.allPlays[i].result.description;
        //           if (descript.includes(' Wide of Net')) {
        //             descriptArray = descript.split(' Wide of Net');
        //             fullNameMissed = descriptArray[0];                    
        //             var foWin = document.createElement('span');
        //             foWin.innerHTML = 'MW,' + data.liveData.plays.allPlays[i].coordinates.x + ':' + data.liveData.plays.allPlays[i].coordinates.y +',';
        //             console.log(fullNameMissed, foWin.innerHTML);
        //             const check = document.getElementById(fullNameMissed);
        //             if (check == null)
        //             {console.log('error in missed', fullNameMissed)}
        //             else {
        //             document.getElementById(fullNameMissed).appendChild(foWin);
        //             }
        //           }
        //           else if (descript.includes(' Over Net')) {
        //             descriptArray = descript.split(' Over Net');
        //             console.log(descriptArray);
        //             fullNameMissed = descriptArray[0];
        //             var foWin = document.createElement('span');
        //             foWin.innerHTML = 'MO,' + data.liveData.plays.allPlays[i].coordinates.x + ':' + data.liveData.plays.allPlays[i].coordinates.y +',';
        //           }
        //             var check1 = document.getElementById(fullNameMissed);
        //       //    var check2 = document.getElementById(fullNameShooter);
        //           if (check1 == null)
        //           {console.log('error in missed', fullNameMissed)}
        //           else {
        //             document.getElementById(fullNameMissed).appendChild(foWin);
        //           }
        //           var coordinates = { x: data.liveData.plays.allPlays[i].coordinates.x, y: data.liveData.plays.allPlays[i].coordinates.y };
        //           if (document.getElementById('gameInfoAway').textContent.includes(fullNameMissed))
        //           {arrayMissedShotsRoad.push(coordinates);

        //           }                  
        //            else if (document.getElementById('gameInfoHome').textContent.includes(fullNameMissed))
        //            {arrayMissedShotsHome.push(coordinates)} 
        //            else console.log('error in missed', fullNameMissed);
        //           //  var coord = document.createElement('span');
        //           //  coord2 = JSON. stringify(coordinates);
        //           //  coord.innerHTML = coord2;
        //           //  document.getElementById(fullNameMissed).appendChild(coord);
        //            new Chart("missedShotsChart", {
        //             type: "scatter",
        //             data: {
        //               datasets: [{
        //                 pointRadius: 4,
        //                 pointBackgroundColor: "rgb(0,0,255)",
        //                 data: arrayMissedShotsHome                    
        //               },
        //               {
        //                 pointRadius: 4,
        //                 pointBackgroundColor: "rgb(0,255,0)",
        //                 data: arrayMissedShotsRoad               
        //               }
        //             ]
        //             },
        //             options: {
        //               legend: { display: true,
        //               text: 'Road team' },                
        //                 title: {
        //                     display: true,
        //                     text: 'Shots on goals'                  
        //             },
        //               scales: {
        //                 xAxes: [{ ticks: { min: -100, max: 100 } }],
        //                 yAxes: [{ ticks: { min: -42.5, max: 42.5 } }],
        //               }
        //             }
        //           });
        //         }
        //       }
        //       console.log(arrayMissedShotsHome);
        //       console.log(arrayMissedShotsRoad);
        //     });

        // }
      }
    }
    );
}




function getShifts(event) {
  // var requestURL = './assets/shiftcharts.json'; // former fetch https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=2021020722
  // fetch(requestURL, {
  //  "mode": "no-cors",
  //  'credentials': 'omit',
  //   "method": "GET", "headers": {
  //    'Content-Type': 'application/json; charset=utf-8',
  //     'Access-Control-Allow-Origin': 'https://www.google.com',
  //  //     'redirect': 'follow',
  // //      'body': 'JSON.stringify(data)'
  //   }
  // })
  fetch('./assets/shiftcharts.json')

    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      // var obj = data.gameData.players;
      // var keys = Object.keys(obj);

      // var awayRoster = document.createElement('h2');
      // awayRoster.innerHTML = data.gameData.teams.away.name + ' Roster ';
      // awayRoster.setAttribute('id', 'awayTeamId');
      // document.getElementById('input2').appendChild(awayRoster);

      // var homeRoster = document.createElement('h2');
      //   homeRoster.innerHTML = data.gameData.teams.home.name + ' Roster ';
      //   homeRoster.setAttribute('id', 'homeTeamId');
      //   document.getElementById('input2').appendChild(homeRoster);

      // for (var i = 0; i < keys.length; i++) {
      //   var val = obj[keys[i]];

      //   var playerName = document.createElement('p');
      //   playerName.innerHTML = val.fullName + ', ';
      //   if (val.currentTeam.id == data.gameData.teams.away.id) {
      //     document.getElementById('awayTeamId').appendChild(playerName);
      //   }
      //   else if (val.currentTeam.id == data.gameData.teams.home.id) {
      // //    console.log(val.fullName + ' ' + val.currentTeam.name + ' ' + val.currentTeam.id + data.gameData.teams.home.id);
      //     document.getElementById('homeTeamId').appendChild(playerName);
      //   }
      // }
    });
}