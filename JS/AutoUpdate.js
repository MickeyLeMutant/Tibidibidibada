const { ipcRenderer } = window.require('electron');
const version = document.title;//document.getElementById('version');

ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    document.title.innerText = 'Version ' + arg.version;
});

const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
});

ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});

let files;
const filters = document.getElementById('filters');
ipcRenderer.on('filters_init', (event, arg) => {
    ipcRenderer.removeAllListeners('filters_init');

    let newUl = document.createElement('ul');
    filters.appendChild(newUl);
    files = arg.cfg.files;
    arg.cfg.filters.map((child) => {
        addLevel(child, newUl, []);
    })
})

function closeNotification() {
    notification.classList.add('hidden');
}

function restartApp() {
    ipcRenderer.send('restart_app');
}

const searchBar = document.querySelector('#search');
searchBar.addEventListener('keyup', searchUser);
function searchUser(e) {
    const text = e.target.value.toLowerCase();
    alert("search : " + text);
    searchBar.text = text;
}
