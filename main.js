const {app, BrowserWindow, ipcMain} = require('electron');
var request = require('request');

// Global variables used in the request to bose API
var ipAdress = '192.168.1.200';
var socket = ':8090';

// ipcMain method coming in
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
    newTime: function(){
        var d = new Date();
        console.log(d);
        let time = d.getHours();
        console.log('Timer: ' + time);
        console.log('Minutter: ' + d.getMinutes());
    }
}

// Object with API connected to Bose Speaker
let boseAPI = {
    getInfo: function(){
        var options = {
            'method': 'GET',
            'url': 'http://' + ipAdress + socket + '/info',
          };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
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
    const win = new BrowserWindow({
        width: 350,
        height: 500,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile(__dirname + '/pages/homescreen.html');
    
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


