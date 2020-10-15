function component() {
  return ["<div>", "</div>"].join("Hello World");
}

document.getElementById("app").innerHTML = component();
