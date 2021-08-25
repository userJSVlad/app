const buttonAdd = document.querySelector('.todo__button-add');
const todoText = document.querySelector('.todo__text');
const todoList = document.querySelector('.todo-list')
const btnClear = document.querySelector('.todo__clear')
const score = document.querySelector('.todo__score span')
const taskEmpty = document.querySelector('.todo__empty')
const todoTask = document.getElementsByClassName('todo__task')
const TASK_KEY = 'task';

//let store = []; // store for tasks
let store = JSON.parse(localStorage.getItem(TASK_KEY)) || [];

const updateScore = () => score.textContent = store.length // showing right score

const clearAllTasks = () => { // the function removes all our tasks
   localStorage.removeItem('task') // delete all tasks
   todoList.innerHTML = '' // clean todoList
   store = []; // clean store
   score.innerHTML = '0' // clean score
   taskEmpty.textContent = 'Your entries will be displayed here'; // show this str
}

const createTasks = (item, index) => { // function that does our tasks
   return `
      <div id="drag" class="todo__task" draggable="true">${item.value}
         <button class="btn__delete" type="submit" onclick="deleteTask(${index})">
            <i class="fa fa-trash delete__icon" aria-hidden="true"></i>
         </button>
      </div>
   `
}

const renderTasks = () => { // made our tasks
   todoList.innerHTML = ''; // clean tasks
   taskEmpty.textContent = ''; // delete str "Your entries will be displayed here"
   if (store.length > 0) { // check for tasks
      store.forEach((item, index) => {
         todoList.innerHTML = store.map(createTasks).join('')// refer to the function that creates tasks
         initDragAndDrop(); // create dragondrop
      })
   } else {
      taskEmpty.textContent = 'Your entries will be displayed here' // if we havent tasks
   }
}

const deleteTask = (index) => {
   store.splice(index, 1) // delete element in array
   localStorage.setItem('task', JSON.stringify(store)) // load new tasks without remote
   renderTasks(); // showing update tasks
   updateScore(); // show new score of task
}


const addTasks = () => {
   if (todoText.value === '') { // check input on ""
      todoText.classList.add('error'); // made red border
      return // cansel move on function
   }
   store.push({ 'value': todoText.value.toLowerCase().trim() }); // push task in array
   todoText.value = '' // clear input
   addTaskLocalStorage(); // add task in localStorege
   renderTasks(); // made all tasks
   updateScore(); // show true score
}

const checkInput = () => todoText.classList.remove('error'); // check on focus in input

const addTaskLocalStorage = () => localStorage.setItem('task', JSON.stringify(store)); // add task in localStorege


const initDragAndDrop = () => {
   for (let element of todoTask) element.addEventListener('dragstart', dragStart) || element.addEventListener('dragend', dragEnd);
   
   todoList.addEventListener('dragover', dragOver)
   todoList.addEventListener('drop', drop);
}

const dragStart = (event) => {
   event.dataTransfer.setData("text", event.target.id); //sending element for move
   event.target.classList.add('active'); // making opacity 0.5
}

const dragEnd = (event) => event.target.classList.remove('active');  // return normal opacity (opacity: 1);


const dragOver = (event) => {
   event.preventDefault(); // undo the default behavior
   // element wich we take for move
   const activeElement = todoList.querySelector(`.active`);
   // element where have courcour
   const currentElement = event.target;
   // check  event 
   // 1. not on the element that we are moving
   // 2. only elements from todoList
   const isMoveable = activeElement !== currentElement && currentElement.classList.contains(`todo__task`)
   // Если нет, прерываем выполнение функции
   if (!isMoveable) {
      return;
   }
   // Find the element before which we will insert
   const nextElement = (currentElement === activeElement.nextElementSibling) ? currentElement.nextElementSibling : currentElement;
   // Insert activeElement front nextElement
   todoList.insertBefore(activeElement, nextElement);
   updatingStore() // counting new elements on page
}
const drop = (event) => event.preventDefault(); // undo the default behavior
//updating the chronicle
const updatingStore = () => { //counting new elements on page
   store = []; // delting all values from store
   for (let element of todoTask) store.push({ 'value': element.textContent.trim() }); //counting new elements on page
   
   addTaskLocalStorage() // updating localStorage
}


buttonAdd.addEventListener('click', addTasks);
btnClear.addEventListener('click', clearAllTasks)
todoText.addEventListener('focus', checkInput)
renderTasks();  // made all tasks
updateScore();

