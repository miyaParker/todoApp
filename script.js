const query = (selector) => document.querySelector(selector)
const queryAll = (selector) => document.querySelectorAll(selector)
const create = (element) => document.createElement(element)

var s,
    todo = {
        settings: {
            list: localStorage.getItem('task-list') ? JSON.parse(localStorage.getItem('task-list')) : [],
            addBtn: query('.add-btn'),
            modal: query('.modal'),
            inputBox: query('#input-box'),
            newTask: query('.new-task'),
            taskList: query('.task-list'),
            deleteBtn: query('.delete-btn'),
            emptyList: query('.empty-list'),
            edit: queryAll('.edit'),
            updateBtn : query('.updateBtn'),
            listId: 1,
            editedlistItem:'',
            editBox:query('.editBox')
        },
        init() {
            s = this.settings
            view.init()
            this.bindEvents()
        },
        tasksCompleted(){

        },
        bindEvents() {
            s.newTask.addEventListener('click', todo.getInput)
            s.inputBox.addEventListener("keyup", function (event) {
                if (event.keyCode === 13) {
                    todo.getInput()
                }
            });
            s.editBox.addEventListener("keyup", function (event) {
                if (event.keyCode === 13) {
                    const itemArray = s.list.filter(task => task.id === +s.listId)
                    itemArray[0].description = event.target.value
                    s.editBox.classList.add('hidden')
                    s.editedlistItem.innerText = event.target.value
                    localStorage.setItem('task-list', JSON.stringify(s.list))
                }
            });
            s.updateBtn.addEventListener('click', todo.inputUpdate)
            query('.reset').addEventListener('click',todo.reset)
            query('#close-editBox').addEventListener('click',()=> query('.editBox').classList.add('hidden'))
        },
        reset(){
            s.taskList.innerHTML = ' '
            s.list = []
            localStorage.setItem('task-list', JSON.stringify(s.list))
            s.emptyList.classList.remove('hidden')
        },
        edit() {
            query('.editBox').classList.remove('hidden')
            query('.inputEdit').value = event.target.previousSibling.innerText.toLowerCase()
            query('.inputEdit').focus()
            s.listId = event.target.previousSibling.id
            s.editedlistItem = event.target.previousSibling
        },
        inputUpdate() {
            const itemArray = s.list.filter(task => task.id === +s.listId)
            itemArray[0].description = event.target.previousElementSibling.value
            s.editBox.classList.add('hidden')
            s.editedlistItem.innerText = event.target.previousElementSibling.value
            localStorage.setItem('task-list', JSON.stringify(s.list))
        },
        getInput() {
            userInput = s.inputBox.value
            if (userInput) {
                todo.addTask(userInput)
            }
        },
        addTask(text) {
            function Task(description) {
                this.id = Date.now()
                this.description = description
                this.completed = false
            }
            const newTask = new Task(text)
            view.render(newTask)
            s.list.push(newTask)
            this.showEmptyList()
            localStorage.setItem('task-list', JSON.stringify(s.list))
        },
        deleteTask(id) {
            s.list.forEach(task => {
                if (task.id === +id) {
                    let index = s.list.indexOf(task)
                    s.list.splice(+index, 1)
                }
            })
            localStorage.setItem('task-list', JSON.stringify(s.list))
            if(s.list.length === 0){
                s.emptyList.classList.remove('hidden')
            }
        },
        updateTask(id, completed) {
            for (let index = 0; index < s.list.length; index++) {
                if (s.list[index].id === +id) {
                    s.list[index].completed = completed
                }
            }
            localStorage.setItem('task-list', JSON.stringify(s.list))
        },
        showEmptyList() {
            if (s.list.length === 0) {
                s.emptyList.classList.remove('hidden')
            } else {
                s.emptyList.classList.add('hidden')
            }
        }
    }

const view = {
    init() {
        todo.showEmptyList()
        s.list.forEach(task => {
            view.render(task)
        })

    },
    render(task) {
        s.inputBox.value = ''
        const listDiv = create('div')
        listDiv.classList.add('list-div')
        deleteBtn = create('img')
        deleteBtn.addEventListener('click', view.deleteListItem)
        deleteBtn.src = "./images/delete.png"
        deleteBtn.classList.add('delete-btn')
        item = this.createListItem(task)
        item.addEventListener('click', view.checkTask)
        let checkBox = create('img')
        checkBox.classList.add('checkbox')
        checkBox.src = "./images/checkbox.png"
        let check = create('img')
        check.src = src = "./images/checkmark.png"
        check.classList.add('checkmark')
        item.classList.add('checked')
        let edit = create('img')
        edit.src = "./images/edit.png"
        edit.classList.add('edit')
        edit.addEventListener('click', todo.edit)

        if (task.completed === false) {
            item.classList.remove('checked')
            check.classList.add('hidden')
        }
        listDiv.id = task.id
        listDiv.appendChild(checkBox)
        listDiv.appendChild(check)
        listDiv.appendChild(item)
        listDiv.appendChild(edit)
        listDiv.appendChild(deleteBtn)
        s.taskList.prepend(listDiv)
    },
    createListItem(task) {
        let listItem = create('li')
        listItem.innerText = task.description
        listItem.id = task.id
        listItem.classList.add('list-item')
        return listItem
    },
    checkTask(event) {
        const id = event.target.id
        if (event.target.previousSibling.classList.contains('hidden')) {
            event.target.previousSibling.classList.remove('hidden')
            todo.updateTask(id, true)
            event.target.classList.add('checked')
        } else {
            event.target.previousSibling.classList.add('hidden')
            todo.updateTask(id, false)
            event.target.classList.remove('checked')
        }
    },
    deleteListItem(event) {
        const id = event.target.parentElement.id
        event.target.parentElement.remove()
        todo.deleteTask(id)
    },
}
function init() {
    todo.init()
}
init()