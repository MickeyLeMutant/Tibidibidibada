const searchBar = document.querySelector('#search');
searchBar.addEventListener('keyup', searchUser);

function searchUser(e) {
    const text = e.target.value.toLowerCase();
    const kw = text.split(' ');
    research(kw);
    searchBar.text = text;
}

const researchFromPath = (path) => {
    disposeAll();
    const directories = fs.readdirSync(directoryPath.toString() + path.toString(), { withFileTypes: true });
    results.innerText = "";
    let newTitle = document.createElement('h1');

    let newBtn = document.createElement("button");
    newTitle.innerText = path.toString().slice(path.toString().lastIndexOf("/") + 1);
    newBtn.innerHTML = "Open in explorer";
    newBtn.onclick = function () {
        let pathRes = directoryPath.toString() + path.toString();
        pathRes = pathRes.replace(/\//g, '\\');
        shell.beep();
        shell.openPath(pathRes);
    };
    let newUl = document.createElement('ul');

    directories.filter(dirent => dirent.isFile())
        .map(file => {
            const ext = pathR.extname(path + "/" + file.name).toLowerCase();
            if (ext === ".stl" || ext ===".gcode" || ext ===".3mf") {
                // display file
                let newLi = document.createElement('li');
                let newCard = document.createElement('div');
                //let newTitle = document.createElement('h1');
                let newViewer = document.createElement('div');
                newViewer.classList.add('viewer');
                newViewer.onclick = click;

                //newTitle.innerText = file.name.replace(/\.[^/.]+$/, "");

                //newCard.appendChild(newTitle);
                newCard.appendChild(newViewer);
                newLi.appendChild(newCard);

                newUl.appendChild(newLi);
                ThreeDViewer(directoryPath.toString() + path + "/" + file.name, newViewer)

            }
        });
    results.appendChild(newTitle);
    results.appendChild(newBtn);
    results.appendChild(newUl);
}

function click() {
    alert('click');
}

const research = (kw) => {

    results.innerText = "";

    let newUl = document.createElement('ul');
    results.appendChild(newUl);

    files.map((f) => {
        if (kw.every(term => f.tags.toLowerCase().includes(term.toLowerCase()))) {
            let newLi = document.createElement('li');
            let newH1 = document.createElement('h1');
            newH1.innerText = f.name;
            let filesUL = document.createElement('ul');
            // liste des fichiers
            f.files && f.files.map(file => {
                let fileLi = document.createElement('li');
                file.name && (fileLi.innerText = file.name);
                file.path && (fileLi.innerText += " ( " + file.path + " )");
                // liste des gcode par imprimante                
                let gcodeUL = document.createElement('ul');
                file.gcode && file.gcode.map(gcode => {
                    let gcodeLi = document.createElement('li');
                    // boutton
                    let gcodeButton = document.createElement('button');
                    gcodeButton.innerText = gcode.name;
                    gcodeButton.onclick = function () {
                        shell.showItemInFolder(directoryPath + gcode.path)
                        alert(directoryPath + gcode.path);
                    };
                    gcodeLi.appendChild(gcodeButton);
                    if (gcode.printer) {
                        gcodeLi.innerText += " (" + gcode.printer + ")";
                    }
                    gcodeUL.appendChild(gcodeLi);
                })
                fileLi.appendChild(gcodeUL);
                filesUL.appendChild(fileLi);
            })
            newLi.appendChild(newH1);
            newLi.appendChild(filesUL);
            newUl.appendChild(newLi);
        }
    })
}