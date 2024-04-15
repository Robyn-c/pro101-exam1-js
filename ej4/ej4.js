


const addButton = document.querySelector(".add-button");
const addModal = document.querySelector(".add-modal");
const addModalButton = addModal.querySelector(".add-modal_submit")
const addModalForm = addModal.querySelector(".add-modal_form")

addButton.addEventListener("click", () => addModal.show());

const todoContainer = document.querySelector(".todo-container");

function addTodo(nameValue) {
  const todoTemplate = document.querySelector("#todo-template").content;
  const todoElement = todoTemplate.querySelector(".todo_item").cloneNode(true);
  const deleteButton = todoElement.querySelector(".delete-button");
  todoElement.querySelector(".todo_name").textContent = nameValue;
  deleteButton.addEventListener('click', (e) => {
    e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
    console.log("delete")
  })
  todoContainer.append(todoElement);
  saveTasksToLocalStorage();

}

function saveTasksToLocalStorage() {
  const tasks = [];
  const taskItems = todoContainer.getElementsByClassName("todo_item");
  
  for (let i = 0; i < taskItems.length; i++) {
    tasks.push(taskItems[i].textContent);
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
 }

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks) {
    tasks.forEach(taskText => {
      const todoTemplate = document.querySelector("#todo-template").content;
      const todoElement = todoTemplate.querySelector(".todo_item").cloneNode(true);
      const deleteButton = todoElement.querySelector(".delete-button");
      todoElement.querySelector(".todo_name").textContent = taskText;
      deleteButton.addEventListener('click', (e) => {
        e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
        console.log("delete")
      })
      todoContainer.append(todoElement);
    })
  }
}

  addModalForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const name = addModal.querySelector(".add-modal_name");
    addTodo(name.value);
    name.value = "";
   
  })

  const showInputError = (formElement, inputElement, errorMessage) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add("form__input_type_error");
    errorElement.textContent = errorMessage;
    errorElement.classList.add("form__input-error_active");
  };
  
  const hideInputError = (formElement, inputElement) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove("form__input_type_error");
    errorElement.classList.remove("form__input-error_active");
    errorElement.textContent = "";
  };
  
  const checkInputValidity = (formElement, inputElement) => {
    if (!inputElement.value) {
      showInputError(formElement, inputElement, inputElement.validationMessage);
    } else {
      hideInputError(formElement, inputElement);
    }
  };
  
  const hasInvalidInput = (inputElement) => {
    if (inputElement.value) {
      return false
    } else {
      return true
    }
  };
  
  const toggleButtonState = (inputElement, buttonElement) => {
    console.log(hasInvalidInput(inputElement));
    if (hasInvalidInput(inputElement)) {
      buttonElement.classList.add("button_inactive");
      buttonElement.disabled = true;
    } else {
      buttonElement.classList.remove("button_inactive");
      buttonElement.disabled = false;
    }
  };
  
  const setEventListeners = (formElement) => {
    const inputElement = formElement.querySelector(".form__input");
    const buttonElement = formElement.querySelector(".form__submit");
      toggleButtonState(inputElement, buttonElement);
      addButton.addEventListener("click", () => {
        toggleButtonState(inputElement, buttonElement);
        checkInputValidity(formElement, inputElement);
      })
      inputElement.addEventListener("input", function () {
        checkInputValidity(formElement, inputElement);
        toggleButtonState(inputElement, buttonElement);
    });
  };
  
  const enableValidation = () => {
    const formList = Array.from(document.querySelectorAll(".form"));
    formList.forEach((formElement) => {
      formElement.addEventListener("submit", function (evt) {
        evt.preventDefault();
        addModal.hide()
      });
      console.log(formList)
      formList.forEach((fieldset) => {
        setEventListeners(fieldset);
      });
    });
  };
  
loadTasksFromLocalStorage(); 
enableValidation();