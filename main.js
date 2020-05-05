const { app, BrowserWindow, Menu, ipcMain, Tray } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path')
Menu.setApplicationMenu(null)

let appTray = null;   // 引用放外部，防止被当垃圾回收
// 隐藏主窗口，并创建托盘，绑定关闭事件
const setTray = () => {
    // 系统托盘右键菜单
    let trayMenuTemplate = [{     // 系统托盘图标目录
        label: '退出',
        click: function () {
            app.quit();
        }
    }];
    // 当前目录下的app.ico图标
    let iconPath = path.join(__dirname, 'public/logo192.png');
    appTray = new Tray(iconPath);
    // 图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    // 隐藏主窗口
    mainWindow.hide();
    // 设置托盘悬浮提示
    appTray.setToolTip('never forget');
    // 设置托盘菜单
    appTray.setContextMenu(contextMenu);
    // 单击托盘小图标显示应用
    appTray.on('click', function () {
        // 显示主程序
        mainWindow.show();
        // 关闭托盘显示
        appTray.destroy();
    });
};

let mainWindow
let loginWindow
const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 680,
        webPreferences: { nodeIntegration: true },
        show: false, // 先隐藏
        //transparent: true
    })
    const urlLocation = isDev ? 'http://localhost:3000/nav' : 'dummyurl'
    mainWindow.loadURL(urlLocation)
    mainWindow.on('ready-to-show', function () {
        mainWindow.show() // 初始化后再显示
        if (loginWindow) {
            loginWindow.close();
        }
    })
    mainWindow.on('close', () => mainWindow = null)
    //mainWindow.webContents.openDevTools()
}
const createLoginWindow = () => {
    loginWindow = new BrowserWindow({
        width: 427,
        height: 330,
        frame: false,
        webPreferences: { nodeIntegration: true },
        show: false, // 先隐藏
        resizable: false,
        transparent: true,
        //alwaysOnTop: true
    })
    const urlLocation = isDev ? 'http://localhost:3000/login' : 'dummyurl'
    loginWindow.loadURL(urlLocation)
    //setTray()
    loginWindow.on('ready-to-show', function () {
        loginWindow.show() // 初始化后再显示
    })
    loginWindow.on('close', () => {
        loginWindow = null
    })
    //loginWindow.webContents.openDevTools()
}
ipcMain.on('open-main-window', createMainWindow)//打开主界面
ipcMain.on('minimize-login-window', () => loginWindow.minimize())
ipcMain.on('close-login-window', () => loginWindow.close())
ipcMain.on('close-main-window', () => {
    createLoginWindow()
    mainWindow.close()
})

app.on('ready', createLoginWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createLoginWindow()
    }
})