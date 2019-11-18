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

//Fetch Query any number of times before throwing an error
const tryFetch = (url, options, i) => fetch(url, options).then((response) => {
  if (response.status < 200 || response.status > 299) throw Error('Request Failed! Status Code: ' + response.status)
  return response
}).catch((error) => {
  if (i <= 1) throw error
  return tryFetch(url, options, i - 1)
})

//Empty Element
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

const fetchList = async (init = 0) => {
  let list, listLocal = parseJSON(localStorage.getItem('toDoList'))

  switch (init) {
    case 1:
      list = await fetchRequest()
      list = list ? list : listLocal
      break
    case 0:
      list = listLocal
  }
  if (!list && init == 0) {
    list = await fetchRequest()
  }
  return list ? list : newList()
}

const newList = () => {
  return {
    "toDos": [],
    "lastSaved": moment().format(dateTimeFormat)
  }
}

const fetchRequest = () => {
  const result = tryFetch(baseUrl + 'data-io.php?rType=fetchList', {}, 3).then((response) => {
    return response.json()
  }).then((responseJson) => {
    return responseJson
  }).catch((error) => {
    console.log(error)
  })
  console.log(result)
  return result
}

const saveRequest = (toDoList) => {
  const formData = new FormData()
  formData.append('toDoList', JSON.stringify(toDoList))
  const result = tryFetch(baseUrl + 'data-io.php?rType=saveList', {
    method: 'POST',
    body: formData
  }, 3).then((response) => {
    return response.text()
  }).then((list) => {
    console.log(list)
  })
}

const saveToDo = (toDoList) => {
  toDoList.lastSaved = moment().format("YYYY-MM-DD HH:mm:ss");
  localStorage.setItem('toDoList', JSON.stringify(toDoList))
  saveRequest(toDoList)
}

const removeToDo = function () {
  let src = this.getAttribute('data-list')
  document.querySelector('#list-' + src).remove()
  toDoList.toDos = toDoList.toDos.filter(toDo => {
    return toDo.id != src
  })
  saveToDo(toDoList)
  renderToDo(toDoList, 0)
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

const renderToDo = (toDoList, wipeText = 1) => {
  wipeTextArea(wipeText)
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

const wipeTextArea = (wipeText) => {
  newToDoArea.style.height = "68px"
  if (wipeText) newToDoArea.value = ""
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
    emptyEl(empty)
    empty.appendChild((document.createTextNode('List items will display here...')))
  }
}