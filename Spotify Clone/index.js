console.log("----this is spotify clone----");

// Initialize Variables
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
audioElement.volume = 0.5;
let masterPlay = document.getElementById('masterPlay');
let masterBack = document.getElementById('masterBack');
let masterFor = document.getElementById('masterFor');
let myProgressBar = document.getElementById('myProgressBar');
let playGif = document.querySelectorAll('playGif');
let songList = document.querySelector('.songList');
let songInfo = document.querySelector('.songInfo');
let volumeBar = document.querySelector('#volumeBar');
let currentSongId = '1';

let songs = [
    {songName: 'Faded', filePath: 'songs/1.mp3', coverPath: 'covers/1.jpg'},
    {songName: 'Let Me Love You', filePath: 'songs/2.mp3', coverPath: 'covers/2.jpg'},
    {songName: 'Stay', filePath: 'songs/3.mp3', coverPath: 'covers/3.jpg'},
    {songName: 'On and On', filePath: 'songs/4.mp3', coverPath: 'covers/4.jpg'},
    {songName: 'War of Hearts', filePath: 'songs/5.mp3', coverPath: 'covers/5.jpg'},
    {songName: 'Alone', filePath: 'songs/6.mp3', coverPath: 'covers/6.jpg'},
    {songName: 'Darkside', filePath: 'songs/7.mp3', coverPath: 'covers/7.jpg'},
    {songName: 'Unholy', filePath: 'songs/8.mp3', coverPath: 'covers/8.jpg'},
    {songName: 'Counting Stars', filePath: 'songs/9.mp3', coverPath: 'covers/9.jpg'},
    {songName: 'Jalebi Baby', filePath: 'songs/10.mp3', coverPath: 'covers/10.jpg'},
];


songs.forEach((item, index) => {
    songList.insertAdjacentHTML('beforeend',
        `
        <div class="songItem">
            <img src="${item.coverPath}" alt="${index}">
            <span>${item.songName}</span>
            <span class="songListPlay">
                <img src="playing.gif" class="playGif" id="gif_${index}" alt="play">
                <span class="timestamp">05:34</span>
                <img src="icon/play-black.png" class="songSelect" alt="Play" id="${index}">
            </span>
        </div>
        `
    )
});

let turnPlay = (e) => {
    if (e == 0){
        document.getElementById(currentSongId).src = 'icon/play-black.png';
        document.getElementById(currentSongId).style.height = '3vh';
        document.getElementById(`gif_${currentSongId}`).style.opacity = 0;
        masterPlay.src = 'icon/play.png';
    } else {
        document.getElementById(currentSongId).src = 'icon/pause-black.png';
        document.getElementById(currentSongId).style.height = '3.5vh';
        document.getElementById(`gif_${currentSongId}`).style.opacity = 1;
        masterPlay.src = 'icon/pause.png';
        audioElement.src = songs[currentSongId].filePath;
        audioElement.currentTime = 0;
        audioElement.play()
        songInfo.textContent = songs[currentSongId].songName;
    }
}

// Event Listener
let songSelect = Array.from(document.querySelectorAll('.songSelect'));

songSelect.forEach(item => {
    item.addEventListener('click', (e)=>{
        // make prev play button
        turnPlay(0);
        currentSongId = e.target.id;
        turnPlay(1);
    })
});

masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0){
        audioElement.play()
        document.getElementById(currentSongId).src = 'icon/pause-black.png';
        document.getElementById(currentSongId).style.height = '3.5vh';
        document.getElementById(`gif_${currentSongId}`).style.opacity = 1;
        masterPlay.src = 'icon/pause.png';
    } else {
        audioElement.pause()
        turnPlay(0);
    }
});

audioElement.addEventListener('timeupdate', () => {
    myProgressBar.value = parseInt((audioElement.currentTime / audioElement.duration) * 100);
})

myProgressBar.addEventListener('change', () => {
    audioElement.currentTime = parseInt((myProgressBar.value * audioElement.duration) / 100);
})

volumeBar.addEventListener('change', () => {
    audioElement.volume = volumeBar.value / 100;
})

masterBack.addEventListener('click', () => {
    turnPlay(0);
    currentSongId--;
    if (currentSongId < 0){
        currentSongId = 9;
    }
    turnPlay(1);
})

masterFor.addEventListener('click', () => {
    turnPlay(0);
    currentSongId++;
    if (currentSongId > 9){
        currentSongId = 0;
    }
    turnPlay(1);
})