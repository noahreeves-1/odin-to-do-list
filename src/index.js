import './style.css';

let projectsArray = ['Main'];

// SAVE FOR LATER
class Task {
    constructor (name, description, dueDate, priority, project) {
        this.name = name;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.project = project;
        this.done = 0;
    }
};

// class for projects
class Project {
    constructor(key, name) {
        this.key = key;
        this.name = name;
    }
};

// removes all children from DOM element
function clearChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

// populates local storage with key value pair
function populateLocalStorage(key,value) {
    localStorage.setItem(key, value);
};

const projects = document.querySelector('.projects');

// create projects list from local storage
function projectsFromLocalStorage() {
    // TRY THIS
    // use localstorage keys and values to create projectsArray
    // create an array of keys... Object.keys(localStorage);

    // for (var i in localStorage) {}
    // or...
    // const keys = Object.keys(localStorage)
    // for (let key of keys) {}

    // maybe try using .map
    
    for (let i = 0; i < localStorage.length; i++) {
        const newListItem = document.createElement('li');
        newListItem.classList.add('list');
        newListItem.dataset.projectId = i;

        // newListItem.textContent = localStorage[i];
        projects.appendChild(newListItem);
        projectsArray.push(localStorage[i])

        // adds project name as DIV to list item
        const listName = document.createElement('div');
        listName.classList.add('list-name');
        listName.textContent = localStorage[i];
        newListItem.appendChild(listName);

        // adds 'X' to each list item being created
        const deleteProjectIcon = document.createElement('div');
        deleteProjectIcon.classList.add('delete-project-icon');
        deleteProjectIcon.textContent = 'X';
        newListItem.appendChild(deleteProjectIcon);
    }
};

// renders all items in array in DOM, creates elements
function render() {

    if (localStorage.length > 0) {
        projectsArray = [];
        projectsFromLocalStorage();
    } else {
        populateLocalStorage(0, projectsArray[0]);
    }

    console.log(localStorage); // DELETE LATER; JUST FOR CHECKS
    console.log(projectsArray); // DELETE LATER; JUST FOR CHECKS
};

render();

const allDeleteProjectIcons = document.querySelectorAll('.delete-project-icon');

function clickToDeleteProject() {
    allDeleteProjectIcons.forEach((icon) => {
        icon.addEventListener('click', () => {
            const thisDataID = icon.parentElement.getAttribute('data-project-id');
            console.log(thisDataID); // IT GRABS THE RIGHT DATA ID

            clearChildren(projects);
            removeFromProjectsArray(thisDataID);
            removeFromLocalStorage(thisDataID);
            render();

        })
    })
};

function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
};

function removeFromProjectsArray(key) {
    projectsArray.splice(key, 1);
}

clickToDeleteProject();

const addProjectInput = document.querySelector('.add-project');
const submitNewProject = document.querySelector('.submit-project');
// adds a new project to the main array and creates/renders all projects
submitNewProject.addEventListener('click', e => {
    
    // if input field is blank do nothing
    if (addProjectInput.value == '') return;

    // prevent page from refreshing on submit
    e.preventDefault();

    // add new project to projects array
    const projectName = addProjectInput.value;
    projectsArray.push(projectName);

    // clear localstorage before re-creating projects list
    localStorage.clear();

    // populate projects list from localstorage
    for (let i = 0; i < projectsArray.length; i++) {
        const newProject = new Project (i, projectsArray[i])
        populateLocalStorage(i , newProject.name)
    }

    // remove project divs
    clearChildren(projects);
    
    // creates divs from projects localstorage
    render();

    addProjectInput.value = ''; // empty the input box after submitting
});