# NHLShiftStats1
This program will allow a user to analyze NHL lines combinations, thus uncovering one of great misteries of the game. First, a user will select date. 
<img width="589" alt="image" src="https://user-images.githubusercontent.com/88174852/205549984-314ae5dd-8759-45c9-87b3-2e48bd7ae0d4.png">

Then menu with all games played on this date will open. 
<img width="795" alt="image" src="https://user-images.githubusercontent.com/88174852/205549691-589d00e9-261b-4661-a04e-b20b1fb2a117.png">
    
User will select one game at a time. That will run a function which determines forward lines and defensive pairs, and probability of them to play together during the game. Also, a very important part is to determine which line played against which line. And that will be done by periods.

If you want to view next game analysis repload the page.

## Special Teams
There is no attempt to differentiate lines or pairs on special teams. It will be done rather laetr than sooner. The reason is that script is longer than 800 lines. 

## Player did not finish game
In some games, players get injured. Or some players get game misconduct penalty. They cannot finish game. That results in defensive pair of lines of forwards change as game goes by. If a skater did not have a shift during last 10 minutes of the game, a message will appear that he did not finish the game, without specific reason. 

## Print Goals Button
This is optional feature will print all goals of the game to the screen if a user wants to see that. But this button is unlikely to stay there in the final version. Currently it is not a working feature.

## Kind of known bug
Script gets interrupted during analysis of Flyers game where Lukas Sedlak #23 played in 2022-23 season. It is very unusual contract situation. I decided to leave it as it is. If necessary I will be able to write a patch. Leaving as it is for now...<img width="793" alt="image" src="https://user-images.githubusercontent.com/88174852/212519442-fdec1a64-227c-4b8a-8b10-53fe3e5412da.png">


## Notes
It is first time when I use 7 nested loops in JavaScript. Did it before in languages like Pascal. That was wonderful experience to do it again in the new language
