const {ipcRenderer} = require('electron');

function startAlarm(preset){
    ipcRenderer.send('boseAPI', 'startPreset', preset);
}

function stopAudio(){
    ipcRenderer.send('boseAPI', 'stopAudio');
}
