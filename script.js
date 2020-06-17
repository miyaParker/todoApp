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
            emptyList: query('.empty-list')
        },
        init() {
            s = this.settings
            view.init()
            this.bindEvents()
        },
        bindEvents() {
            s.newTask.addEventListener('click', todo.getInput)
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
            s.list.unshift(newTask)
            this.showEmptyList()
            localStorage.setItem('task-list', JSON.stringify(s.list))
        },
        deleteTask(id) {
            s.list.forEach(task => {
                if (task.id == id) {
                    let index = s.list.indexOf(task)
                    s.list.splice(+index, 1)
                }
            })
            localStorage.setItem('task-list', JSON.stringify(s.list))
        },
        updateTask(id, completed) {
            for (let index = 0; index < s.list.length; index++) {
                if (s.list[index].id === +id) {
                    s.list[index].completed = completed
                    console.log(s.list[index])
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

const config = { childList: true }
const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('a childNode has been added or removed')
        }
    }
}
const observer = new MutationObserver(callback)
observer.observe(todo.settings.taskList, config)
observer.disconnect();

//observables

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
        check.classList.add('check')
        if (task.completed === false) {
            check.classList.add('hidden')

        }
        listDiv.appendChild(checkBox)
        listDiv.appendChild(check)
        listDiv.appendChild(item)
        listDiv.appendChild(deleteBtn)
        s.taskList.appendChild(listDiv)
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
        const item = query('li')

        if (event.target.previousSibling.classList.contains('hidden')) {
            event.target.previousSibling.classList.remove('hidden')
            todo.updateTask(id, true)
            item.classList.add('checked')
        } else {
            event.target.previousSibling.classList.add('hidden')
            todo.updateTask(id, false)
        }

    },
    deleteListItem(event) {
        const id = event.target.previousSibling.id
        event.target.parentElement.remove()
        todo.deleteTask(id)
    },
}
function init() {
    todo.init()
}
init()