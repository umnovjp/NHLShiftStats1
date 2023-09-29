# NHLShiftStats1
This program will allow a user to analyze NHL lines combinations, thus uncovering one of great misteries of the game. First, a user will select date. 
<img width="589" alt="image" src="https://user-images.githubusercontent.com/88174852/205549984-314ae5dd-8759-45c9-87b3-2e48bd7ae0d4.png">

Then menu with all games played on this date will open. 
<img width="795" alt="image" src="https://user-images.githubusercontent.com/88174852/205549691-589d00e9-261b-4661-a04e-b20b1fb2a117.png">
    
User will select one game at a time. That will run a function which determines forward lines and defensive pairs, and probability of them to play together during the game. Also, a very important part is to determine which line played against which line. And that will be done by periods.

If you want to view next game analysis reload the page.

## Special Teams
After multiple failures to generate reliable results without separating special teams stats as opposed to five on five team stats, I decided to create script that would determine if teams played five on five to calculate forward lines. It was always that some part of script did not work when forward lines were determined during situations like power play when usually four forwards are on ice. And remember there are 32 teams with 32 coaches who called forward lines.

4 x 4 plays do not get separate treatment because they always play with 2 forwards and 2 defensemen. And our main goal is to determine when teams play with three forwards.

## Player did not finish game
In some games, players get injured. Or some players get game misconduct penalty. They cannot finish game. That results in defensive pair of lines of forwards change as game goes by. If a skater did not have a shift during last 10 minutes of the game, a message will appear that he did not finish the game, without specific reason.

## Game data do not display
In very rare cases, data do not display. An example is game 2 on 04/06/2023 when coach of road team was assessed a game misconduct penalty. Script stopped because coach was not in the players' list. No plan to fix this because it does not happen frequently.

## Kind of known bug 
If teams played shutout there is known bug when if a player scored shutout goal he is not added to team's roster. It will be fixed eventually

## Teams playing with 7 Dmen and 11 Forwards
Not much analysis is done to investigate teams playing with 7 defensemen and 11 forwards. I just add third pair and 7th Dman. But I do not make great job analyzing how their pair are actually rotated. Main reason is that Stars are not playing this way. Tampa Bay, Colorado, Philly, some games of St Louis, maybe New Jersey are playing. It will be more interesting to check how 11 forwards rotate

## Notes
It is first time when I use 7 or 8 nested loops in JavaScript. Did it before in languages like Pascal. That was wonderful experience to do it again in the new language
