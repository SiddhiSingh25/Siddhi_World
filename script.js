let songs;
let user = []; // SEARCH Card Container Array
let alpha = 0; // Variable to get id of search card
let currentFolder; 
let playicon = document.querySelector(".playicon1");//Pause Button on music controller
let s; // Search list href
let theme = true;
const owner = 'SiddhiSingh25';
const repo = 'Siddhi_World';
const folderPath = '/new/Bollywood/';//Default playlist

//Get song from github repo (Folder) url
async function songlist(folder) {
    currentFolder = folder;
    songs = [];
    //let urllist = `http://127.0.0.1:5500/${folder}/`;
    let urllist = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`;
    const response = await fetch(urllist, {
        headers: {
            'Authorization': `token ${access_token}`
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch folder contents. Status code: ${response.status}`);
    }
    let data = await response.json();
    //document.getElementById("libraryContent").innerHTML = `${currentsong.src.split()}`;currentsong.src.split(`${currentFolder}/`)[1].split(`.mp3`)[0].replaceAll("%20", " ")
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.name.endsWith(".mp3")) {
            songs.push(data[index].name.replaceAll(".mp3", ""));
        }
    }
    //Create songlist bar 
    let songbar = document.querySelector(".songslist");
    songbar.innerHTML = "";
    for (const song of songs) {
        songbar.innerHTML = songbar.innerHTML + `<div class="create" id=${alpha}>
                    <div class="img-sec display"><img src="Cover.png" alt=""></div>
                    <div class="songinfo" style="margin-left: 5px;">
                    <h5 style="display:none;">${song}</h5>  
                    <h5 class="song size">${song.split("by")[0]}</h5>
                    <h5 class="artist size">${song.split("by")[1]}</h5>
                    </div>
                    <div class="play playicon"><i class="fa-solid fa-square plays"></i></div>
                </div>`;
        alpha++;
    }
    //Add event listeners songlist bar
    document.querySelectorAll(".create").forEach((e, idx) => {
        e.addEventListener("click", (el) => {
            songName = e.getElementsByTagName("h5")[0].innerHTML.trim();
            let playBar = e.lastElementChild;
            playaudio(songName, playBar);
            playpausefun();
            songMenuFun();
            playIconFun();
            playIconAnime();
            border();
            jsBorder();
        })
    })
    //Search 
    let input = document.getElementsByTagName("input")[0];
    let search_result = document.getElementsByClassName("search_result")[0];
    let card;
    let id = 0;
    search_result.innerHTML = "";
    for (const song of songs) {
        card = document.createElement('a');
        card.classList.add("search-list");
        card.href = `#${id++}`;
        user.push(card);
        card.insertAdjacentHTML('afterbegin',
            `<div class="img-sec display"><img src="Cover.png" alt=""></div>
            <div class="songinfo">
                <p class=" song songName" id="songName">${song.split("by")[0]}</p>
                <p class=" artist songArtist" id="songArtist">${song.split("by")[1]}</p>
            </div>`);
        search_result.appendChild(card);

    }
    document.querySelectorAll(".search-list").forEach((e) => {
        e.addEventListener("click", (evt) => {
            s = e.getAttribute("href");
            document.querySelectorAll(".create").forEach((e) => {
                e.style.border = "1px solid transparent";
            })
            document.getElementById(s.replace("#", "")).style.border = "1px solid #dcdcdc";
        })
    })
    input.addEventListener('keyup', (e) => {
        let inputValue = input.value.toUpperCase();
        let items = search_result.getElementsByTagName('a');
        for (let index = 0; index < songs.length; index++) {
            let as = items[index].getElementsByClassName("songName")[0];
            let textVal = as.textContent || as.innerText;
            document.getElementById("alpha").classList.add("search-containerJs");
            document.querySelector(".searchCross").addEventListener("click",()=>{
                document.querySelector(".search-input").value = "";
                if (input.value == "") {
                    document.querySelector(".searchCross").style.display = "none";
                    document.querySelector(".searchCross").style.visibility = "hidden";
                    document.getElementById("alpha").classList.remove("search-containerJs");
                    document.querySelectorAll(".search-list").forEach((e) => {
                        e.style.display = "none";
                    })
                }
            })
            if (input.value == "") {
                document.querySelector(".searchCross").style.display = "none";
                document.querySelector(".searchCross").style.visibility = "hidden";
                document.getElementById("alpha").classList.remove("search-containerJs");
                document.querySelectorAll(".search-list").forEach((e) => {
                    e.style.display = "none";
                })
            }
            else {
                document.querySelector(".searchCross").style.display = "block";
                document.querySelector(".searchCross").style.visibility = "visible";
                document.getElementById("alpha").classList.add("search-containerJs");
                if (textVal.toUpperCase().indexOf(inputValue) > -1) {
                    items[index].style.display = "flex";
                }
                else {
                    items[index].style.display = "none";
                }
                
            }
        }
    })
    return songs;
}
/*Display Playlist Albums*/
(async function displayPlaylist() {
    let urlPlaylist = `https://api.github.com/repos/${owner}/${repo}/contents/new/`;
    try {
        const response = await fetch(urlPlaylist, {
            headers: {
                Authorization: `token ${access_token}`
            }
        });
        let data = await response.json();
        let cardContainer = document.querySelector(".folder-sec");
        for (let index = 0; index < data.length; index++) {
            const e = data[index];
            if (e.path.includes("new/")) {
                let folder = e.path.split("new/").slice(-2)[1];
                //Get the JSON data of the folder
                let playlistUrl = `https://api.github.com/repos/${owner}/${repo}/contents/new/${folder}/playlistinfo.json`;
                const response = await fetch(playlistUrl, {
                    headers: {
                        Authorization: `token ${access_token}`
                    }
                });
                let data = await response.json();
                if (data.encoding === 'base64') {
                    // Decode base64 content of the file
                    const content = atob(data.content);
                    // Parse the JSON content
                    const jsonData = JSON.parse(content);
                    // fetch img
                    let imgurl = `https://raw.githubusercontent.com/SiddhiSingh25/Siddhi_world/main/new/${folder}/image.jpg?access_token=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`;
                    cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="div" id="${folder}">
                            <div class="img">
                            <img id ="imageContainer"  src="${imgurl}" alt="">
                            </div>
                            <div class="song-name">
                            <div class="songinfo">
                            <h5 class="song" id="title">${jsonData.title}</h5>
                            <h5 class="artist" id="discription">${jsonData.discription}</h5>
                            </div>
                            <i class="fa-solid fa-heart love" style="color :#3ccebd"></i>
                            </div>
                            </div>`                            
                }
            }
        }

        // Handle response...
    } catch (error) {
        console.error('Error:', error);
    }
    //FOR RESPONIVE
    var style = document.createElement('style');
    var screenWidth = window.innerWidth || document.documentElement.clientWidth;
    const responsive = () => {
        if (screenWidth <= 700) {
            document.querySelectorAll(".div").forEach((e) => {
                e.addEventListener("click", () => {
                    document.querySelector(".left-part").style.position = "absolute";
                    document.querySelector(".left-part").style.left = "0px";
                    document.querySelector(".left-part").style.width = "100vw";
                    document.querySelector(".left-part").style.zIndex = "99";
                    style.textContent = `@media (max-width:768px){
                        .left-part{
                            position: absolute;
                            left: -100%;
                            height: 90vh;
                        }
                        .lftbox1 {
                            height: 15vh;
                            padding: 1.6rem 1rem 1.6rem 0;
                        }
                        .right-part{
                            width: 100vw;
                            height: 87.5vh;
                        }
                        .logo{
                            width: 85vw;
                        }
                        .logo img {
                            width: 85vw;
                        }
                        .cross{
                            display: flex;
                        }
                        .menu{
                            display: flex;
                        }
                        .search-conJs{
                            width: 100%;
                            height: 3.2rem;
                        }
                        .folder-sec {
                            justify-content: center;
                            align-items: center;
                            min-height: calc( 100% - 5rem );
                        }
                        .div{
                            height: 30rem;
                            width: 27rem;
                            border-radius: 5px;
                        }
                        .play-sec{
                            height: 10vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-direction: column-reverse;
                            bottom: 0;
                            position: absolute;
                        }
                        .songMenu{
                            display: none;
                        }
                        .toggle-label {
                            height: 3.5vh;
                            width: 5.9vh;
                            margin-top: 2vw;
                        }
                        .toggle-ball{
                            height: 17px;
                            width: 17px;
                        }
                        .search-containerJs{
                        height: 30rem;
                        flex-direction: column;
                        width: 29rem;
                        margin-top: 284px;
                       }
                       .songbar {
                        width: 100%;
                        height: max-content;
                        margin-bottom: 5px;
                       }
                       .sound{
                        display: none;
                       }
                       .icons{
                        width: 80%;
                        justify-content: space-around;
                        font-size: 1.6rem;
                       }
                       .container{
                        display: none;
                       }
                       .songslist{
                        min-height: 90%;
                        width: 100%;
                       }
                       .menu-set{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        width: 83%;
                       }
                       #alpha{
                        width: 90%;
                       }
                       .right-part{
                        height: 90vh;
                       }
                       .lftbox2{
                        height: 75vh;
                       }
                       .music-icon{
                        font-size: 1.75rem;
                    }
                    .songslist::-webkit-scrollbar {
                        display: none;
                    }
                    .toggle-btn{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .searchCross{
                        color: #d10505;
                        font-size: 17pxpx;
                    }
                    .search-input {
                        width: 70%;
                    }
                    }`;
                    document.head.appendChild(style);
                })
            })
        }
    }
    responsive();
    window.addEventListener('resize', responsive);
    document.querySelectorAll(".div").forEach((e) => {
        e.addEventListener("click", async elm => {
            alpha = 0;
            songs = await songlist(`new/${elm.currentTarget.dataset.folder}`);
            if (theme) {
                document.querySelectorAll(".create").forEach((e) => {
                    e.classList.remove("createLight");
                    e.getElementsByTagName("h5")[1].style.color = "#eeeeee";
                    e.getElementsByTagName("h5")[2].style.color = "#b1b5bd";
                    e.lastElementChild.style.backgroundColor = "#37decb";
                })
            }
            else {
                document.querySelectorAll(".create").forEach((e) => {
                    e.classList.add("createLight");
                    e.getElementsByTagName("h5")[1].style.color = "#3e3e3e";
                    e.getElementsByTagName("h5")[2].style.color = "#828da8";
                    e.lastElementChild.style.backgroundColor = "#2bc5b4";
                })
            }
        })
        e.addEventListener("mouseover", () => {
            e.lastElementChild.lastElementChild.classList.add("add");
        })
        e.addEventListener("mouseout", () => {
            e.lastElementChild.lastElementChild.classList.remove("add");
        })
    })
})();
//Play Audio 
let currentsong = new Audio();
const playaudio = (track, pause = false) => {
    currentsong.src = `https://raw.githubusercontent.com/SiddhiSingh25/Siddhi_world/main/new/${currentFolder.split("new/")[1]}/${track}.mp3?access_token=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`;
    if (!pause) {
        currentsong.play();
        playicon.innerHTML = `<i class="fa-solid fa-pause plays" title ="Pause"></i>`;
    }
}
//Song Menu Bar
const songMenuFun = () => {
    document.querySelector(".songMenu").innerHTML = `<div class="SongMenuimg-sec display">
            <img src="Cover.png" alt=""></div>
            <div class="SongMenusonginfo" style="margin-left: 5px;"> 
            <h5 class="SongMenusong">${currentsong.src.substring(currentsong.src.lastIndexOf('/') + 1).replace('.mp3', '').replaceAll("%20", " ").split("by")[0]}</h5>
            <h5 class="SongMenuartist">${currentsong.src.substring(currentsong.src.lastIndexOf('/') + 1).replace('.mp3', '').replaceAll("%20", " ").split("by")[1].split("?")[0]}</h5>
            </div>`;
}
//PLay icon functioin without Animation
const playIconFun = () => {
        document.querySelectorAll(".playicon").forEach((e) => {
            e.innerHTML = `<i class="fa-solid fa-square  plays"></i>`;
            e.style.display = "flex";
            e.style.justifyContent = "space-evenly";
            e.style.alignItems = "flex-end";
            e.style.height = "3rem";
            e.style.width = "3rem";
            e.style.color = "#071952";
            e.style.backgroundColor = "#37decb";
            e.style.borderRadius = "50%";
            e.style.position = "relative";
        })
}
// PlayIcon Animatimation
function playIconAnime() {
let url = currentsong.src;
const filenameStartIndex = url.lastIndexOf('/') + 1;
const filenameEndIndex = url.lastIndexOf('?') !== -1 ? url.lastIndexOf('?') : url.lastIndexOf('.mp3');
const filename = url.substring(filenameStartIndex, filenameEndIndex);
    const desiredString = filename.replace(/%20/g, ' ');
    let idx = songs.indexOf(desiredString.replace('.mp3', ''));
    document.querySelectorAll(".playicon")[idx].innerHTML = `<div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>`;
document.querySelectorAll(".playicon")[idx].style.display = "flex";
document.querySelectorAll(".playicon")[idx].style.justifyContent = "space-evenly";
document.querySelectorAll(".playicon")[idx].style.alignItems = "flex-end";
document.querySelectorAll(".playicon")[idx].style.height = "3.6rem";
document.querySelectorAll(".playicon")[idx].style.width = "2.8rem";
document.querySelectorAll(".playicon")[idx].style.color = "transparent";
document.querySelectorAll(".playicon")[idx].style.backgroundColor = "transparent";
document.querySelectorAll(".playicon")[idx].style.borderRadius = "none";
document.querySelectorAll(".playicon")[idx].style.position = "none";
document.querySelectorAll(".bar").forEach((e) => {
e.classList.add("active");
});
}
const playTheme = () => {
    let url = currentsong.src;
const filenameStartIndex = url.lastIndexOf('/') + 1;
const filenameEndIndex = url.lastIndexOf('?') !== -1 ? url.lastIndexOf('?') : url.lastIndexOf('.mp3');
const filename = url.substring(filenameStartIndex, filenameEndIndex);
    const desiredString = filename.replace(/%20/g, ' ');
    let idx = songs.indexOf(desiredString.replace('.mp3', ''));
    document.querySelectorAll(".playicon")[idx].style.display = "flex";
    document.querySelectorAll(".playicon")[idx].style.justifyContent = "space-evenly";
    document.querySelectorAll(".playicon")[idx].style.alignItems = "flex-end";
    document.querySelectorAll(".playicon")[idx].style.height = "3.6rem";
    document.querySelectorAll(".playicon")[idx].style.width = "2.8rem";
    document.querySelectorAll(".playicon")[idx].style.color = "transparent";
    document.querySelectorAll(".playicon")[idx].style.backgroundColor = "transparent";
    document.querySelectorAll(".playicon")[idx].style.borderRadius = "none";
    document.querySelectorAll(".playicon")[idx].style.position = "static";
}
//Create border 
const border = () => {
    document.querySelectorAll(".create").forEach((e) => {
        e.style.border = "none";
    })
}
//Border js
const jsBorder = () => {
    //let idx = songs.indexOf(currentsong.src.split(`/${currentFolder}/`)[1].replaceAll("%20", " ").replaceAll(".mp3", ""));
    let url = currentsong.src;
const filenameStartIndex = url.lastIndexOf('/') + 1;
const filenameEndIndex = url.lastIndexOf('?') !== -1 ? url.lastIndexOf('?') : url.lastIndexOf('.mp3');
const filename = url.substring(filenameStartIndex, filenameEndIndex);
    const desiredString = filename.replace(/%20/g, ' ');
    let idx = songs.indexOf(desiredString.replace('.mp3', ''));
    document.querySelectorAll(".create")[idx].style.border = "1px solid #dcdcdc";
}
const lightjsBorder = () => {
    let url = currentsong.src;
const filenameStartIndex = url.lastIndexOf('/') + 1;
const filenameEndIndex = url.lastIndexOf('?') !== -1 ? url.lastIndexOf('?') : url.lastIndexOf('.mp3');
const filename = url.substring(filenameStartIndex, filenameEndIndex);
    const desiredString = filename.replace(/%20/g, ' ');
    let idx = songs.indexOf(desiredString.replace('.mp3', ''));
    document.querySelectorAll(".create")[idx].style.border = "1px solid #071952";
}
//Next Song Function
const nextSong = () => {
   // let index = songs.indexOf(currentsong.src.split(`/${currentFolder}/`)[1].replaceAll("%20", " ").replaceAll(".mp3", "").split("?")[0]);
   let index = songs.indexOf(currentsong.src.split(`${currentFolder}/`)[1].split(`.mp3`)[0].replaceAll("%20", " "))
    if ((index + 1) < songs.length) {
        playaudio(songs[index + 1]);
    }
    songMenuFun();
    playIconFun();
    playIconAnime();
    border();
    jsBorder();
}
//Previous Song Function
const preSong = () => {
    //let index = songs.indexOf(currentsong.src.split(`/${currentFolder}/`)[1].replaceAll("%20", " ").replaceAll(".mp3", "").split("?")[0]);
let index = songs.indexOf(currentsong.src.split(`${currentFolder}/`)[1].split(`.mp3`)[0].replaceAll("%20", " "))
    //console.log(currentsong.src.split('/${currentFolder}/')[0]);
    //https://raw.githubusercontent.com/SiddhiSingh25/Siddhi_world/main/new/Slowed%20Redverb/Ishq%20Wala%20Love%20by%20Vishal%20Shekhar%20,%20Neeti%20Mohan.mp3?access_token=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
    if ((index - 1) >= 0) {
        playaudio(songs[index - 1]);
    }
    songMenuFun();
    playIconFun();
    playIconAnime();
    border();
    jsBorder();
}
//Volume Seekbar Function
const volumeSeekbar = document.getElementById('volumeSeekbar');
let volIcon = document.getElementById("volIcon");
let progressSound = document.querySelector(".progressSound");
let soundThumb = document.querySelector(".soundThumb");
function handleVolumeChange() {
    const volume = volumeSeekbar.value;
    progressSound.style.width = `${volume}%`;
    soundThumb.style.left = `${volume}%`
    if (volume == 0) {
        volIcon.classList.add("fa-volume-off");
        volIcon.classList.remove("fa-volume-low");
        volIcon.classList.remove("fa-volume-high");
    }
    if (volume <= 50 && volume != 0) {
        volIcon.classList.remove("fa-volume-off");
        volIcon.classList.add("fa-volume-low");
        volIcon.classList.remove("fa-volume-high");
    }
    if (volume >= 50) {
        volIcon.classList.remove("fa-volume-off");
        volIcon.classList.remove("fa-volume-low");
        volIcon.classList.add("fa-volume-high");
    }
    currentsong.volume = volume / 100;
}
//Light & Dark Theme Function 
const darkTheme = () => {
    document.querySelector("body").classList.remove("lightBody");
    document.querySelector(".lftbox1").classList.remove("lftbox1Light");
    document.querySelector(".logo img").style.filter = "invert(0)";
    document.querySelector(".lftbox2").classList.remove("lftbox2Light");
    document.querySelector(".library").classList.remove("libraryLight");
    document.querySelector(".songslist").classList.remove("songslistLight");
    document.querySelectorAll(".create").forEach((e) => {
        e.classList.remove("createLight");
        e.getElementsByTagName("h5")[1].style.color = "#eeeeee";
        e.getElementsByTagName("h5")[2].style.color = "#b1b5bd";
        e.lastElementChild.style.backgroundColor = "#37decb";
    })
    document.querySelectorAll(".div").forEach((e) => {
        e.classList.remove("createLight");
        e.getElementsByTagName("h5")[0].style.color = "#eeeeee";
        e.getElementsByTagName("h5")[1].style.color = "#b1b5bd";
    })
    document.querySelector(".folder-sec").classList.remove("folder-secLight");
    document.querySelector(".play-sec").classList.remove("play-secLight");
    document.querySelectorAll(".hicon").forEach((e) => {
        e.style.color = "#eeeeee"
    })
    document.querySelector(".playicon1").style.color = "#eeeeee";
    document.querySelector(".progress").style.backgroundColor = "#37decb";
    document.querySelector(".progressSound").style.backgroundColor = "#37decb";
    document.querySelector(".thumb").style.border = "1px solid #37decb";
    document.querySelector(".SongMenusong").style.color = "#37decb";
    document.querySelector(".sound i ").style.color = "#37decb";
    document.querySelector(".soundThumb ").style.backgroundColor = "#37decb";
    document.querySelector(".soundThumb").classList.remove("lightThumb");
    document.querySelector(".soundThumb").style.boxShadow = "inset 0px 0px 3px #37decb";
    document.querySelectorAll(".fontcommon").forEach((e) => {
        e.style.color = "#cbcbcb";
    })
    document.querySelector(".left-part").style.backgroundColor = "#0a0a0a";
    playTheme();
    jsBorder();
}
const lightTheme = () => {
    document.querySelector("body").classList.add("lightBody");
    document.querySelector(".lftbox1").classList.add("lftbox1Light");
    document.querySelector(".logo img").style.filter = "invert(0.9)";
    document.querySelector(".lftbox2").classList.add("lftbox2Light");
    document.querySelector(".library").classList.add("libraryLight");
    document.querySelector(".songslist").classList.add("songslistLight");
    document.querySelectorAll(".create").forEach((e) => {
        e.classList.add("createLight");
        e.getElementsByTagName("h5")[1].style.color = "#3e3e3e";
        e.getElementsByTagName("h5")[2].style.color = "#828da8";
        e.lastElementChild.style.backgroundColor = "#2bc5b4";
    })
    document.querySelectorAll(".div").forEach((e) => {
        e.classList.add("createLight");
        e.getElementsByTagName("h5")[0].style.color = "#3e3e3e";
        e.getElementsByTagName("h5")[1].style.color = "#828da8";
    })
    document.querySelector(".folder-sec").classList.add("folder-secLight");
    document.querySelector(".play-sec").classList.add("play-secLight");
    document.querySelectorAll(".hicon").forEach((e) => {
        e.style.color = "#071952"
    })
    document.querySelector(".playicon1").style.color = "#071952";
    document.querySelector(".progress").style.backgroundColor = "#071952";
    document.querySelector(".progressSound").style.backgroundColor = "#071952";
    document.querySelector(".thumb").style.border = "1px solid #071952";
    document.querySelector(".SongMenusong").style.color = "#071952";
    document.querySelector(".sound i ").style.color = "#071952";
    document.querySelector(".soundThumb ").style.backgroundColor = "#071952";
    document.querySelector(".soundThumb").style.boxShadow = "inset 0px 0px 3px #071952";
    document.querySelectorAll(".fontcommon").forEach((e) => {
        e.style.color = "#071941";
    })
    document.querySelector(".left-part").style.backgroundColor = "#f6f6f6";
    playTheme();
    lightjsBorder();
    document.querySelector(".soundThumb").classList.add("lightThumb");
}
let sigma = true;
const playpausefun = () => {
    if (sigma) {
        document.querySelectorAll(".bar").forEach((e) => {
            e.classList.add("active");
        });
        sigma = false;
    }
    else {
        document.querySelectorAll(".bar").forEach((e) => {
            e.classList.remove("active");
            sigma = true;
        });
    }
    if (currentsong.paused) {
        currentsong.play();
        playicon.innerHTML = `<i class="fa-solid fa-pause plays playmaster" title ="Pause"></i>`;
        document.querySelectorAll(".bar").forEach((e) => {
            e.classList.add("active");
        });
        playIconFun();
        playIconAnime();
        border();
        jsBorder();
    }
    else {
        currentsong.pause();
        playicon.innerHTML = `<i class="fa-solid fa-play plays playmaster" title ="Pause"></i>`;
        document.querySelectorAll(".bar").forEach((e) => {
            e.classList.remove("active");
        });
    }
}
// add song details song images name and all..
let songName;
(async function songimage() {
    // Get the list of all songs
    await songlist("new/Bollywood");
    playaudio(songs[0], true);
    songMenuFun();
    playicon.addEventListener("click", playpausefun);

//Time update and control seekbar 
    const seekbar = document.getElementById('seekbar');
    const progress = document.getElementById('progress');
    const thumb = document.getElementById('thumb');
    const start = document.getElementById('startTime');
    const end = document.getElementById('currentTime');
    currentsong.addEventListener("timeupdate", (event) => {
        let currentTime = currentsong.currentTime;
        let duration = currentsong.duration;
        let progress_time = (currentTime / duration) * 100;
        progress.style.width = `${progress_time}%`;
        thumb.style.left = `${progress_time}%`;
        let minend = Math.floor(duration / 60);
        let secend = Math.floor(duration % 60);
        if (duration) {
            if (secend < 10) {
                end.innerHTML = `0${minend}:0${secend}`
            }
            else {
                end.innerHTML = `0${minend}:${secend}`
            }
        }
        let minstart = Math.floor(currentTime / 60);
        let secstart = Math.floor(currentTime % 60);
        if (currentTime) {
            if (secstart < 10) {
                start.innerHTML = `0${minstart}:0${secstart}`
            }
            else {
                start.innerHTML = `0${minstart}:${secstart}`
            }
        }
        seekbar.addEventListener("click", function (event) {
            const { duration } = currentsong;
            let moveprogress = (event.offsetX / event.srcElement.clientWidth) * duration;
            currentsong.currentTime = moveprogress;
        })
        if (currentTime == duration) {
            nextSong();
        }
    });
    //Next and previous Button 
    document.getElementById("previous").addEventListener("click", preSong);
    document.getElementById("next").addEventListener("click", nextSong);
    // document.getElementsByTagName("a")[0].href = currentsong.src;
    document.getElementById("download").addEventListener("click", () => {
        //document.getElementsByTagName("a")[0].setAttribute("href", currentsong.src);
        document.getElementsByTagName("a")[0].setAttribute("download", currentsong.src);
    })
    //Search bar 

    //Control Volume Seekbar 
    volumeSeekbar.addEventListener('input', handleVolumeChange);
    volumeSeekbar.addEventListener('click', handleVolumeChange);
    //Theme
    const checkbox = document.querySelector('#checkbox');
    checkbox.addEventListener('click', function () {
        if (checkbox.checked) {
            lightTheme();
            theme = false;
        }
        else {
            darkTheme();
            theme = true;
        }
    })
})();
//For Media Queries
let cross = document.querySelector(".left-part");
try {
    document.querySelector(".menu").addEventListener("click", () => {
        document.querySelector(".left-part").style.left = "0";
        document.querySelector(".left-part").style.width = "100vw";
        document.querySelector(".left-part").style.zIndex = "99";
    })
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left-part").style.left = "-100%";
        document.querySelector(".left-part").style.width = "23vw";
        document.querySelector(".left-part").style.zIndex = "99";
    })
} catch (error) {
    console.log(error)
}
//load 
// Hide content initially
var content = document.getElementById('content');
content.style.display = 'none';
var loadingAnimation = document.getElementById('loading-animation');
loadingAnimation.style.display = 'flex';
setTimeout(function() {
    content.style.display = 'block';
    loadingAnimation.style.display = 'none';
}, 4000);
