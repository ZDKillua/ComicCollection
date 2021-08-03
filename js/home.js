let username = document.getElementById("userName");
let job = document.getElementById("userJob");
username.innerHTML = localStorage.getItem("userName");
job.innerHTML = localStorage.getItem("userJob");

let btnMenu = document.querySelector("#btn");
let sidebar = document.querySelector(".sidebar");
let btnLogout = document.getElementById("log-out");
let btnAdd = document.getElementById("btnAdd");

btnMenu.onclick = function() {
    sidebar.classList.toggle("active");
}

btnLogout.onclick = function() {
    window.location = "index.html";
}

btnAdd.onclick = function() {
    
}



