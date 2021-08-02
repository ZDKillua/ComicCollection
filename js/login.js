function Redirect() {
    const user = document.getElementById("user").value;
    const pass = document.getElementById("password").value;
    if (user == "admin" && pass == "123123")
        window.location = "home.html";
    
}

var inputPass = document.getElementById("password");
inputPass.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("signIn").click();
    }
});