export { renderRegister };

function renderRegister() {
  const codi = `<h1>Register</h1>`;
  const section = document.createElement("section");
  section.setAttribute("id", "registerSection");
  section.innerHTML = codi;
  return section;
}
