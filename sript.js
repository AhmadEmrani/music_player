const wrapper = document.querySelector(".wrapper"),
musicimg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = document.getElementById("main-audio"),
prevbtn = document.getElementById("prev"),
nextbtn = document.getElementById("next"),
progressBar = wrapper.querySelector(".progress-bar"),
playpausebtn = wrapper.querySelector(".play-pause"),
progressArea = wrapper.querySelector(".progress-area");



let musicindex =  Math.floor((Math.random() * allMusic.length + 1));


window.addEventListener("load", ()=>{
    loadMusic(musicindex);
    playingNow();
})

function loadMusic(indexumb){

    musicName.innerText = allMusic[indexumb - 1].name;
    musicArtist.innerText = allMusic[indexumb - 1].artist;
    musicimg.src = `img/${allMusic[indexumb - 1].img}.jpg`;
    if(mainAudio==null)
    {
        musicArtist.innerText="null"
    }
    mainAudio.src = `songs/${allMusic[indexumb - 1].src}.mp3`;

    
    
}

function playMusic(){
    wrapper.classList.add("paused");
    playpausebtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}


function pauseMusic(){
    wrapper.classList.remove("paused");
    playpausebtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

function nextMusic(){

    musicindex++;
    musicindex > allMusic.length ? musicindex = 1 : musicindex = musicindex;
    loadMusic(musicindex);
    playMusic();
    playingNow();

}
function prevMusic(){

    musicindex--;
    musicindex < 1 ? musicindex = allMusic.length : musicindex = musicindex;
    loadMusic(musicindex);
    playMusic();
    playingNow();

}

playpausebtn.addEventListener("click", ()=>{

    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();

});



nextbtn.addEventListener("click", ()=>{

    nextMusic();
})

prevbtn.addEventListener("click", ()=>{

    prevMusic();
})

mainAudio.addEventListener("timeupdate", (e)=>{

    const currenttime = e.target.currentTime;
    const duration = e.target.duration;
   
    let progresswidth = (currenttime / duration) * 100;
   
    progressBar.style.width = `${progresswidth}%`;

    let musicurrenttime = wrapper.querySelector(".current");
    let musicduration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata" , ()=>{

       
        let audioDuration = mainAudio.duration;
        let totalmin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalsec = `0${totalsec}`;
        }
        musicduration.innerText = `${totalmin}:${totalSec}`;




    });

    let curentmin = Math.floor(currenttime / 60);
    let currentsec = Math.floor(currenttime % 60);
    if(currentsec < 10){
        currentsec = `0${currentsec}`;
    }
    musicurrenttime.innerText = `${curentmin}:${currentsec}`;

});


progressArea.addEventListener("click" , (e)=>{

    let progresswidthVal = progressArea.clientWidth;
    let clickedoffsetx = e.offsetX;
    let songduration = mainAudio.duration;

    mainAudio.currentTime = (clickedoffsetx / progresswidthVal) * songduration;
    playMusic();

});


const repeatbtn = wrapper.querySelector("#prepeat-list");

repeatbtn.addEventListener("click" , ()=>{

    let gettext = repeatbtn.innerText;

    switch(gettext)
    {
        case "repeat":
            repeatbtn.innerText = "repeat_one";
            repeatbtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatbtn.innerText = "shuffle";
            repeatbtn.setAttribute("title", "playback shuffle");
            break;
        case "shuffle":
            repeatbtn.innerText = "repeat";
            repeatbtn.setAttribute("title", "playlist looped");
            break;
    }

});


mainAudio.addEventListener("ended" , ()=>{
    
    let gettext = repeatbtn.innerText;
    switch(gettext)
    {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime =0;
            loadMusic(musicindex);
            playMusic();
            playingNow();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length + 1));
            do{
                randIndex = Math.floor((Math.random() * allMusic.length + 1));
            }
            while(musicindex == randIndex);
            musicindex = randIndex;
            loadMusic(musicindex);
            playMusic();
            playingNow();
            break;
    }


});

musicList = wrapper.querySelector(".music-list");
showMoreBtn = wrapper.querySelector("#more-music");
HideMoreBtn = wrapper.querySelector("#close");

showMoreBtn.addEventListener("click" , ()=>{

    musicList.classList.toggle("show");
});
HideMoreBtn.addEventListener("click" , ()=>{

    showMoreBtn.click();
});



const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
    
    let liTag = `<li li-index="${i + 1 }">
                    <div class="row">
                         <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span  id="${allMusic[i].src}" class="audio-duration">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend" , liTag);
    
    let liAudioTagDuration= ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata" , ()=>{
        let audioDuration = liAudioTag.duration;
        let totalmin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }
        liAudioTagDuration.innerText = `${totalmin}:${totalSec}`;
        
    });
}

const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){

    for (let j = 0; j < allLiTags.length; j++) {

        if(allLiTags[j].classList.contains("playing"))
        {
            allLiTags[j].classList.remove("playing");
        }

        if(allLiTags[j].getAttribute("li-index")== musicindex)
        {
            allLiTags[j].classList.add("playing");
        }
    
        allLiTags[j].setAttribute("onclick" , "clicked(this)");
        
    }

}

function clicked(element)
{
    let getliindex = element.getAttribute("li-index");
    musicindex = getliindex;
    loadMusic(musicindex);
    playMusic();
    playingNow();
}