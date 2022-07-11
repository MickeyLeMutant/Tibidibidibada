const addLevel = (dataNode, htmlNode, keywords) => {
    let newLi = document.createElement('li');
    let newBtn = document.createElement("button");
    newBtn.innerHTML = dataNode.name;
    newBtn.onclick = function () {
        let kw = keywords.slice();
        kw.push(dataNode.name);
        alert(kw.join(','));
        files.map((f) => {
            kw.every(term => f.tags.toLowerCase().includes(term.toLowerCase())) ? alert("ok " + f.name) : alert("pas ok " + f.name);
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