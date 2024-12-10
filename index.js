/**
 * Parse lyrics string to Objects
 * {time: startime, words: lyrics}
 */

function parseLrc(){

    var lines = lrc.split('\n');
    var result = [];  //lyrics objects

    for(var i = 0; i < lines.length; i++){
        
        var str = lines[i];
        var parts = str.split(']')
        var timeStr = parts[0].substring(1);
        var obj = {
            time: parseTime(timeStr),
            words:parts[1]
        }

        result.push(obj);
    }
 
    return result;

}

/**
 * Parse time string into values in seconds
 * @param {String} timeStr 
 * @returns 
 */
function parseTime(timeStr){
    var parts = timeStr.split(":");
    return +parts[0] * 60 + +parts[1]
}

var lrcData = parseLrc();

var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector(".container ul"),
    container: document.querySelector(".container")

}


/**
 * Calculate under current playtime
 * find the index of current playing lyrics
 * if no lyrics to display, get -1
 * the active lyrics display in the center of container
 */
function findIndex(){

   var curTime = doms.audio.currentTime;
   console.log('curr', curTime);

   for( var i = 0 ; i < lrcData.length; i++){
    if(curTime < lrcData[i].time){
 
        return i-1;
    }
   }

   //reach the last lyrics
   return lrcData.length - 1

}



//UI

/**
 * create lyrics element
 */

function createLrcElement(){

    var frag = document.createDocumentFragment();

    for( i = 0; i< lrcData.length; i++){
        var li = document.createElement('li');
        li.textContent = lrcData[i].words;
        frag.appendChild(li);  //change geometry, reflow

    }

    doms.ul.appendChild(frag);

}

createLrcElement();


var containerHeight =  doms.container.clientHeight;
var liHeight = doms.ul.children[0].clientHeight;
var maxOffset = doms.ul.clientHeight - containerHeight;
/**
 * set ul Offset value
 */
function setOffset(){
    var index = findIndex();
    var h1 = liHeight * index + liHeight / 2;
    var offset = h1 - containerHeight / 2;

    if(offset < 0){
       offset = 0
    }
    if(offset>maxOffset){
        offset = maxOffset
    }

    doms.ul.style.transform = `translateY(-${offset}px)`;

    //remove the previous active class
    var li = doms.ul.querySelector('.active')
    if(li){
        li.classList.remove('active')
    }

    //add the new active class
    li = doms.ul.children[index];
    if(li){
        li.classList.add('active');
    }
   
}


/**
 * Listen to the audio time change event
 */

doms.audio.addEventListener('timeupdate', setOffset)