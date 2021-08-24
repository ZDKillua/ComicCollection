const db = firebase.firestore();

// User
const user = document.getElementById("userName");
const job = document.getElementById("userJob");
user.innerHTML = localStorage.getItem("userName");
job.innerHTML = localStorage.getItem("userJob");

// Menu
const btnMenu = document.querySelector("#btn");
const sidebar = document.querySelector(".sidebar");
const btnLogout = document.getElementById("log-out");
const btnAll = document.getElementById("btnAll");
const btnManhwa = document.getElementById("btnManhwa");
const btnManhua = document.getElementById("btnManhua");
const btnManga = document.getElementById("btnManga");
const btnOthers = document.getElementById("btnOthers");
const btnBlacklist = document.getElementById("btnBlacklist");
const txtSearch = document.getElementById("searchTxt");

// Modal add
const btnAdd = document.getElementById("btnAdd");
const addModal = document.querySelector(".add-modal");
const addModalForm = document.querySelector('.add-modal .form');
const txtImg = document.getElementById('linkImgAddModal');
const img = document.getElementById('imgAddModal');

// Modal edit
const editModal = document.querySelector(".edit-modal");
const editModalForm = document.querySelector('.edit-modal .form');
let id;

// Content
const cardContainer = document.querySelector('.card-container');

btnMenu.onclick = function() {
    sidebar.classList.toggle("active");
}

btnLogout.onclick = function() {
    window.location = "index.html";
}

function getDate() {
    let now = new Date();
    let mm = now.getMonth() + 1;
    let dd = now.getDate();
    if (mm < 10)
        mm = '0' + mm;
    if (dd < 10)
        dd = '0' + dd;

    let today = dd + '/' + mm + '/' + now.getFullYear();
    return today;
}

// Click add comic button
btnAdd.onclick = function() {
    document.getElementById('lastRead').value = getDate();
    addModal.classList.toggle("modal-show");
    
    addModalForm.name.value = '';
    addModalForm.chap.value = '';
    addModalForm.image.value = '';
    addModalForm.hot.checked = false;
    addModalForm.blackList.checked = false;
    addModalForm.imgAddModal.src = '';
    if (img.getAttribute('src') == "")
        img.style.visibility = 'hidden';
}

// User click anywhere outside the modal
window.addEventListener("click", e => {
    if (e.target === addModal) {
        addModal.classList.remove("modal-show");
    }
    if (e.target == editModal) {
        editModal.classList.remove("modal-show");
    }
})

// Render a Comic
const renderComic = doc => {
    const card = `
        <div class="card" data-id='${doc.id}' id='12'>
            <i class='bx bxs-x-circle btn-delete' id="1"></i>
            <div class="card-img">
                <img class="btn-edit" src="${doc.data().image}" alt="">
            </div>
            <div class="desc">
                <h6 class="card-title">${doc.data().name}</h6>
            </div>
            <div class="details">
                <div class="chap">
                    <h6 class="primary-text">${doc.data().chap}</h6>
                    <h6 class="secondary-text">Chap</h6>
                </div>
                <div class="last-read">
                    <h6 class="primary-text">${doc.data().lastRead}</h6>
                    <h6 class="secondary-text">Last Read</h6>
                </div>
            </div>
        </div>
    `;
    cardContainer.insertAdjacentHTML('beforeend', card);

    // Click edit user
    const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
    btnEdit.addEventListener("dblclick", () => {
        editModal.classList.add('modal-show');

        id = doc.id;
        editModalForm.name.value = doc.data().name;
        editModalForm.chap.value = doc.data().chap;
        editModalForm.image.value = doc.data().image;
        editModalForm.type.value = doc.data().type;
        editModalForm.lastRead.value = doc.data().lastRead;
        editModalForm.hot.checked = doc.data().hot;
        editModalForm.blackList.checked = doc.data().blackList;
        editModalForm.imgEditModal.src = doc.data().image;
    });
    
    // Click delete user
    const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
    btnDelete.addEventListener('click', () => {
        if (confirm("Are you sure you want to delete this comic?") == true) {
            db.collection('Comics/' + user.innerHTML + '/Comic').doc(`${doc.id}`).delete().then(() => {
                console.log('Comic successfully deleted');
            }).catch(err => {
                console.log('Error removing comic', err);
            });
        }
    });
}

// Real time listtener
db.collection('Comics/' + user.innerHTML + '/Comic').where('blackList', '==', false).onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            renderComic(change.doc);
        }
        if (change.type === 'removed') {
            let comic = document.querySelector(`[data-id='${change.doc.id}']`);
            cardContainer.removeChild(comic);
        }
        if (change.type === 'modified') {
            let comic = document.querySelector(`[data-id='${change.doc.id}']`);
            cardContainer.removeChild(comic);
            renderComic(change.doc);
        }
    })
})

// get validate in add comic form
function validateAddForm(){
    if (addModalForm.name.value == '' ||
        addModalForm.chap.value == '' ||
        addModalForm.image.value == '')
        return false;
    return true;
}

// Change text link img in add modal
txtImg.addEventListener('change', () => {
    if (txtImg.value != "") {
        img.style.visibility = 'visible';
        addModalForm.imgAddModal.src = txtImg.value;
    }
    else {
        img.style.visibility = 'hidden';
    }
});

// Click submit in add modal
addModalForm.addEventListener('submit', e => {
    e.preventDefault();
    if (validateAddForm() == true) {
        db.collection('Comics/' + user.innerHTML + '/Comic').add({
            name: addModalForm.name.value,
            chap: addModalForm.chap.value,
            image: addModalForm.image.value,
            type: addModalForm.type.value,
            lastRead: addModalForm.lastRead.value,
            hot: addModalForm.hot.checked,
            blackList: addModalForm.blackList.checked
        });
        addModal.classList.remove('modal-show');
    }
    else {
        alert('Please enter all information in the form');
    }
});

// Click submit in edit modal
editModalForm.addEventListener('submit', e => {
    e.preventDefault();
    db.collection('Comics/' + user.innerHTML + '/Comic').doc(id).update({
        name: editModalForm.name.value,
        chap: editModalForm.chap.value,
        image: editModalForm.image.value,
        type: editModalForm.type.value,
        lastRead: editModalForm.lastRead.value,
        hot: editModalForm.hot.checked,
        blackList: editModalForm.blackList.checked
    });
    editModal.classList.remove('modal-show');
});

// Click type comic button in menu
function getComicsOfType(str) {
    clearCardInContent();

    if (str === 'Blacklist') {
        db.collection('Comics/' + user.innerHTML + '/Comic').where('blackList', '==', true).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                renderComic(doc);
            })
        });
        return;
    }
    else if (str == 'All Comics') {
        db.collection('Comics/' + user.innerHTML + '/Comic').where('blackList', '==', false).get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                renderComic(doc);
            })
        });
        return;
    }
    db.collection('Comics/' + user.innerHTML + '/Comic').where('type', '==', str).where('blackList', '==', false).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            renderComic(doc);
        })
    });
}

// Clear cardContainer children
function clearCardInContent(){
    while (cardContainer.firstChild)
        cardContainer.firstChild.remove();
}

// Click type comic menu button
btnManhwa.addEventListener('click', () => {
    getComicsOfType(btnManhwa.children[1].innerHTML);
});
btnManhua.addEventListener('click', () => {
    getComicsOfType(btnManhua.children[1].innerHTML);
});
btnManga.addEventListener('click', () => {
    getComicsOfType(btnManga.children[1].innerHTML);
});
btnOthers.addEventListener('click', () => {
    getComicsOfType(btnOthers.children[1].innerHTML);
});
btnBlacklist.addEventListener('click', () => {
    getComicsOfType(btnBlacklist.children[1].innerHTML);
});
btnAll.addEventListener('click', () => {
    getComicsOfType(btnAll.children[1].innerHTML);
});

// Search comic
txtSearch.addEventListener('input', () => {
    db.collection('Comics/' + user.innerHTML + '/Comic').where('blackList', '==', false).get().then(querySnapshot => {
        clearCardInContent();
        querySnapshot.forEach(doc => {
            if (removeAccents(doc.data().name.toUpperCase()).includes(removeAccents(txtSearch.value.toUpperCase()))) {
                renderComic(doc);
            }
        });
    });
});

function removeAccents(str) {
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ", "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ"    
    ];
    for (var i=0; i<AccentsMap.length; i++) {
      var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }