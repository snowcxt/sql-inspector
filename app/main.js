var app = require('app'); // Module to control application life.
var BrowserWindow = require('browser-window'); // Module to create native browser window.
var updater = require('electron-updater');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
    updater.on('ready', function () {
        mainWindow = new BrowserWindow({
            title: "Sql Seer",
            width: 1000,
            height: 800,
            icon: __dirname + '/icon.png'
        });
        mainWindow.loadUrl('file://' + __dirname + '/index.html?version=' + app.getVersion());

        mainWindow.on('closed', function () {
            mainWindow = null;
        });
    });
    updater.on('updateRequired', function () {
        app.quit();
    });
    updater.on('updateAvailable', function () {
        mainWindow.webContents.send('update-available');
    });
    updater.start();
});
