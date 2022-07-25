const { shell } = require('electron');
const results = document.getElementById('results');
const pathR = require('path');


const filters = document.getElementById('filters');

// #region events
ipcRenderer.on('workspace', (event, arg) => {
    ipcRenderer.removeAllListeners('workspace');

    directoryPath = arg.path;

    const cfgPath = directoryPath + `/tibi.json`

    alert(cfgPath);
    if (fs.existsSync(cfgPath)) {
        fs.readFile(cfgPath, (err, data) => {
            if (err) throw err;
            let cfg = JSON.parse(data);
            let newUl = document.createElement('ul');
            filters.appendChild(newUl);
            files = arg.cfg.files;
            arg.cfg.filters.map((child) => {
                addLevel(child, newUl, []);
            })
        });
    } else {
        console.log('does not')
    }
}
)

ipcRenderer.on('filters_init', (event, arg) => {
    ipcRenderer.removeAllListeners('filters_init');

    let newUl = document.createElement('ul');
    filters.appendChild(newUl);
    files = arg.cfg.files;
    arg.cfg.filters.map((child) => {
        addLevel(child, newUl, []);
    })
})

ipcRenderer.on('direct_directory', (event, arg) => {
    ipcRenderer.removeAllListeners('direct_directory');

    directoryPath = arg.directoryPath + "/";

    let newUl = document.createElement('ul');
    filters.appendChild(newUl);
    //const path = arg.directoryPath;
    let str = "";
    try {
        fs.readdirSync(arg.directoryPath.toString(), { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(file => {
                //readLevelFromPath(arg.directoryPath.toString() + "/" + file.name, file, newUl);
                readLevelFromPath(file.name, file, newUl);
            });
    }
    catch (err) {
        alert(err);
    }
})

// #endregion

//#region directories

const readLevelFromPath = (path, file, parent) => {
    let newLi = document.createElement('li');
    let newUl = document.createElement('ul');
    let newBtn = document.createElement("button");

    const directories = fs.readdirSync(directoryPath.toString() + path.toString(), { withFileTypes: true });
    directories.filter(dirent => dirent.isDirectory())
        .map(file => {
            readLevelFromPath(path + "/" + file.name, file, newUl,);
        });
    //displayCardD(path.toString(), newLi);
    newBtn.innerHTML = file.name.slice(0,8);
    newBtn.onclick = function () {
        researchFromPath(path);
    };
    newLi.appendChild(newBtn);
    newLi.appendChild(newUl);
    parent.appendChild(newLi);
}

//#endregion

//#region tags
const addLevel = (dataNode, htmlNode, keywords) => {
    let newLi = document.createElement('li');
    let newBtn = document.createElement("button");
    newBtn.innerHTML = dataNode.name;
    newBtn.onclick = function () {
        let kw = keywords.slice();
        kw.push(dataNode.name);
        research(kw);
    };
    newLi.appendChild(newBtn);
    htmlNode.appendChild(newLi);
    let newUl = document.createElement('ul');
    newLi.appendChild(newUl);
    dataNode.children && dataNode.children.map((child) => {
        const kw = keywords.slice();
        kw.push(dataNode.name)
        addLevel(child, newUl, kw);
    })
}

//#endregion

//#region display

const displayCardD = (pathDisplay, htmlNode) => {
    const cardDiv = document.createElement('div');
    // titre
    const titleCardH1 = document.createElement('h1');
    titleCardH1.innerText = path.basename(pathDisplay);

    // liste des stl
    const stlFiles = fs.readdirSync(pathDisplay.toString())
        .filter(dirent => path.extname(dirent).toLowerCase() === ".stl")
    const listSTLUL = document.createElement('ul');
    stlFiles.map(file => {
        const stlLi = document.createElement('li');
        stlLi.innerText = file.name;
        listSTLUL.appendChild(stlLi);
        // liste des gcode
    }
    )
    cardDiv.appendChild(listSTLUL);
    cardDiv.appendChild(titleCardH1);
    htmlNode.appendChild(cardDiv);
}

//#endregion