const readLevelFromPath = (path, parent) => {
    // list Directories
    const files = fs.readdirSync(path.toString(), { withFileTypes: true });
    files.filter(dirent => dirent.isDirectory())
        .map(file => {
            // display            
            let newLi = document.createElement('li');
            newLi.innerText = file.name;
            let newUl = document.createElement('ul');
            // run recursively
            readLevelFromPath(path + "/" + file.name, newUl);
        });
    newLi.appendChild(newUl);
    parent.appendChild(newLi);
}
