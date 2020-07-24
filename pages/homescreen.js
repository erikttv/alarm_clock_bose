const {ipcRenderer} = require('electron');

function startAlarm(preset){
    ipcRenderer.send('boseAPI', 'startAlarm', preset);
}
