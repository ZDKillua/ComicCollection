const db = firebase.database();

var inputPass = document.getElementById("password");
inputPass.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("signIn").click();
    }
});

function Redirect() {
    let user = document.getElementById("user").value;
    let pass = document.getElementById("password").value;

    db.ref("account/" + user).on("value", function(snapshot){
        if (pass == snapshot.val().password){
            localStorage.setItem("userName", snapshot.val().name);
            localStorage.setItem("userJob", snapshot.val().job);
            window.location = "home.html";
        }
        else {
            alert("Password is invalid");
        }
    });
}