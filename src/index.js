import { app, BrowserWindow } from 'electron';
import staticServer from 'static-server';
import fs from 'fs';

let mainWindow;

console.log('Reading config...');
let config = fs.readFileSync(`${__dirname}/server/config.json`);
config = JSON.parse(config.toString());

console.log('Starting server...');

let server = new staticServer({
    rootPath: `${__dirname}/server/`,
    port: config['server-port'],
});
server.start(() => {
   console.log('Server started at port: ' + server.port + '.');
});

const createWindow = () => {
   // Create the browser window.
   mainWindow = new BrowserWindow({
       width: config['screen-width'],
       height: config['screen-height'],
       resizable: false,
  });

  mainWindow.loadURL('http://127.0.0.1:' + config['server-port']);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
