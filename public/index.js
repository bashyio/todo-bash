'use strict'
const newToDoArea = document.getElementById("newToDo")
const status = document.getElementById("statusToDo")
const empty = document.querySelector(".empty")
const listMain = document.querySelector('.list')
const cLocation = location.href
const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
const baseUrl = cLocation.substr(cLocation.length - 10, 10) == 'index.html' ? cLocation.substr(0, cLocation.length - 10) : cLocation
let toDoList
let started = false

const startToDo = async (fRequest = 0, wipeText = 0) => {
  toDoList = await fetchList(fRequest)
  renderToDo(toDoList, wipeText)
  started = true
}

newToDoArea.addEventListener('input', e => {
  resizeTextArea()
})

document.getElementById('toDoForm').addEventListener('submit', e => {
  e.preventDefault()
  newToDoArea.classList.remove('error')
  let text = newToDoArea.value.trim()
  if (text !== '') {
    const listId = guid()
    const toDo = {
      'id': listId,
      'value': text
    }
    toDoList.toDos.push(toDo)
    saveToDo(toDoList)
    renderToDo(toDoList)
  } else {
    newToDoArea.classList.add('error')
  }
  return false
})

window.addEventListener('storage', (e) => {
  if (e.key === 'toDoList' && started) {
    startToDo(0, 0)
  }
})

document.getElementById('statusToDo').addEventListener('click', e => {
  let targetId = e.target.id;
  switch (targetId) {
    case 'clearYes':
      clearToDo()
      emptyEl(status)
      break
    case 'clearNo':
      emptyEl(status)
      break
  }
})

document.getElementById('clearList').addEventListener('click', e => {
  let warning = document.createElement('warning')
  warning.appendChild(document.createTextNode('Sure? '))
  let clearYes = document.createElement('span')
  clearYes.appendChild(document.createTextNode('Yes'))
  clearYes.id = 'clearYes'
  clearYes.classList.add('yes')
  let clearNo = document.createElement('span')
  clearNo.appendChild(document.createTextNode('No'))
  clearNo.id = 'clearNo'
  clearNo.classList.add('no')
  status.appendChild(warning)
  status.appendChild(clearYes)
  status.appendChild(document.createTextNode(' / '))
  status.appendChild(clearNo)
})

startToDo(1)