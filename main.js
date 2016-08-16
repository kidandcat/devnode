electron = require('electron')
DataStore = require('nedb')
path = require('path')
app = electron.app
ipc = require('electron').ipcMain
dialog = electron.dialog;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })
    mainWindow.loadURL(`file://${__dirname}/index.html`)
    mainWindow.on('closed', function() {
        mainWindow = null
    })
    loadScripts()
    loadDir()
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})





function loadDir() {
    path = dialog.showOpenDialog({
        properties: ['openDirectory']
    });
}

function loadScripts() {
    require('./components/shortcut.js')
}

ipc.on('loadDB', function(event, arg) {
    console.log('loading db... ', path.join(__dirname, 'db.json'));
    try {
      console.log('ppath: ', path[0] + '/project.db');
        db = new DataStore({
            filename: path[0] + '/project.db',
            autoload: true
        });
        event.sender.send('dbLoaded', docs)
    } catch (e) {
        event.sender.send('dbLoaded', e)
    }
})

ipc.on('saveDiagram', function(event, arg) {
    db.insert(arg, function(err, newDoc) {
        if (err) {
            db.update({
                _id: 'diagram'
            }, arg, function(err) {
                console.log('DB update ', err);
            });
        }
    });
})

ipc.on('loadDiagram', function(event, arg) {
    db.find({
        _id: 'diagram'
    }, function(err, docs) {
        event.sender.send('loaded', docs)
    });
})
