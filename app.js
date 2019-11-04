const newToDoArea = document.getElementById("newToDo");
const status = document.getElementById("statusToDo");
const empty = document.querySelector(".empty");
const listMain = document.querySelector('.list');

//check and parse if string is JSON
const parseJSON = string => {
  try {
    const valid = JSON.parse(string);
    if (valid && typeof valid === 'object') {
      return valid;
    }
  } catch (e) {}
  return false;
};

const fetchList = () => {
  let list = parseJSON(localStorage.getItem('toDoList'));
  if (!list) {
    list = {
      "toDos": []
    };

  }
  return list;
};

//Random unique id function as I couldn't use uuid on CodePen
const guid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000).
    toString(16).
    substring(1);
  };
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

const clearRender = () => {
  while (listMain.lastChild) {
    listMain.removeChild(listMain.lastChild);
  }
};

const renderList = () => {
  clearRender();
  if (toDoList && toDoList.toDos.length) {
    toDoList.toDos.forEach(toDo => {
      const listId = toDo.id;
      //Create Item
      let item = document.createElement('div');
      item.className = 'item';
      item.id = 'list-' + listId;
      //Create Item Inner
      let itemInner = document.createElement('div');
      itemInner.className = 'item-inner';
      //create textnode and add to item inner
      text = document.createTextNode(toDo.value);
      itemInner.appendChild(text);
      //create button
      let button = document.createElement('button');
      button.className = 'remove';
      button.setAttribute('data-list', listId);
      button.textContent = 'x';
      button.onclick = removeToDo;
      //Combine elements and insert to page
      item.appendChild(itemInner);
      item.appendChild(button);
      listMain.appendChild(item);
    });
    empty.style.display = 'none';
  } else {
    empty.style.display = 'block';
  }
};

const refreshToDo = () => {
  resetTextArea();
  status.style.display = "none";
  status.style.innerText = "";
  newToDoArea.classList.remove('error');
  renderList();
};

const resetTextArea = () => {
  newToDoArea.style.height = "68px";
  newToDoArea.value = "";
};

const resizeTextArea = () => {
  let tempHeight = parseFloat(newToDoArea.scrollHeight);
  tempHeight += 4;
  tempHeight = tempHeight > 222 ? 222 : tempHeight;
  tempHeight += "px";
  newToDoArea.style.height = tempHeight;
};

const removeToDo = function () {
  let src = this.getAttribute('data-list');
  document.querySelector('#list-' + src).remove();
  toDoList.toDos = toDoList.toDos.filter(toDo => {
    return toDo.id != src;
  });
  saveToDo();
  refreshToDo();
};

const startToDo = () => {
  refreshToDo(toDoList);
  newToDoArea.disabled = false;
};

const saveToDo = () => {
  localStorage.setItem('toDoList', JSON.stringify(toDoList));
};

const toDoList = fetchList();
startToDo();

document.getElementById('clearList').addEventListener('click', e => {
  toDoList.toDos = [];
  saveToDo();
  refreshToDo();
});

newToDoArea.addEventListener('input', e => {
  resizeTextArea();
});

document.getElementById('toDoForm').addEventListener('submit', e => {
  e.preventDefault();
  newToDoArea.classList.remove('error');
  let text = newToDoArea.value.trim();
  if (text !== '') {
    const listId = guid();
    const toDo = {
      'id': listId,
      'value': text
    };

    toDoList.toDos.push(toDo);
    saveToDo();
    refreshToDo();
  } else {
    newToDoArea.classList.add('error');
  }
  return false;
});