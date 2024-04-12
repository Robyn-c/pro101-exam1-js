
const rutInput = document.querySelector("#rut");
const rutMessage = document.querySelector("#rutMessage");
const nameInput = document.querySelector("#name");
const form = document.querySelector(".form");

// Validacion de formulario

  // Truncar mensajes de error
function addEllipsis(errorMessage) {
  let maxLength = 60
  if(errorMessage.length > maxLength) {
    return errorMessage.substring(0, maxLength - 3) + "..."
  } else {
    return errorMessage
  }
}

function showError(inputElement, formElement, errorMessage) {
  
    const errorElement = formElement.querySelector(`.${inputElement.id}-input-error`);
    inputElement.classList.add("form_input_invalid")
    inputElement.classList.remove("form_input_valid")
    errorElement.textContent = errorMessage
}

function hideError(inputElement, formElement) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-input-error`);
    inputElement.classList.add("form_input_valid")
    inputElement.classList.remove("form_input_invalid")
    errorElement.textContent = ""

}

function checkInputValidity(formElement, inputElement) {
  errorMessage = addEllipsis(inputElement.validationMessage) 

  if(!inputElement.validity.valid) {
      showError(inputElement, formElement, errorMessage)
  } else {
      hideError(inputElement, formElement)
  }
  console.log("checkInputValidity")
}

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add("button_inactive")
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove("button_inactive")
  }
};


function setEventListeners(formElement, inputList) {
  
  const buttonElement = document.querySelector(".form_submit");
  toggleButtonState(inputList, buttonElement);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    })
  })
  console.log("setEventListeners")
}

function onSubmit(inputList, formElement, infoContainer) {
  
  if(hasInvalidInput(inputList)) {
    return console.log("Can't submit")
  }
  console.log("submit!")

  showFormData(formElement, infoContainer)
}

function showFormData(formElement, infoContainer) {
  const info = formDataToObject(formElement);
  setLocalStorage(info)
  getLocalStorage(infoContainer)
  console.log("getItemOnSubmit")

}

function getLocalStorage(infoContainer) {
  const data = JSON.parse(localStorage.getItem("formData"));
  console.log(data)
  console.log(Object.keys(data))
  Object.keys(data).forEach((item) => {
    const paragraph = document.createElement("p")
    paragraph.textContent = `${item}: ${data[item]}`
    infoContainer.appendChild(paragraph) 
  })
}

function formDataToObject(formElement) {
  const formData = new FormData(formElement);
  const data = {}
  formData.forEach((value, key) => (data[key] = value))
  console.log(data)
  return data
}

function setLocalStorage(info) {
  localStorage.setItem('formData', JSON.stringify(info))
  console.log("Data set!")
}

function deleteLocalStorage(infoContainer) {
  while (infoContainer.hasChildNodes()) {
    infoContainer.firstChild.remove()
  }
  localStorage.removeItem("formData")
  console.log("form data deleted")
}


function enableValidation() {
  const infoContainer = document.querySelector(".info_container")
  const formElement = document.querySelector(".form");
  const inputList = Array.from(formElement.querySelectorAll(".form_input"));

  const deleteButton = document.querySelector(".info_delete") 
  deleteButton.addEventListener("click", () => {
  deleteLocalStorage(infoContainer)
})

  formElement.addEventListener("submit", (evt) => {
    evt.preventDefault();
    deleteLocalStorage(infoContainer)
    onSubmit(inputList, formElement, infoContainer)
  });

  formList = formElement.querySelector(".form_list");
  setEventListeners(formList, inputList);
  console.log("enableValidation")
  
    if (localStorage.getItem("formData") !== null) {
      getLocalStorage(infoContainer)
      console.log("getItemOnLoad")
    } 
  }



enableValidation();

//Validacion de Rut

function rutValidation(rut) {
  let rutValue = clean(rut.value);

  let bodyRut = rutValue.slice(0, -1);
  let dv = rutValue.slice(-1).toUpperCase();

  rut.value = format(rutValue);

  // Modulo 11
  let sum = 0;
  let mul = 2;

  for (i = 1; i <= bodyRut.length; i++) {
    // Obtener su Producto con el Múltiplo Correspondiente
    index = mul * bodyRut.charAt(bodyRut.length - i);
    sum = sum + index;
    if (mul < 7) {
      mul = mul + 1;
    } else {
      mul = 2;
    }
  }
  dvEsperado = 11 - (sum % 11);
  dv = dv == "K" ? 10 : dv;
  dv = dv == 0 ? 11 : dv;

  if (dvEsperado != dv) {
    rutMessage.textContent = "Rut es Invalido";
    rutMessage.classList.add("form_message_invalid");

    rutInput.classList.add("form_input_invalid");
    rutInput.classList.remove("form_input_valid");
  }

  if (dvEsperado == dv) {
    rutMessage.textContent = "";
    rutInput.classList.add("form_input_valid");
    rutInput.classList.remove("form_input_invalid")
  }
}

function clean(rut) {
  return typeof rut === "string" ? rut.replace(/^0+|[^0-9kK]+/g, "").toUpperCase() : "";
}

function format(rut) {
  rut = clean(rut);

  var result = rut.slice(-4, -1) + "-" + rut.substr(rut.length - 1);
  for (let i = 4; i < rut.length; i += 3) {
    result = rut.slice(-3 - i, -i) + "." + result;
  }

  return result;
}

rutInput.addEventListener("input", (evt) => {
  const inputValue = evt.target.value;
  evt.target.value = inputValue.replace(/[^0-9kK]/g, '');
})

rutInput.addEventListener("blur", () => rutValidation(rutInput));

nameInput.addEventListener("input", (evt) => {
  const nameValue = evt.target.value
  evt.target.value = nameValue.replace(/[^a-zA-Z]/g, '');
})