// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const input = document.getElementById("input");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");



// edit option

let editElement;
let editFlag = false ;
let editId = "" ;


// ****** EVENT LISTENERS **********

    // submit form 
    form.addEventListener("submit", addItem);

    //  clear items 
    clearBtn.addEventListener("click" , clearItems );

    // Load storage 
    window.addEventListener("DOMContentLoaded", setupItems);

// ****** FUNCTIONS **********
function addItem(e) {
    e.preventDefault();
    const value = input.value
    const id = new Date ().getTime().toString();
    if(value !=="" && editFlag === false) {
        createListItem(id , value) ;
        // display alert
        displayAlert("item added to the list " , "success") ;
        // show container
        container.classList.add("show-container") ;
        // add to local storage
        addToLocalStorage(id,value);
        // set back to default
        setBackToDefault();
        
        
    }
    else if (value !== "" && editFlag === true){
        editElement.innerHTML = value ;
        displayAlert ("value changed", "sucess");
        editLocalStorage (editId, value) ;
        setBackToDefault ();


    }
    else { 
        displayAlert ("please enter value" , "danger")
    }
}


// Display Alert
function displayAlert (text , action) {
    alert.textContent = text ;
    alert.classList.add(`alert-${action}`) ;
// Remove Alert
    setTimeout(function(){
    alert.textContent = "" ;
    alert.classList.remove(`alert-${action}`) ;
    },2000);
}
// Clear all items
function clearItems (){
    const items = document.querySelectorAll( ".grocery-item");

    if(items.length > 0){
        items.forEach(function(item){
         list.removeChild(item);   
        });
    }
    container.classList.remove("show-container");
    displayAlert("empty list" , "danger");
    setBackToDefault ();
    localStorage.removeItem("list");
}


// Delete Function
function deleteItem (e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id ;
    list.removeChild(element);
    if (list.children.length === 0 ) {
        container.classList.remove("show-container");
    }
    displayAlert ("item removed", "danger");
    setBackToDefault ();
    // remove from local storage
    removeFromLocalStorage(id);
}
// Edit function
function editItem (e) {
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    input.value = editElement.innerHTML ;
    editFlag = true ;
    editId = element.dataset.id ;
    submitBtn.textContent = "edit" ;
}
// Set back to default
function setBackToDefault() {
    input.value = "";
    editFlag = false ;
    editId = "";
    submitBtn.textContent = "Submit" ;
}

// ****** LOCAL STORAGE **********
function addToLocalStorage (id , value){
    const grocery = {id , value};
    let items = getLocalStorage () ;
    items.push(grocery);
    localStorage.setItem("list" , JSON.stringify(items));
    console.log(items);
}
//  remove local storage
function removeFromLocalStorage (id){
let items = getLocalStorage ();
items = items.filter(function (item){
if (item.id !==id)
return item ;
})
localStorage.setItem("list" , JSON.stringify(items));
}

// edit local storage 

function editLocalStorage (id , value) {
let items = getLocalStorage ();
items = items.map(function(item){
    if (item.id === id){
    item.value = value ;
}
return item ;
})
localStorage.setItem("list" , JSON.stringify(items));
}

function getLocalStorage (){
    return  localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[];
}
// ****** SETUP ITEMS **********

function setupItems (){
let items = getLocalStorage () ;
if(items.length > 0) {
items.forEach(function(item){
    createListItem(item.id , item.value);
    })
    container.classList.add("show-container");
}
};


function createListItem (id , value ){
    const element = document.createElement("article")
    // add class to element
    element.classList.add("grocery-item");
    // ad id
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
      <button type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
    </div>` ;
    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");

    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);
     // append item to list 
    list.appendChild(element);
};