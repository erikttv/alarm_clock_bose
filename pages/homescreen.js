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


