let username = document.getElementById("userName");
let job = document.getElementById("userJob");
username.innerHTML = localStorage.getItem("userName");
job.innerHTML = localStorage.getItem("userJob");

let btnMenu = document.querySelector("#btn");
let sidebar = document.querySelector(".sidebar");
let btnLogout = document.getElementById("log-out");
let btnAdd = document.getElementById("btnAdd");
let addModal = document.querySelector(".add-modal");

btnMenu.onclick = function() {
    sidebar.classList.toggle("active");
}

btnLogout.onclick = function() {
    window.location = "index.html";
}

// Click add comic button
btnAdd.onclick = function() {
    addModal.classList.add("modal-show");
}

// User click anywhere outside the modal
window.addEventListener("click", e => {
    if (e.target === addModal) {
        addModal.classList.remove("modal-show");
    }
})



