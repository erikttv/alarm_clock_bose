const {ipcRenderer} = require('electron');

function startAlarm(preset){
    ipcRenderer.send('boseAPI', 'startPreset', preset);
}

function pauseAudio(){
    ipcRenderer.send('boseAPI', 'pauseAudio');
}
