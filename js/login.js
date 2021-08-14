//const db = firebase.database();
const db = firebase.firestore();

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

    db.collection("account").where("username", "==", user).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            if (doc.data().password == pass) {
                localStorage.setItem("userName", doc.data().name);
                localStorage.setItem("userJob", doc.data().job);
                window.location = "home.html";
            }
            else {
                alert("Password is invalid");
            }
        });
    });
}