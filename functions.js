//Random unique id function as I couldn't use uuid on CodePen
const guid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000).
    toString(16).
    substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
}

const emptyEl = (el) => {
  while (el.lastChild) el.removeChild(el.lastChild)
}

//check and parse if string is JSON
const parseJSON = string => {
  try {
    const valid = JSON.parse(string)
    if (valid && typeof valid === 'object') {
      return valid
    }
  } catch (e) {}
  return false
}

const fetchList = () => {
  let list = parseJSON(localStorage.getItem('toDoList'))
  if (!list) {
    list = {
      "toDos": []
    }
  }
  return list
}

const saveToDo = (toDoList) => {
  localStorage.setItem('toDoList', JSON.stringify(toDoList))
}

const removeToDo = function () {
  const toDoList = fetchList()
  let src = this.getAttribute('data-list')
  document.querySelector('#list-' + src).remove()
  toDoList.toDos = toDoList.toDos.filter(toDo => {
    return toDo.id != src
  })
  saveToDo(toDoList)
  renderToDo(toDoList)
}

const clearRender = () => {
  while (listMain.lastChild) {
    listMain.removeChild(listMain.lastChild)
  }
}

const resizeTextArea = () => {
  let tempHeight = parseFloat(newToDoArea.scrollHeight)
  tempHeight += 4
  tempHeight = tempHeight > 222 ? 222 : tempHeight
  tempHeight += "px"
  newToDoArea.style.height = tempHeight
}

const renderToDo = (toDoList) => {
  resetTextArea()
  status.style.innerText = ""
  newToDoArea.classList.remove('error')
  newToDoArea.disabled = false
  renderList(toDoList)
}

const clearToDo = () => {
  toDoList.toDos = []
  saveToDo(toDoList)
  renderToDo(toDoList)
}

const resetTextArea = () => {
  newToDoArea.style.height = "68px"
  newToDoArea.value = ""
}

const renderList = (toDoList) => {
  clearRender()
  if (toDoList && toDoList.toDos.length) {
    toDoList.toDos.forEach(toDo => {
      const listId = toDo.id
      //Create Item
      let item = document.createElement('div')
      item.className = 'item'
      item.id = 'list-' + listId
      //Create Item Inner
      let itemInner = document.createElement('div')
      itemInner.className = 'item-inner'
      //create textnode and add to item inner
      let toDoLines = toDo.value.split(/[\r\n|\r|\n]/)
      toDoLines.forEach((toDo, i) => {
        itemInner.appendChild(document.createTextNode(toDo))
        if (i++ < toDoLines.length) {
          itemInner.appendChild(document.createElement('br'))
        }
      })
      //create button
      let button = document.createElement('button')
      button.className = 'remove'
      button.setAttribute('data-list', listId)
      button.textContent = 'x'
      button.onclick = removeToDo
      //Combine elements and insert to page
      item.appendChild(itemInner)
      item.appendChild(button)
      listMain.appendChild(item)
    })
    empty.style.display = 'none'
  } else {
    empty.style.display = 'block'
  }
}