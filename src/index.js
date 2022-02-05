import './style.css';
import { format } from 'date-fns';


const allProjects = document.querySelector('[data-all-projects]');
const newProjectForm = document.querySelector('.new-project-form');
const newProjectInput = document.querySelector('.new-project-input');

const deleteProjectBtn = document.querySelector('.delete-project-btn');

const taskContainerTitle = document.querySelector('.task-container-title');
const tasksContainer = document.querySelector('.tasks-container')
const allTasks = document.querySelector('.all-tasks');
const newTaskContainerForm = document.querySelector('.new-task-form');
const newTaskContainerInput = document.querySelector('.new-task-input');

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
        this.id = Math.random();
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.complete = false;
    }

    completeTask() {
        this.complete = !this.complete;
    }

};

// DEFAULT project. Cannot delete
const mainProject = new Project('Main');

// localstorage key for main project array
const LOCAL_STORAGE_KEY = 'task.projects';
const LOCAL_STORAGE_SELECTED_ID_KEY = 'task.selectedId';

// get projects array from localstorage, else populate with default project
const projectsArray = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [mainProject];

const newProjectsArray = projectsArray.map(project => {
    return new Project(project.name)
})

console.log(newProjectsArray)

// get selected project ID
let selectedProjectID = localStorage.getItem(LOCAL_STORAGE_SELECTED_ID_KEY);

saveAndRender();

// create new project, push to projects array, add to localstorage
newProjectForm.addEventListener('submit', e => {
    e.preventDefault();
    if (newProjectInput.value === null || newProjectInput.value === '') return;
    const projectName = newProjectInput.value;
    const newProject = new Project(projectName);
    projectsArray.push(newProject);
    selectedProjectID = newProject.id.toString();
    saveAndRender();
    newProjectInput.value = '';
});

// select an active project and save the project ID as selected ID in localstorage
allProjects.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedProjectID = e.target.dataset.projectId;
        saveAndRender();
    }
});

// DELETE PROJECT
deleteProjectBtn.addEventListener('click', e => {
    if (selectedProjectID === "null" || selectedProjectID === '') {
        return
    }
    // run only if there is a selected project ID
    if (confirm('This will delete the selected project. Is that OK?')) {
        // remove the project from the projectsArray
        for (let i = 0; i < projectsArray.length; i++) {
            if (selectedProjectID === projectsArray[i].id.toString()) {
                console.log('this has been deleted');
                projectsArray.splice(i, 1);
                selectedProjectID = "null";
                saveAndRender();
            }
        }
    } else {
        console.log('this project was not deleted');
    }
});

newTaskContainerForm.addEventListener('submit', e => {
    e.preventDefault();

    if (newTaskContainerInput.value === null || newTaskContainerInput.value === '') {
        return // do nothing if the input field is blank
    }

    // push task to project
    for (let i = 0; i < projectsArray.length; i++) {
        if (selectedProjectID === projectsArray[i].id.toString()) {
            // create new Task

            const taskName = newTaskContainerInput.value;
            const dueDate = format(new Date(), 'MM/dd/yyyy');
            const priority = 'Urgent';
            const newTaskContainer = new Task(taskName, dueDate, priority);

            projectsArray[i].tasks.push(newTaskContainer);
        }
    };

    newTaskContainerInput.value = '';

    saveAndRender();
});

// click the complete task icon to change the status of task from 0 to 1

const completeTaskButtons = document.querySelectorAll('.complete-task-btn');

completeTaskButtons.forEach((button, index) => {
    button.addEventListener('click', e => {
        // when button is clicked, change the status of this task complete status from 0 to 1
        // make sure if complete is set to 1, its display is changed to none
        // then save the tasks array to localstorage
        const currentProject = projectsArray.find(project => {
                return project.id.toString() === selectedProjectID;
        });

        if (currentProject.tasks[index] instanceof Task) {
            console.log('yes')
        }

        console.log(currentProject.tasks[index])

        console.log(currentProject);
        
        // for (let i = 0; i < projectsArray.length; i++) {

        //     if (selectedProjectID === projectsArray[i].id.toString()) {

        //         console.log(e.target.parentNode.lastChild) // THIS GETS THE DESCRIPTION

        //         taskDescriptions.forEach(description => {
        //             if (description.value === projectsArray[i].description) {
        //                 console.log('hello');
        //             }
        //         })

        //         console.log(projectsArray[i].tasks);
        //         // how can i change the complete task in this project tasks array?
        //         // array[0?] how do I select this...
        //     }
        // }
    })
});

// FUNCTIONS //

function saveAndRender() {
    save();
    render();
};

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
    if (selectedProjectID === "null" || selectedProjectID === '') {
        tasksContainer.style.display = 'none'
    } else {
        tasksContainer.style.display = "block"

        // for the project that has the same ID as the selectedProjectId
        // change the title, and list the tasks from the array in the project object
        for (let i = 0; i < projectsArray.length; i++) {
            if (projectsArray[i].id == selectedProjectID) {
                // remove Project Title
                removeAllChildNodes(taskContainerTitle);
                // create new title
                const projectTitle = document.createElement('div');
                projectTitle.innerText = `Tasks // ${projectsArray[i].name}`;
                taskContainerTitle.appendChild(projectTitle);

                // remove tasks LI from DOM
                removeAllChildNodes(allTasks);
                // create new LI for each task in the selected project task array
                projectsArray[i].tasks.forEach((task) => {
                    const newTaskContainer = document.createElement('div');
                    newTaskContainer.classList.add('task-container');
                    allTasks.appendChild(newTaskContainer);

                    // create left side panel
                    const leftTaskPanel = document.createElement('div');
                    leftTaskPanel.classList.add('left-task-panel');
                    newTaskContainer.appendChild(leftTaskPanel);

                    // create click-able circle icon
                    const completeTaskBtn = document.createElement('button');
                    completeTaskBtn.classList.add('complete-task-btn');
                    leftTaskPanel.appendChild(completeTaskBtn);

                    // append task description
                    const newTaskDescription = document.createElement('div');
                    newTaskDescription.innerText = task.description;
                    newTaskDescription.classList.add('task-description');
                    leftTaskPanel.appendChild(newTaskDescription);

                    // create right side panel
                    const rightTaskPanel = document.createElement('div');
                    rightTaskPanel.classList.add('right-task-panel');
                    newTaskContainer.appendChild(rightTaskPanel);

                    // append task due date
                    const newTaskDueDate = document.createElement('div');
                    newTaskDueDate.classList.add('task-due-date');
                    newTaskDueDate.innerText = task.dueDate;
                    rightTaskPanel.appendChild(newTaskDueDate);
                })
            }
        }
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
};

function removeAllChildNodes(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};