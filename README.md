# NHLShiftStats1
This program will allow a user to analyze NHL lines combinations, thus uncovering one of great misteries of the game. First, a user will select date. 
<img width="589" alt="image" src="https://user-images.githubusercontent.com/88174852/205549984-314ae5dd-8759-45c9-87b3-2e48bd7ae0d4.png">

Then menu with all games played on this date will open. 
<img width="795" alt="image" src="https://user-images.githubusercontent.com/88174852/205549691-589d00e9-261b-4661-a04e-b20b1fb2a117.png">
    
User will select one game at a time. That will run a function which determines forward lines and defensive pairs, and probability of them to play together during the game. Also, a very important part is to determine which line played against which line. And that will be done by periods.

If you want to view next game analysis reload the page.

## Special Teams
There is no attempt to differentiate lines or pairs on special teams. It will be done rather later than sooner. The reason is that script is longer than 800 lines. And frequently on the PP, teams play with 4 forwards.n Still combinations are calculated for lines of 3 forwards

## Player did not finish game
In some games, players get injured. Or some players get game misconduct penalty. They cannot finish game. That results in defensive pair of lines of forwards change as game goes by. If a skater did not have a shift during last 10 minutes of the game, a message will appear that he did not finish the game, without specific reason. 

## Kind of known bug 
If teams played shutout there is known bug when if a player scored shutout goal he is not added to team's roster. It will be fixed eventually

## Teams playing with 7 Dmen and 11 Forwards
Not much analysis is done to investigate teams playing with 7 defensemen and 11 forwards. I just add third pair and 7th Dman. But I do not make great job analyzing how their pair are actually rotated. Main reason is that Stars are not playing this way. Tampa Bay, Colorado, Philly, some games of St Louis, maybe New Jersey are playing. It will be more interesting to check how 11 forwards rotate

## Notes
It is first time when I use 7 or 8 nested loops in JavaScript. Did it before in languages like Pascal. That was wonderful experience to do it again in the new language
