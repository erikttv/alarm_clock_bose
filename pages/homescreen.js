const {ipcRenderer, ipcMain} = require('electron');

function startAlarm(preset){
    ipcRenderer.send('boseAPI', 'startPreset', preset);
}

function startDate(){
    ipcRenderer.send('alarmClock', 'newTime');
}

function pauseAudio(){
    ipcRenderer.send('boseAPI', 'pauseAudio');
}

function savePreset(preset){
    ipcRenderer.send('alarmClock', 'savePreset', preset)
}

function startAlarm(){
    let timeForAlarm = document.getElementById('timeOfAlarm').value;
    ipcRenderer.send('alarmClock', 'start', timeForAlarm);
}

ipcRenderer.on('updateText', (event, text) => {
    document.querySelector('#infoToUser').innerHTML = text;
});

ipcRenderer.on('changeToAlarmUI', (event) => {
    // Removing different elements from the screen
    let hideElements = document.querySelectorAll('.changeUIWhenAlarm');
    hideElements.forEach(element => {
        element.style.display = "none";
    });
    /*
    document.querySelector('#presetButtons').style.display = "none";
    document.querySelector('#startAlarm').style.display = "none";
    document.querySelector('#setAlarm')
    */

    // Centering the body
    document.querySelector('body').classList.add('setAlarmDiv');

});


