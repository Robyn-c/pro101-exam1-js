const rutInput = document.querySelector("#rut");
const rutMessage = document.querySelector("#rutMessage");

const form = document.querySelector(".form")

const { rut, name } = form.elements;

function onSubmit(evt) {
  evt.preventDefault();
}


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
