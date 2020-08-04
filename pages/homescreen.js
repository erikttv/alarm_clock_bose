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
    let chosenButton = document.querySelector('.choosenButton');
    if(chosenButton){
        chosenButton.classList.remove('choosenButton');
    }
    document.querySelector('#'+preset).classList.add('choosenButton');
}

function startAlarm(){
    let timeForAlarm = document.getElementById('timeOfAlarm').value;
    ipcRenderer.send('alarmClock', 'start', timeForAlarm);
}

function stopAlarm(){
    ipcRenderer.send('alarmClock', 'stop');
}

function startRadio(preset){
    ipcRenderer.send('boseAPI','startPreset', preset);
    let chosenButton = document.querySelector('.choosenButton');
    if(chosenButton){
        chosenButton.classList.remove('choosenButton');
    }
    document.querySelector('#'+preset).classList.add('choosenButton');
}

function alarmApp(){
    ipcRenderer.send('updateScreen', 'alarm');
}

function controlerApp(){
    ipcRenderer.send('updateScreen', 'controler');
}

function changeFunction(){
    ipcRenderer.send('updateScreen', 'changeUI');
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

ipcRenderer.on('changeUI', (event, userInterface) => {
    document.querySelector('#mainScreenUI').innerHTML = userInterface;
});