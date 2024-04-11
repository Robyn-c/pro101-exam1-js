

const form = document.querySelector(".form");

form.addEventListener("submit", onSubmit)

function onSubmit(event) {
  event.preventDefault();

  console.log("Hiii!")
}