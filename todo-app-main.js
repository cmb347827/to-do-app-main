'use strict'; 


$(window).resize(function(){
	location.reload();
});

const vars ={
    tasksdiv : document.getElementById("all-tasks"),
    itemsleft: document.getElementById('js-items-left'),
    newTaskTextArea : document.getElementById('enter-task'),
    completedBtn : document.querySelector('.js-completed-btn'),
    activeBtn : document.querySelector('.js-active-btn'),
    clearBtn : document.querySelector('.js-clear-btn'),
    allBtn: document.querySelector('.js-all-btn'),
    lightBtn:document.getElementById('js-light-btn'),
    darkBtn : document.getElementById('js-dark-btn'),
    html :document.querySelector('html'),
    reset : document.querySelector('.js-reset-btn')
}

//the keys for localstorage.
const tasks = 'todo-app-main-*&*=^^&*@%$!?-tasks';
const active = 'todo-app-main-$@#&*(!?@$%-active';
const completed= 'todo-app-main@!#$%^&*(#$%@!^%-completed';
//light/dark key
const light='todo-app-main-@$$#@^%(*-lighten';


let sortable=''; 
let viewType='taskData';


let activeTasks=   [];
let completedTasks= [];
let taskData =  [];

function saveToStorage(key,arr){
    //whenever the messages are updated , will be saved in local storage.
    localStorage.setItem(key,JSON.stringify(arr));
}
function loadFromStorage(key){
	  let tryget = localStorage.getItem(key);
    if(tryget){
        return JSON.parse(tryget);
    }else{ 
        //see lines 443-446
        return null;
    }
}
function clearLocalStorage(){
    localStorage.clear();
}
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

let defaultTasks =[
      {
        taskId: uuidv4(),
        task: 'Complete online JS course',
        checked: true,
      },{
        taskId: uuidv4(),
        task: 'Jog around the park 3x',
        checked: false,
      },{
        taskId: uuidv4(),
        task: '10 minute meditation',
        checked: false,
      },{
        taskId: uuidv4(),
        task: 'read for 1 hour',
        checked: false,
      },{
        taskId: uuidv4(),
        task: 'pick up groceries',
        checked: false,
      },{
        taskId: uuidv4(),
        task: 'complete todo app on frontend mentor',
        checked: false,
      }
]

function loadDefault(){
    defaultTasks= defaultTasks.reverse();
    defaultTasks.forEach(task=>{
          //create a new task object
          const newTask ={
              taskId: uuidv4(),
              task: task.task,
              checked: task.checked,
          }
          //add the new task to the taskData array
          taskData.unshift(newTask);
    });
    saveToStorage('todo-app-main-*&*=^^&*@%$!?-tasks',taskData);
}

const setView=(currentview)=>{
    viewType=currentview;
};



//next two functions: add a task when user types in the input text field
const addTaskByView=(newtask)=>{
    //add the new task to the taskData array
    //viewType is either default taskData or set by the user clicking 'active', 'completed', and 'all' buttons.
    if(viewType==='activeTasks'){
        activeTasks.unshift(newtask);
        taskData.unshift(newtask);                                                         
        //localStorage.setItem('active-tasks',JSON.stringify(activeTasks));
        saveToStorage('todo-app-main-$@#&*(!?@$%-active',activeTasks);
        saveToStorage('todo-app-main-*&*=^^&*@%$!?-tasks',taskData);
        updateTaskContainer(activeTasks);
    }else if(viewType==='completedTasks'){
        newtask.checked=true;
        completedTasks.unshift(newtask);
        taskData.unshift(newtask);
        //localStorage.setItem('completed-tasks',JSON.stringify(completedTasks));
        saveToStorage('todo-app-main@!#$%^&*(#$%@!^%-completed',completedTasks);
        saveToStorage('todo-app-main-*&*=^^&*@%$!?-tasks',taskData);
        updateTaskContainer(completedTasks);
    }else if(viewType==='taskData'){    
        taskData.unshift(newtask);
        //localStorage.setItem("tasks", JSON.stringify(taskData)); 
        saveToStorage('todo-app-main-*&*=^^&*@%$!?-tasks',taskData);                    
        updateTaskContainer(taskData); 
    }
}

vars.newTaskTextArea.addEventListener('keydown', (event) => {
  const regex = /\S/;
  //prevents the user from entering nothing 
  let passed = regex.test(vars.newTaskTextArea.value);

  //user presses enter key 
  if (event.key === 'Enter' && passed) {
        //if the user has tried to enter a blank task earlier, remove the error message.
        if($('#blank-error').hasClass('show-error')){
            $('#blank-error').removeClass('show-error');
            $('#blank-error').addClass('hide-error');
        }
        //on user presses the enter key in 'create a new todo' textarea, get the new todo textarea value.
        const newTaskValue =vars.newTaskTextArea.value.trim();
        if(newTaskValue){
            //create a new task object
            const newTask ={
                taskId: uuidv4(),
                task: newTaskValue,
                checked: false,
            }
            //clear the #enter-task textarea
            vars.newTaskTextArea.value='Create a new todo...';
            //add the new task, works whether user is viewing the 'active' tasks, 'completed' tasks, or all tasks.
            addTaskByView(newTask);
        }
  }else if(event.key ==='Enter' && !passed){
     //the user has pressed enter while the #enter-task textarea is blank, show an error message.
     if($('#blank-error').hasClass('hide-error')){
        $('#blank-error').removeClass('hide-error');
        $('#blank-error').addClass('show-error');
     }
  }
});




//Next two functions: update either activeTasks or completedTasks with new task, as well as taskData
function getInputArray(which){
    const remainderArray=taskData.filter(which);  
    if(remainderArray){
      return remainderArray;
    }
}
function taskActions(key,which,arr){
    let remainingInputArray= getInputArray(which);

    //below code will update either the active or completed arrays with the new task.
    if(remainingInputArray.length >0 ){
      remainingInputArray.forEach(input=>{
          arr.push(input);
      });
      //localStorage.setItem(key, JSON.stringify(arr));
      saveToStorage(key,arr);
    }else{
      //the last task should be either removed from active or completed tasks, whichever was updated
      arr=[];
      //localStorage.setItem(key, JSON.stringify(arr));
      saveToStorage(key,arr);
    }
    
}



// updateTAsk , setRemoveChecked, deleteTask functions 
function updateTask(event){
   //update taskData(all), plus or active or completed with the newly updated task when once entered task value changes. 
    if(viewType==='taskData'){
        taskData.forEach((task)=>{
              if(task.taskId===event.currentTarget.parentElement.id){
                 task.task = event.currentTarget.value;
                 //localStorage.setItem("tasks", JSON.stringify(taskData));
                 saveToStorage('todo-app-main-*&*=^^&*@%$!?-tasks',taskData);
              }
        });
    }
    if(viewType==='activeTasks'){
        activeTasks.forEach((task)=>{
              if(task.taskId===event.currentTarget.parentElement.id){
                  task.task = event.currentTarget.value;
                  //localStorage.setItem("active-tasks", JSON.stringify(activeTasks)); 
                  saveToStorage('todo-app-main-$@#&*(!?@$%-active',activeTasks);
              }
        });
   } else if(viewType==='completedTasks'){
        completedTasks.forEach((task)=>{
              if(task.taskId===event.currentTarget.parentElement.id){
                  task.task = event.currentTarget.value;
                  //localStorage.setItem("completed-tasks", JSON.stringify(completedTasks)); 
                  saveToStorage('todo-app-main@!#$%^&*(#$%@!^%-completed',completedTasks);
              }
        });
   }
}

function setRemoveChecked(event){
    //deals with checking/unchecking a task  and will update activeTasks or completedTasks once active or completed buttons are clicked as checked attribute is used.
    taskData.forEach((task)=>{
    
        if(task.taskId===event.currentTarget.parentElement.id){    
              //found the current checked/unchecked task in taskData
              if(task.checked){
                //task was checked, uncheck it
                (event.currentTarget).setAttribute('checked',false); 
                task.checked=false;
              }else{
                //task was unchecked, check it.
                //set the checked inputs check property in taskData (task) to checked
                (event.currentTarget).setAttribute('checked',true);
                task.checked=true;
              }
            
        }
    });
    //localStorage.setItem('tasks', JSON.stringify(taskData));
    saveToStorage('todo-app-main-*&*=^^&*@%$!?-tasks',taskData);
    //displays the number of active tasks
    const activeArr= taskData.filter(isNotChecked);
    vars.itemsleft.textContent = activeArr.length;
}

function deleteTask(e){
   //delete the task (when x is clicked to right of task)
   //works whether the user is viewing all tasks, 'active' tasks, or 'completed' tasks

   if(viewType==='taskData'){                                     
        //update shown list with the task deleted
         taskData= taskData.filter(task=>!(task.taskId===e.currentTarget.parentElement.id));
         //localStorage.setItem('tasks', JSON.stringify(taskData));  
          saveToStorage('todo-app-main-*&*=^^&*@%$!?-tasks',taskData);
          updateTaskContainer(taskData);                                                                 
    } else if(viewType==='activeTasks'){
          activeTasks= activeTasks.filter(task=>!(task.taskId===e.currentTarget.parentElement.id));
          //localStorage.setItem('active-tasks', JSON.stringify(activeTasks));  
          saveToStorage('todo-app-main-$@#&*(!?@$%-active',activeTasks);                                     
          //update shown list with the task deleted
          updateTaskContainer(activeTasks); 
    } else if(viewType==='completedTasks'){
          completedTasks= completedTasks.filter(task=>!(task.taskId===e.currentTarget.parentElement.id));
          //localStorage.setItem('completed-tasks', JSON.stringify(completedTasks));  
          saveToStorage('todo-app-main@!#$%^&*(#$%@!^%-completed',completedTasks);                                     
          //update shown list with the task deleted
          updateTaskContainer(completedTasks); 
    }
}
  


// all , active and completed button functions................
vars.allBtn.addEventListener('click',(e)=>{
   //setView sets viewType to the current tasks, in this case taskData or after the user presses the all button.
   setView('taskData');
   //taskData is not set to an empty array, as taskData values consist of completedTasks and activeTasks values.
   //update list to show all tasks in taskData
   updateTaskContainer(taskData);
});

vars.completedBtn.addEventListener('click',(e)=>{
   //setView sets viewType of completedTasks as the user pressed the 'completed' button
   setView('completedTasks');
   //set completedTasks to empty array , to avoid adding to end from possible earlier getItem calls.
   completedTasks=[];
   //check to see which tasks are completed and update completedTasks
   taskActions('todo-app-main@!#$%^&*(#$%@!^%-completed',isChecked,completedTasks);
   updateTaskContainer(completedTasks);
});

const isChecked=(inputEl)=>inputEl.checked;
const isNotChecked=(inputEl)=>!inputEl.checked;

vars.activeBtn.addEventListener('click',(e)=>{
    //setView sets viewType to activeTasks as the user pressed the 'active' button
    setView('activeTasks');
    //set activeTasks to empty array , to avoid adding to end from possible earlier getItem calls.
    activeTasks=[];
    //check to see which tasks are active and update activeTasks
    taskActions('todo-app-main-$@#&*(!?@$%-active',isNotChecked,activeTasks);
    updateTaskContainer(activeTasks);
});



// Next two functions: clear completed button
const clearTodo=()=>{
    taskData=taskData.filter((task)=>{
        if(task.checked===false){
          return task;
        }
    });
    //localStorage.setItem("tasks", JSON.stringify(taskData));
    saveToStorage('todo-app-main-*&*=^^&*@%$!?-tasks',taskData);
}

vars.clearBtn.addEventListener('click',()=>{
    //setView sets viewType to completedTasks as the user pressed the 'Clear Completed' button and should show the empty completed on updateTaskContainer.
    setView('completedTasks');
    //set completedTasks to empty array first
    completedTasks=[];
    //localStorage.setItem('completed-tasks', JSON.stringify('completed-tasks'));
    saveToStorage('todo-app-main@!#$%^&*(#$%@!^%-completed',completedTasks);
    //in clearTodo() filter out checked tasks and update taskData.
    clearTodo(); 
    //update list shown with completed removed
    updateTaskContainer(completedTasks);
});




const updateTaskContainer = (data) => {
    //displays the number of active tasks
    const activeArr= taskData.filter(isNotChecked);
    vars.itemsleft.textContent = activeArr.length;

    let which; 
    vars.tasksdiv.innerHTML='';
    if(data){
      data.forEach(
          ({ taskId, task ,checked}) => {
                   
                   if(checked){
                    //whichStyle='text-decoration-line:line-through';
                    which='checked';
                   }else{
                    which='';
                   }
                  (vars.tasksdiv.innerHTML += `
                      <div data-id='${taskId}'>
                          <div class="display-flex align-items-center">
                            <input onchange='setRemoveChecked(event)' class="checkbox-round me-1" type="checkbox" ${which} id="${taskId}">
                            <label for='${taskId}' class='visually-hidden'>Check or uncheck task</label>
                            <textarea onchange='updateTask(event)' class="">${task}</textarea>
                            <button aria-label='delete task' onclick='deleteTask(event)' type='button' class='delete-task transparent-bg'><svg  class='cross' xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg></button>
                          </div>
                          <hr class='bottom-hr'>
                      </div>
                 `)
          }
        
      );
    }
  addlisteners();
};

const lighten=()=>{
     if($(vars.darkBtn).hasClass('hide')){
      $(vars.darkBtn).removeClass('hide');
      $(vars.lightBtn).addClass('hide');
    }
    if($(vars.lightBtn).hasClass('show')){
      $(vars.lightBtn).removeClass('show');
      $(vars.darkBtn).addClass('show');
    }
    if($(vars.html).hasClass('dark')){
      $(vars.html).removeClass('dark');
      $(vars.html).addClass('light');
    }
      vars.darkBtn.disable=false;
      vars.darkBtn.setAttribute('aria-hidden','false');
      vars.darkBtn.setAttribute('aria-disabled','false');

      vars.lightBtn.disable=true;
      vars.lightBtn.setAttribute('aria-hidden','true');
      vars.lightBtn.setAttribute('aria-disabled','true');
}
vars.lightBtn.addEventListener('click',()=>{
      lighten();
      localStorage.setItem('todo-app-main-@$$#@^%(*-lighten','true');
      
});

const darken=()=>{
      if($(vars.lightBtn).hasClass('hide')){
        $(vars.lightBtn).removeClass('hide');
        $(vars.darkBtn).addClass('hide');
      }
      if($(vars.darkBtn).hasClass('show')){
        $(vars.darkBtn).removeClass('show');
        $(vars.lightBtn).addClass('show');
      }
      if($(vars.html).hasClass('light')){
        $(vars.html).removeClass('light');
        $(vars.html).addClass('dark');
      }
       vars.lightBtn.disable=false;
       vars.lightBtn.setAttribute('aria-hidden','false');
       vars.lightBtn.setAttribute('aria-disabled','false');

       $(vars.darkBtn).disable=true;
       vars.darkBtn.setAttribute('aria-hidden','true');
       vars.darkBtn.setAttribute('aria-disabled','true');
}
vars.darkBtn.addEventListener('click',()=>{  //has hide.
       darken();
       localStorage.setItem('todo-app-main-@$$#@^%(*-lighten','false');
});



//next two functions are for saving the order in 'all' view when the user reorders the tasks.
const saveOrder =(e)=>{

      const order = sortable.toArray();
      let temp=[];
      if(viewType==='taskData'){
          taskData.forEach((task)=>{
                let index = order.indexOf(task.taskId);
                 temp[index] = task;
          });
          taskData=temp;
          saveToStorage('todo-app-main-*&*=^^&*@%$!?-tasks',taskData);
      }
}

//includes adding listeners to tasks for sort order
const addlisteners=()=>{
     [...document.querySelectorAll('.drag-task')].forEach(task=>task.addEventListener('dragend',(e)=>{
         e.target.classList.add("dragging");
         saveOrder(e);
     }));
     vars.reset.addEventListener('click',()=>{
         clearLocalStorage();
     });
}

window.onload = function(){
    
    
    let data = loadFromStorage('todo-app-main-*&*=^^&*@%$!?-tasks');

    if(data ===null){
       loadDefault();
       updateTaskContainer(taskData);
    }else {
       taskData = loadFromStorage('todo-app-main-*&*=^^&*@%$!?-tasks');
       updateTaskContainer(taskData);
       activeTasks = loadFromStorage('todo-app-main-$@#&*(!?@$%-active');
       completedTasks=loadFromStorage('todo-app-main@!#$%^&*(#$%@!^%-completed');
    }
    

    const islighten = localStorage.getItem('todo-app-main-@$$#@^%(*-lighten');
    (islighten==='true') ? lighten() : darken();

    //initalize sortable.
    sortable= Sortable.create(vars.tasksdiv, {      
        animation: 150,               
        group: "tasks", 
    }); 
    
};