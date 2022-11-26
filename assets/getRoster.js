function getRoster() {
  var rosterURL = 'https://statsapi.web.nhl.com/api/v1/game/' + gameId + '/feed/live';
  fetch(rosterURL, {
    "method": "GET", "headers": {}  })
    .then(function (response) {
      return response.json();   })
    .then(function (data) {
      console.log(data.gameData.players)

      var obj = data.gameData.players;
      var keys = Object.keys(obj);

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
        //  document.getElementById('awayTeamId').appendChild(playerName);
          awayRosterArray.push(primaryNumber1);
          awayRosterArray.push(playerName1);
     //     rosterArray = awayRosterArray;
        }
        else if (val.currentTeam.id == data.gameData.teams.home.id) {
          //    console.log(val.fullName + ' ' + val.currentTeam.name + ' ' + val.currentTeam.id + data.gameData.teams.home.id);
      //    document.getElementById('homeTeamId').appendChild(playerName);
          homeRosterArray.push(primaryNumber1);
          homeRosterArray.push(playerName1);
        }
      }
      console.log(homeRosterArray);
      console.log(awayRosterArray);
    });
}