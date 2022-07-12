const results = document.getElementById('results');

const addLevel = (dataNode, htmlNode, keywords) => {
    let newLi = document.createElement('li');
    let newBtn = document.createElement("button");
    newBtn.innerHTML = dataNode.name;
    newBtn.onclick = function () {
        results.innerText = "";
        let kw = keywords.slice();
        kw.push(dataNode.name);
        let newUl = document.createElement('ul');
        results.appendChild(newUl);
        files.map((f) => {
            if (kw.every(term => f.tags.toLowerCase().includes(term.toLowerCase()))) {
                let newLi = document.createElement('li');
                let newH1 = document.createElement('h1');
                newH1.innerText = f.name;
                let filesUL = document.createElement('ul');
                f.files && f.files.map(file => {
                    let fileLi = document.createElement('li');
                    file.name && (fileLi.innerText = file.name);
                    file.path && (fileLi.innerText += " ( " + file.path + " )");
                    filesUL.appendChild(fileLi);
                }
                )
                newLi.appendChild(newH1);
                newLi.appendChild(filesUL);
                newUl.appendChild(newLi);
            }
        })
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
