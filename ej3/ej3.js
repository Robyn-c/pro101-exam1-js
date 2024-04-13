
// Alogoritmo Luhn
function validateLuhnAlgorithm(cardNumber) {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (isEven) {
          digit *= 2;
          if (digit > 9) {
              digit -= 9;
          }
      }
      sum += digit;
      isEven = !isEven;
  }
  detectCardType(cardNumber);
  return sum % 10 === 0;
}

function detectCardType(cardNumber) {
  const patterns = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
  };

  for (const cardType in patterns) {
      if (patterns[cardType].test(cardNumber)) {
          return cardType;
      }
  }

  return "Unknown";
}

function showError(e, errorElement) {
  errorElement.classList.remove("hidden");
  e.target.classList.remove("form_input_valid")
  e.target.classList.add("form_input_invalid")
}

function hideError(e, errorElement) {
  errorElement.classList.add("hidden");
  e.target.classList.add("form_input_valid")
  e.target.classList.remove("form_input_invalid")
}

// Validación Numero de Tarjeta
const cardNumberInput = document.querySelector("#card_number");
const cardNumberWarning = document.querySelector("#invalidCard");
const imgElement = document.querySelector(".form_icon");

cardNumberInput.addEventListener("input", (e) => {
  
  let inputValueTrimmed =  e.target.value.replace(/-/g, '');
  if (!validateLuhnAlgorithm(inputValueTrimmed) || !e.target.validity.valid) {
    showError(e, cardNumberWarning);
  } else {
    hideError(e, cardNumberWarning);
  }
  e.target.value = e.target.value.replace(/[^0-9]+/g, '')
  e.target.value = e.target.value.replace(/(\d{4})(?=\d)/g, '$1-');
  
  // Tipo de tarjeta
  const cardType = detectCardType(inputValueTrimmed);
  console.log(cardType)
  if (cardType === "Unknown") {
    imgElement.classList.add("hidden");
    return "Unknown card type";
  } else {
    imgElement.classList.remove("hidden");
    imgElement.src = `assets/cc-${cardType}.svg`;
  }
});


// Validación Nombre 
const nameInput = document.querySelector("#name");
const nameWarning = document.querySelector("#invalidName");
nameInput.addEventListener("input", (e) => {
  if(!e.target.validity.valid) {
    showError(e, nameWarning);
  } else {
    hideError(e, nameWarning);
  }
  e.target.value = e.target.value.replace(/[^a-zA-Z\s]+/g, '')
})

//Validacion de Fecha 

const expireDateInput = document.querySelector("#expiration_date")
const expireDateWarning = document.querySelector("#invalidDate")

function validateExpirationDate(expirationMonth, expirationYear) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // January is 0

  if (expirationYear > currentYear) {
      return true;
  } else if (expirationYear === currentYear && expirationMonth >= currentMonth) {
      return true;
  }

  return false;
}

expireDateInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^0-9]+/g ,"");
  e.target.value = e.target.value.replace(/(\d{2})(\d{2})/, "$1/$2");
  const dateExpression = new RegExp("^(0[1-9]|1[0-2])\/?([0-9]{2})$");
  if (dateExpression.test(e.target.value)) {
      hideError(e, expireDateWarning);
      let data = e.target.value.split("/");
      let expirationMonth = data[0];
      let expirationYear = '20' + data[1];
      // Validate expiration date
      if (!validateExpirationDate(expirationMonth, expirationYear)) {
          showError(e, expireDateWarning);
      } else {
          hideError(e, expireDateWarning);
      }
  } else {
      showError(e, expireDateWarning);
  }
});

function validateCVV(cvv) {
  const cvvPattern = /[0-9]{3,4}$/;
  return cvvPattern.test(cvv);
}

const cvvElement = document.querySelector("#cvv");
const cvvWarning = document.querySelector("#invalidCVV");

cvvElement.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^0-9]+/g, '')
  if (!validateCVV(e.target.value)) {
    showError(e, cvvWarning);
  } else {
    hideError(e, cvvWarning);
  }
});

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

const formElement = document.querySelector(".form");
const inputList = Array.from(formElement.querySelectorAll(".form_input"));

const buttonElement = document.querySelector(".form_submit");

toggleButtonState(inputList, buttonElement);
inputList.forEach((inputElement) => {
  inputElement.addEventListener("input", () => {
    toggleButtonState(inputList, buttonElement);
  })
})

formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Submit!");
})

