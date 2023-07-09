var scheduleContent = document.getElementById('schedule');
var gameId;


// two lines below will allow user to search by year
function getInputValue() {
    // var inputVal = document.getElementById('myInput').value;
    var inputVal = document.getElementById('datepicker').value;
    console.log('inputVal= ' + inputVal);

    var date = inputVal.split('/');
    //console.log(date);
    var formatted = date[2] + '-' + date[0] + '-' + date[1];
    console.log(formatted);
    const d = new Date();
   


    var text1 = document.createElement('p');
    text1.setAttribute('style', 'color: red; font-size: 34px');
    // text1.style("font-size:24px")
    text1.innerHTML = 'some text';
    document.getElementById('schedule').appendChild(text1);
    angle = 10;

    var drawing = document.createElement('button');
    // drawing.style("background-image: url('./Stars-Logo.png');")  
    // drawing.setAttribute ('style', "width: 215px; height: 128px; rotate: " + angle + "deg; background-image: url('./assets/Hanging.png')");
    //   drawing.setAttribute ('style', 'height: 200px'); 
    // rawing.setAttribute ('style', ";"); 
    document.getElementById('schedule').appendChild(drawing);

    var intervalId = window.setInterval(function () {
        const d = new Date();
        // let time = d.getTime();
        var msec = 10 * d.getMilliseconds();
        var angle = 12 * Math.cos(0.00628 * msec);
        var seconds = d.getSeconds();
        console.log(seconds);
        var coocoo = document.createElement('p');
        coocoo.innerHTML = '';
        if (seconds == 0) { 
        coocoo.setAttribute('style', 'color: red; font-size: 34px');
        coocoo.setAttribute('id', 'coocoo');
        // text1.style("font-size:24px")
        coocoo.innerHTML = 'coocoo';
        document.getElementById('schedule1').appendChild(coocoo);}
        else if (seconds == 1) { var coocoo1 = document.createElement('p');
        coocoo1.setAttribute('style', 'color: green; font-size: 24px');
        coocoo1.setAttribute('id', 'coocoo1');
        // text1.style("font-size:24px")
        coocoo1.innerHTML = 'coocoo1';
        document.getElementById('schedule1').appendChild(coocoo1);}
        else if (seconds == 2) { let doc = document.getElementById('schedule1').removeChild(coocoo);;
       // doc.
    }
    else if (seconds == 3) { //var coocoo2 = document.createElement('p');
        // coocoo2.setAttribute('style', 'color: green; font-size: 24px');
        // text1.style("font-size:24px")
        // coocoo2.innerHTML = '';
        document.getElementById('schedule1').removeChild(coocoo1)
    }
         // console.log(d, msec);
        drawing.setAttribute('style', "width: 78px; height: 625px; rotate: " + angle + "deg; background-image: url('./assets/Hanging2.png')");
    }, 1000);

   

}