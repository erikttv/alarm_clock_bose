const {app, BrowserWindow, BrowserView, ipcMain} = require('electron');

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

function getInfoAPI(){
    xhr.open('GET','192.168.1.200:8090/info', true);
    xhr.send();
    console.log(xhr.responseXML);
}

function startHomescreen(){
    const win = new BrowserWindow({
        width: 800,
        height: 600,
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
      createWindow();
    }
  });


