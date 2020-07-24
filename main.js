const {app, BrowserWindow, ipcMain} = require('electron');

// Setting up xml for Bose
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

/*
xhttp.onreadystatechange = function (){
    if (xhttp.readyState == 4 && xhttp.status == 200){
        xmlDoc = xhttp.responseXML;
    }
}
*/


// ipcMain method coming in
ipcMain.on('boseAPI', (event, arg1, arg2, arg3) => {
    console.log('boseAPI: ' + arg1 + ' ' + arg2 + ' ' + arg3);
    boseAPI[arg1](arg2, arg3);
});

// Object with API connected to Bose Speaker
let boseAPI = {
    getInfo: function(IPAdress){
        xhr.open('GET', IPAdress + ':8090/info', true);
        xhr.send();
        // Must parse the response somehow
        console.log(xhr.responseXML);
    }, 

    startAlarm: function(preset){
        console.log(preset);
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


