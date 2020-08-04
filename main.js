const {app, BrowserWindow, ipcMain, ipcRenderer} = require('electron');
var request = require('request');
var parseString = require('xml2js').parseString;

// Global variables used in the request to bose API
var ipAdress = '192.168.1.200'; // Change the local ip to your own SoundTouch Speaker
var socket = ':8090'; // This is the standard port for SoundTouch Speakers
var preset = null; // Saving preset choosen for when alarm starts
var mainWindow = null; // The window opening
var intervalID; // id for interval when alarm has started
var channelName = [1,2,3,4,5,6]; // Name of the radio preset, index 0 is PRESET_1 and index 1 is PRESET_2 etc...
var currentScreen = 'controler'; // is a string

ipcMain.on('boseAPI', (event, arg1, arg2, arg3) => {
    console.log('boseAPI: ' + arg1 + ' ' + arg2 + ' ' + arg3);
    boseAPI[arg1](arg2, arg3);
});

ipcMain.on('alarmClock', (event, arg1, arg2, arg3) => {
    console.log('alarmClock: ' + arg1 + ' ' + arg2 + ' ' + arg3);
    alarmClock[arg1](arg2, arg3);
});

ipcMain.on('updateScreen', (event, arg1, arg2)=>{
    console.log('updateScreen: ' + arg1 + ' ' + arg2);
    UIToScreen[arg1](arg2);
});

let UIToScreen = {
    alarm: function(){
        if(mainWindow){
            currentScreen = 'alarm';
            let screen = `
                <div class="middle UIBeforeSetAlarm">
                    <input type="time" id="timeOfAlarm" name="timeOfAlarm">
                </div>
                <br class="UIBeforeSetAlarm">
                <br class="UIBeforeSetAlarm">
                <div id="buttonPreset" class="middle UIBeforeSetAlarm">
                    <button id="PRESET_1" type="button" onclick="savePreset(this.id)">`+ channelName[0]+`</button>
                    <button id="PRESET_2" type="button" onclick="savePreset(this.id)">`+ channelName[1]+`</button>
                    <button id="PRESET_3" type="button" onclick="savePreset(this.id)">`+ channelName[2]+`</button>
                    <br>
                    <button id="PRESET_4" type="button" onclick="savePreset(this.id)">`+ channelName[3]+`</button>
                    <button id="PRESET_5" type="button" onclick="savePreset(this.id)">`+ channelName[4]+`</button>
                    <button id="PRESET_6" type="button" onclick="savePreset(this.id)">`+ channelName[5]+`</button>
                </div>
                <br class="UIBeforeSetAlarm">
                <div class="middle UIBeforeSetAlarm">
                    <button type="button" onclick="startAlarm()">Start Alarm</button>
                </div>
                <div class="middle" id="stopAlarm">
                    <!-- When activating alarm, a stop alarm button will be inserted here -->
                </div>
                <br class="UIBeforeSetAlarm">
                <br>
                <div class="UIBeforeSetAlarm">
                    <button class="middle" type="button" onclick="changeFunction()">Change Functionality</button>
                </div>`;
            mainWindow.webContents.send('changeUI', screen);
            mainWindow.webContents.send('updateText', 'Welcome to Bose Alarm!')
        }
    },
    alarmSet: function(timeForAlarm){
        // Info to screen that interval is set
        if(mainWindow){
            currentScreen = 'alarmSet';
            let presetNumber = preset.split('_');
            let indexOfChannel = Number(presetNumber[1])-1;
            mainWindow.webContents.send('updateText', channelName[indexOfChannel] + ' at ' + timeForAlarm);
            mainWindow.webContents.send('changeToAlarmUI');
        }
    },
    controler: function(){
        if(mainWindow){
            currentScreen = 'controler';
            let screen = `
                <div id="buttonPreset" class="middle">
                    <button id="PRESET_1" type="button" onclick="startRadio(this.id)">`+ channelName[0]+`</button>
                    <button id="PRESET_2" type="button" onclick="startRadio(this.id)">`+ channelName[1]+`</button>
                    <button id="PRESET_3" type="button" onclick="startRadio(this.id)">`+ channelName[2]+`</button>
                    <br>
                    <button id="PRESET_4" type="button" onclick="startRadio(this.id)">`+ channelName[3]+`</button>
                    <button id="PRESET_5" type="button" onclick="startRadio(this.id)">`+ channelName[4]+`</button>
                    <button id="PRESET_6" type="button" onclick="startRadio(this.id)">`+ channelName[5]+`</button>
                </div>
                <br>
                <div class="middle">	
                    <button type="button" onclick="pauseAudio()">Stop Audio</button>	
                </div>
                <br>
                <div>
                    <button type="button" onclick="changeFunction()">Change Functionality</button>
                </div>`;
            mainWindow.webContents.send('changeUI', screen);
            mainWindow.webContents.send('updateText', 'Welcome to Bose Controler!')
        }
    },
    changeUI: function(){
        if(currentScreen == 'controler'){
            mainWindow.webContents.send('changeBackground', 'add');
            this.alarm();
        } else{
            mainWindow.webContents.send('changeBackground', 'remove');
            this.controler();
        }
    }
}

// Alarm object here
let alarmClock = {
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
        UIToScreen['alarmSet'](timeForAlarm);
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
                for (let index = 0; index < preset.length; index++) {
                    channelName[index] = preset[index].ContentItem[0].itemName[0];
                }
            });
            // Updating the UI
            if(currentScreen == 'controler'){
                UIToScreen['controler']();
            } else{
                UIToScreen['alarm']();
            }
            // mainWindow.webContents.send('changeNameOfPreset', channelName);
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
    });
    mainWindow.loadFile(__dirname + '/pages/homescreen.html');
    
    // Fetching information about preset and adding it to the homescreen
    mainWindow.webContents.on('did-finish-load', ()=>{
        boseAPI['getInfoAboutPreset']();
      });
}

app.whenReady().then(startHomescreen);


app.on('window-all-closed', ()=> {
    app.quit();
});



app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      startHomescreen();
    }
});