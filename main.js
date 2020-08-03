const {app, BrowserWindow, ipcMain} = require('electron');
var request = require('request');
var parseString = require('xml2js').parseString;

// Global variables used in the request to bose API
var ipAdress = '192.168.1.200'; // Change the local ip to your own SoundTouch Speaker
var socket = ':8090'; // This is the standard port for SoundTouch Speakers
var preset = null; // Saving preset choosen for when alarm starts
var mainWindow = null; // The window opening
var intervalID; // id for interval when alarm has started
var channelName = []; // Name of the radio preset, index 0 is PRESET_1 and index 1 is PRESET_2 etc...

ipcMain.on('boseAPI', (event, arg1, arg2, arg3) => {
    console.log('boseAPI: ' + arg1 + ' ' + arg2 + ' ' + arg3);
    boseAPI[arg1](arg2, arg3);
});

ipcMain.on('alarmClock', (event, arg1, arg2, arg3) => {
    console.log('alarmClock: ' + arg1 + ' ' + arg2 + ' ' + arg3);
    alarmClock[arg1](arg2, arg3);
});

// Alarm object here
let alarmClock = {
    // Testing the time function
    newTime: function(){ 
        var d = new Date();
        console.log(d);
        let minutes = d.getMinutes();
        let hours = d.getHours();
        console.log('Timer: ' + hours);
        console.log('Minutter: ' + minutes);
        let addedMinute = minutes + 1;
        let intervalID = setInterval(()=> {
            let e = new Date();
            console.log('now: ' + e.getMinutes() + ' exactly: ' + e + ' future: ' + addedMinute)
            if(e.getMinutes() == addedMinute){
                clearInterval(intervalID);
            } else {
                console.log('Minute is not equal');
            }
        }, 3000);
    },
    start: function(timeForAlarm){
        if(timeForAlarm == ''){
            mainWindow.webContents.send('updateText', 'Please Choose Time');
            return;
        }
        if(!preset){
            mainWindow.webContents.send('updateText', 'Please Choose Radio Channel');
            return;
        }
        // Manipulating the string to fetch hour and minutes
        let splittedTime = timeForAlarm.split(':');
        let hours = Number(splittedTime[0]);
        let minute = Number(splittedTime[1]);
        
        // Starting the process of checking the time regularly
        this.startCheckInterval(hours, minute);
        this.changeToAlarmUI(timeForAlarm);
    },
    savePreset: function(newPreset){
        preset = newPreset;
        console.log('Preset saved. ' + newPreset);
    },
    startCheckInterval: function(hours, minute){
        intervalID = setInterval(() => {
            let currentTime = new Date();
            let isMinutesEqual = currentTime.getMinutes() == minute;
            let isHoursEqual = currentTime.getHours() == hours;
            if(isMinutesEqual && isHoursEqual){
                console.log('Minute: ' + currentTime.getMinutes() + minute +'  and hours: ' + currentTime.getHours() + hours +' are equal.');
                boseAPI['startPreset'](preset);
                this.stop();
            } else {
                console.log('Not equal! ' + currentTime);
            }
        }, 1000)
    },
    changeToAlarmUI: function(timeForAlarm){
        // Info to screen that interval is set
        let presetNumber = preset.split('_');
        let indexOfChannel = Number(presetNumber[1])-1;
        mainWindow.webContents.send('updateText', channelName[indexOfChannel] + ' at ' + timeForAlarm);
        mainWindow.webContents.send('changeToAlarmUI');
    },
    stop: function(){ // Stopping alarm and setting UI back to normal
        clearInterval(intervalID);
        mainWindow.webContents.send('changeToSetAlarmUI');
    }
}

// Object with API connected to Bose Speaker
let boseAPI = {
    getInfoAboutPreset: function(){
        var options = {
            'method': 'GET',
            'url': 'http://' + ipAdress + socket + '/presets',
          };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            parseString(response.body, function (err, result) {
                // Getting info about the preset
                let preset = result.presets.preset;
                preset.forEach(element => {
                    channelName.push(element.ContentItem[0].itemName[0]);
                });
            });
            // Updating the UI
            mainWindow.webContents.send('changeNameOfPreset', channelName);
        });
    }, 
    startPreset: function(preset){
        var options = {
            'method': 'POST',
            'url': 'http://' + ipAdress + socket + '/key',
            'headers': {
              'Content-Type': 'application/xml'
            },
            body: `<?xml version="1.0" ?>\n<key state="release" sender="Gabbo">` + preset + `</key>`
          };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
        });
    },
    pauseAudio: function(){
        var options = {
            'method': 'POST',
            'url': 'http://' + ipAdress + socket + '/key',
            'headers': {
              'Content-Type': 'application/xml'
            },
            body: `<?xml version="1.0" ?>\n<key state="press" sender="Gabbo">PAUSE</key>`
          };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
        });
    }
}

// Setting up and starting electron below 
function startHomescreen(){
    mainWindow = new BrowserWindow({
        width: 450, //600
        height: 600, //450
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.loadFile(__dirname + '/pages/homescreen.html');
    
    // Fetching information about preset and adding it to the homescreen
    mainWindow.webContents.on('did-finish-load', ()=>{
        boseAPI['getInfoAboutPreset']();
      });
}

app.whenReady().then(startHomescreen);

app.on('window-all-closed', ()=> {
    if(process.platform != 'darwin'){
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      startHomescreen();
    }
  });


