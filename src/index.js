import "./style.css";
import { format, isThisISOWeek } from "date-fns";

const allProjects = document.querySelector("[data-all-projects]");
const newProjectForm = document.querySelector(".new-project-form");
const newProjectInput = document.querySelector(".new-project-input");

const deleteProjectBtn = document.querySelector(".delete-project-btn");

const taskContainerTitle = document.querySelector(".task-container-title");
const tasksContainer = document.querySelector(".tasks-container");
const allTasks = document.querySelector(".all-tasks");
const newTaskContainerForm = document.querySelector(".new-task-form");
const newTaskContainerInput = document.querySelector(".new-task-input");

const editTaskButton = document.querySelector('#edit-task-btn');
const taskModal = document.querySelector('#taskModal');
const closeTaskModal = document.querySelector('.close-edit-task-btn');

class Project {
    constructor(name, tasks, id) {
        if (id) {
            this.id = id;
        } else {
            this.id = Math.random();
        }

        this.name = name;

        if (tasks) {
            this.tasks = tasks.map(
                (task) => new Task(task.description, task.dueDate, task.priority, task.complete, task.id)
            );
        } else {
            this.tasks = []
        }
    }

    setName(name) {
        this.name = name;
    }
}

class Task {
    constructor(description, dueDate, priority, complete = false, id = Math.random()) {
        if (id) {
            this.id = id;
        } else {
            this.id = Math.random();
        }
        this.description = description;
        this.dueDate = format(new Date(dueDate), 'MM-dd-yyyy');
        this.priority = priority;
        this.complete = complete;
    }

    completeTask() {
        this.complete = !this.complete;
    }
}

// DEFAULT project. Cannot delete
const mainProject = new Project("Main");

// localstorage key for main project array
const LOCAL_STORAGE_KEY = "task.projects";
const LOCAL_STORAGE_SELECTED_ID_KEY = "task.selectedId";
const LOCAL_STORAGE_SELECTED_TASK_KEY = 'task.selectedTaskId'

// get projects array from localstorage, else populate with default project
const projectsArray = localStorage.getItem(LOCAL_STORAGE_KEY)
    ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)).map(
        (project) => new Project(project.name, project.tasks, project.id, project.complete)
    )
    : [mainProject].map((project) => new Project(project.name, project.tasks));

// const newProjectsArray = projectsArray.map(project => {
//     return new Project(project.name)
// })

// console.log(newProjectsArray);

// get selected project ID
let selectedProjectID = localStorage.getItem(LOCAL_STORAGE_SELECTED_ID_KEY);
let selectedTaskId = localStorage.getItem(LOCAL_STORAGE_SELECTED_TASK_KEY);

saveAndRender();

// create new project, push to projects array, add to localstorage
newProjectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (newProjectInput.value === null || newProjectInput.value === "") return;
    const projectName = newProjectInput.value;
    const newProject = new Project(projectName);
    projectsArray.push(newProject);
    selectedProjectID = newProject.id.toString();
    saveAndRender();
    newProjectInput.value = "";
});

// select an active project and save the project ID as selected ID in localstorage
allProjects.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "li") {
        selectedProjectID = e.target.dataset.projectId;
        saveAndRender();
    }
});

// DELETE PROJECT
deleteProjectBtn.addEventListener("click", (e) => {
    if (selectedProjectID === "null" || selectedProjectID === "") {
        return;
    }
    // run only if there is a selected project ID
    if (confirm("This will delete the selected project. Is that OK?")) {
        // remove the project from the projectsArray
        for (let i = 0; i < projectsArray.length; i++) {
            if (selectedProjectID === projectsArray[i].id.toString()) {
                console.log("this has been deleted");
                projectsArray.splice(i, 1);
                selectedProjectID = "null";
                saveAndRender();
                return;
            }
        }
    } else {
        console.log("this project was not deleted");
    }
});

newTaskContainerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (
        newTaskContainerInput.value === null ||
        newTaskContainerInput.value === ""
    ) {
        return; // do nothing if the input field is blank
    }

    // push task to project
    for (let i = 0; i < projectsArray.length; i++) {
        if (selectedProjectID === projectsArray[i].id.toString()) {
            // create new Task

            const taskName = newTaskContainerInput.value;
            const dueDate = format(new Date(), "MM/dd/yyyy");
            const priority = "Low";
            const newTaskContainer = new Task(taskName, dueDate, priority);

            projectsArray[i].tasks.push(newTaskContainer);
            break;
        }
    }

    newTaskContainerInput.value = "";

    saveAndRender();
});

// click the complete task icon to change the status of task from 0 to 1

const completeTaskButtons = document.querySelectorAll(".complete-task-btn");
// create queryselectorall for all LI
// 

const editTaskComplete = document.querySelector('.edit-task-complete');
const editTaskDueDate = document.querySelector('.edit-task-due-date');
const editTaskDescription = document.querySelector('.edit-task-description');
const editTaskPriority = document.querySelector('.edit-task-priority');

const allTaskContainers = document.querySelectorAll('.task-container');

const currentProject = projectsArray.find((project) => {
    return project.id.toString() === selectedProjectID;
});

editTaskButton.addEventListener('click', (e) => {
    // when clicked, open up a modal
    taskModal.style.display = 'block';

    const currentTask = currentProject.tasks.find((task) => {
        return task.id.toString() === selectedTaskId.toString();
    });

    console.log(currentProject);
    console.log(currentTask);

    // get each data point from the selected task
    if (currentTask.id.toString() === selectedTaskId.toString()) {
        // complete checkbox
        if (currentTask.complete) {
            editTaskComplete.checked = true;
        } else {
            editTaskComplete.checked = false;
        }
        // task description
        editTaskDescription.value = currentTask.description;
        editTaskDueDate.value = format(Date.parse(currentTask.dueDate), 'yyyy-MM-dd');
        editTaskPriority.value = currentTask.priority;
    }

    // allow each data point to be edited (complete, change description, change due date, change priority)
    // if I click "Cancel", close modal and do nothing
    // if I click "Save", save data back to array, save data to localstorage, render tasks
});

const saveTaskEditsBtn = document.querySelector('.save-task-edits-btn');

saveTaskEditsBtn.addEventListener('click', (e) => {
    const currentTask = currentProject.tasks.find((task) => {
        return task.id.toString() === selectedTaskId.toString();
    });
    // save task complete task value
    currentTask.complete = editTaskComplete.checked;
    // save task description
    currentTask.description = editTaskDescription.value;
    // save task due date
    currentTask.dueDate = format(Date.parse(editTaskDueDate.value), 'MM-dd-yyyy');
    // save task priority
    currentTask.priority = editTaskPriority.value;
    // render tasks with updated values
    saveAndRender();
    // close modal
    taskModal.style.display = 'none';
})

closeTaskModal.addEventListener('click', (e) => {
    taskModal.style.display = 'none';
})

// FUNCTIONS //

function saveAndRender() {
    save();
    render();
}

// saves newly created projects into localStorage
function save() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projectsArray));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_ID_KEY, selectedProjectID);
    localStorage.setItem(LOCAL_STORAGE_SELECTED_TASK_KEY, selectedTaskId);
}

// renders what is in projectsArray
function render() {
    removeAllChildNodes(allProjects);
    renderProjects();
    renderTasks();

    console.log(projectsArray);
    console.log(localStorage);
}

function renderTasks() {
    if (selectedProjectID === "null" || selectedProjectID === "") {
        tasksContainer.style.display = "none";
    } else {
        tasksContainer.style.display = "block";

        // for the project that has the same ID as the selectedProjectId
        // change the title, and list the tasks from the array in the project object
        for (let i = 0; i < projectsArray.length; i++) {
            if (projectsArray[i].id == selectedProjectID) {
                // remove Project Title
                removeAllChildNodes(taskContainerTitle);
                // create new title
                const projectTitle = document.createElement("div");
                projectTitle.innerText = `Tasks // ${projectsArray[i].name}`;
                taskContainerTitle.appendChild(projectTitle);

                // remove tasks LI from DOM
                removeAllChildNodes(allTasks);
                // create new LI for each task in the selected project task array
                projectsArray[i].tasks.forEach((task, index) => {
                    const newTaskContainer = document.createElement("div");
                    newTaskContainer.classList.add("task-container");

                    // create addeventlistener for each task-container
                    newTaskContainer.addEventListener('click', (e) => {

                        const clickedTask = currentProject.tasks[index];

                        selectedTaskId = clickedTask.id;

                        saveAndRender();
                    })

                    if (task.complete) {
                        newTaskContainer.classList.add('completed-task');
                    } else {
                        newTaskContainer.classList.remove('completed-task');
                    };

                    if (task.id == selectedTaskId) {
                        newTaskContainer.classList.add('selected-task');
                    } else {
                        newTaskContainer.classList.remove('selected-task');
                    }


                    allTasks.appendChild(newTaskContainer);

                    // create left side panel
                    const leftTaskPanel = document.createElement("div");
                    leftTaskPanel.classList.add("left-task-panel");
                    newTaskContainer.appendChild(leftTaskPanel);

                    // create click-able circle icon
                    const completeTaskBtn = document.createElement("input");

                    // add eventlistener to each button
                    completeTaskBtn.addEventListener("click", (e) => {

                        const clickedTask = currentProject.tasks[index];

                        clickedTask.completeTask();

                        if (clickedTask.complete) {
                            completeTaskBtn.parentNode.parentNode.classList.add('completed-task');
                        } else {
                            completeTaskBtn.parentNode.parentNode.classList.remove('completed-task');
                        };

                        save();
                    });

                    completeTaskBtn.setAttribute('type', 'checkbox');
                    completeTaskBtn.classList.add("complete-task-btn");
                    completeTaskBtn.checked = task.complete;
                    //  IF complete task attribute = true, update classname
                    // save tasks to local storage and render
                    leftTaskPanel.appendChild(completeTaskBtn);

                    // append task description
                    const newTaskDescription = document.createElement("div");
                    newTaskDescription.innerText = task.description;
                    newTaskDescription.classList.add("task-description");
                    leftTaskPanel.appendChild(newTaskDescription);

                    // create right side panel
                    const rightTaskPanel = document.createElement("div");
                    rightTaskPanel.classList.add("right-task-panel");
                    newTaskContainer.appendChild(rightTaskPanel);

                    // append task due date
                    const newTaskDueDate = document.createElement("div");
                    newTaskDueDate.classList.add("task-due-date");
                    newTaskDueDate.innerText = task.dueDate;
                    rightTaskPanel.appendChild(newTaskDueDate);
                });
            }
        }
    }
}

// create DOM elements
function renderProjects() {
    projectsArray.forEach((project) => {
        const newProject = document.createElement("li");
        newProject.dataset.projectId = project.id;
        newProject.classList.add("project");
        newProject.innerText = project.name;
        if (project.id.toString() === selectedProjectID) {
            newProject.classList.add("active-project");
        }
        allProjects.appendChild(newProject);
    });
}

function removeAllChildNodes(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}