import './style.css';

const allProjects = document.querySelector('[data-all-projects]');
const newProjectForm = document.querySelector('.new-project-form');
const newProjectInput = document.querySelector('.new-project-input');

const projectContainerTitle = document.querySelector('.project-container-title');
const tasksContainer = document.querySelector('.tasks-container')
let allTasks = document.querySelector('.all-tasks');
const newTaskForm = document.querySelector('.new-task-form');
const newTaskInput = document.querySelector('.new-task-input');

class Project {

    constructor(name) {
        this.id = Math.random();
        this.name = name;
        this.tasks = []
    }

    setName(name) {
        this.name = name;
    }

};

class Task {

    constructor(description, dueDate, priority) {
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.complete = 0;
    }

};

// DEFAULT project. Cannot delete
const mainProject = new Project('Main');

// localstorage key for main project array
const LOCAL_STORAGE_KEY = 'task.projects';
const LOCAL_STORAGE_SELECTED_ID_KEY = 'task.selectedId';

// get projects array from localstorage, else populate with default project
const projectsArray = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [mainProject];

// get selected project ID
let selectedProjectID = localStorage.getItem(LOCAL_STORAGE_SELECTED_ID_KEY);

// create new project, push to projects array, add to localstorage
newProjectForm.addEventListener('submit', e => {
    e.preventDefault();
    if (newProjectInput.value === null || newProjectInput.value === '') return;
    const projectName = newProjectInput.value;
    const newProject = new Project(projectName);
    projectsArray.push(newProject);
    saveAndRender();
    newProjectInput.value = '';
});

// select an active project and save the project ID as selected ID in localstorage
allProjects.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedProjectID = e.target.dataset.projectId;
        saveAndRender();
    }
})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    if (newTaskInput.value === null || newTaskInput.value === '') {
        return // do nothing if the input field is blank
    }
    const taskName = newTaskInput.value;
    const dueDate = today().date();
    const newTask = new Task(taskName, )
})

function saveAndRender() {
    save();
    render();
};

saveAndRender();

// saves newly created projects into localStorage
function save() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projectsArray));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_ID_KEY, selectedProjectID);
};

// renders what is in projectsArray
function render() {
    removeAllChildNodes(allProjects);
    renderProjects();
    renderTasks();

    console.log(projectsArray);
    console.log(localStorage);
};

function renderTasks() {
    if (selectedProjectID !== "null") {
        tasksContainer.style.display = "block"

        // for the project that has the same ID as the selectedProjectId
        // change the title, and list the tasks from the array in the project object
        for (let i = 0; i < projectsArray.length; i++) {
            if (projectsArray[i].id == selectedProjectID) {
                // remove title
                removeAllChildNodes(projectContainerTitle);
                // create new title
                const projectTitle = document.createElement('div');
                projectTitle.innerText = projectsArray[i].name;
                projectContainerTitle.appendChild(projectTitle);

                // remove tasks LI from DOM
                removeAllChildNodes(allTasks);
                // create new LI for each task in the selected project task array
                projectsArray[i].tasks.forEach((task) => {
                    const newTask = document.createElement('li');
                    newTask.classList.add('task');
                    newTask.innerText = task;
                    allTasks.appendChild(newTask);
                })
            }
        }
    } else {
        tasksContainer.style.display = 'none'
    }
};

// create DOM elements
function renderProjects() {
    projectsArray.forEach((project) => {
        const newProject = document.createElement('li');
        newProject.dataset.projectId = project.id;
        newProject.classList.add('project');
        newProject.innerText = project.name;
        if (project.id.toString() === selectedProjectID) {
            newProject.classList.add('active-project');
        }
        allProjects.appendChild(newProject);
    })
}

function removeAllChildNodes(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}