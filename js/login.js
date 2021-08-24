//const db = firebase.database();
const db = firebase.firestore();
const btnSignIn = document.getElementById('signIn');
const txtPass = document.getElementById("password");
const txtUsername = document.getElementById("username");

txtPass.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("signIn").click();
    }
});
txtUsername.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("signIn").click();
    }
});

btnSignIn.addEventListener('click', () => {
    db.collection("account").where("username", "==", txtUsername.value).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            if (doc.data().password == txtPass.value) {
                localStorage.setItem("userName", doc.data().name);
                localStorage.setItem("userJob", doc.data().job);
                window.location = "home.html";
            }
            else {
                alert("Password is invalid");
            }
        });
    });
});