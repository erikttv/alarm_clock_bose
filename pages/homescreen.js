const {ipcRenderer} = require('electron');

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

function stopAlarm(){
    ipcRenderer.send('alarmClock', 'stop');
}

ipcRenderer.on('updateText', (event, text) => {
    document.querySelector('#infoToUser').innerHTML = text;
});

ipcRenderer.on('changeToAlarmUI', (event) => {
    // Removing different elements from the screen
    let hideElements = document.querySelectorAll('.UIBeforeSetAlarm');
    hideElements.forEach(element => {
        element.style.display = "none";
    });

    // Adding a stop alarm button
    document.querySelector('#stopAlarm').innerHTML = '<button type="button" onclick="stopAlarm()">Stop Alarm</button>'

    // Centering the body
    document.querySelector('body').classList.add('setAlarmDiv');
    document.querySelector('body').classList.remove('centeringToScreen');
});

ipcRenderer.on('changeToSetAlarmUI', (event) =>{
    let hideElements = document.querySelectorAll('.UIBeforeSetAlarm');
    hideElements.forEach(element => {
        element.style.display = "block";
    });

    // Removing a stop alarm button
    document.querySelector('#stopAlarm').innerHTML ='';
    document.querySelector('body').classList.remove('setAlarmDiv');
    document.querySelector('#infoToUser').innerHTML = 'Please Select Preset';
    document.querySelector('body').classList.add('centeringToScreen');
});

ipcRenderer.on('changeNameOfPreset', (event, listWithChannels) => {
    let newButtons = ` <button id="PRESET_1" type="button" onclick="savePreset(this.id)">` + listWithChannels[0] + `</button>
    <button id="PRESET_2" type="button" onclick="savePreset(this.id)">`+listWithChannels[1]+`</button>
    <button id="PRESET_3" type="button" onclick="savePreset(this.id)">`+listWithChannels[2]+`</button>
    <br>
    <button id="PRESET_4" type="button" onclick="savePreset(this.id)">`+listWithChannels[3]+`</button>
    <button id="PRESET_5" type="button" onclick="savePreset(this.id)">`+listWithChannels[4]+`</button>
    <button id="PRESET_6" type="button" onclick="savePreset(this.id)">`+listWithChannels[5]+`</button>`;
    document.querySelector('#buttonPreset').innerHTML = newButtons;
});