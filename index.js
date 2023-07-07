const main = document.querySelector('.main_container');
const header = document.querySelector('.main__header');

document.addEventListener("DOMContentLoaded", () => {
    handleGetPosts();
})


function handleGetPosts() {
    let posts = getPosts();
    console.log(posts);
    if (typeof posts === 'object') {

    }
}

function checkEmptyList(lenghtElement) {
    if (lenghtElement == 0) {
        let empty = document.createElement('div')
        empty.className = "empty";
        let h2 = document.createElement('h2')
        h2.innerText = "Список пуст"
        let img = document.createElement('img')
        img.className = "empty__img"
        img.src = "https://i.pinimg.com/originals/e7/49/83/e749836ffe099953f48743d714de5482.jpg"
        empty.append(h2);
        empty.append(img);
        header.append(empty);
    } else {
        let empty = document.querySelector('.empty')
        if (empty) {
            console.log(empty)
            console.log(listItem)
            main.removeChild(empty);
        }
    }
}

async function getPosts() {
    const url = "https://quantico.kz:3300/posts";
    await fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data.post.length);
            checkEmptyList(data.post.length);
            data.post.forEach(element => {
                // Отображение данных на форме HTML

                const item = document.createElement('div');
                item.id = element.ID;
                item.className = 'item';

                const h2 = document.createElement('h2');
                h2.className = 'item__h2';
                h2.innerText = element.Title;
                h2.style.color = 'white';
                const description = document.createElement('div');
                description.className = 'item__description';
                description.innerText = element.Body;
                description.style.color = 'white';
                const dateContainer = document.createElement('div');
                dateContainer.className = 'container_data';

                const deleteBtn = document.createElement('img');
                deleteBtn.className = 'container_delete';
                deleteBtn.src = './images/delete.png';
                deleteBtn.addEventListener('click', handleItemDeleteClick)

                const editBtn = document.createElement('img');
                editBtn.className = 'container_edit';
                editBtn.src = './images/edit.png';
                editBtn.addEventListener('click', handleItemEdit)




                const date = document.createElement('div');
                date.className = 'item__data';
                const dateTime = element.CreatedAt.substring(0, 10);
                date.innerText = dateTime;
                date.style.color = 'white';
                dateContainer.append(deleteBtn)
                dateContainer.append(editBtn)
                dateContainer.append(date)
                main.append(item);
                item.append(h2)
                item.append(description)
                if (element.ImagePath != "") {
                    const img = document.createElement('img');
                    img.className = 'item__img';
                    img.src = "https://quantico.kz:3300/" + element.ImagePath;
                    item.append(img)
                }
                item.append(dateContainer)
            });
            return data;
        });

}

function handleItemDeleteClick(event) {
    deletePosts(event.target.parentNode.parentNode.id)
    event.target.parentNode.parentNode.remove()
}
async function deletePosts(postId) {
    const url = 'https://quantico.kz:3300/posts/' + String(postId);
    console.log(postId)
    console.log(`${url}/${postId}`)
    await fetch(url, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                console.log('Запрос на удаление успешно выполнен');
            } else {
                console.error('Ошибка при выполнении запроса на удаление:', response.status);
            }
        })
        .catch(error => {
            console.error('Ошибка при выполнении запроса на удаление:', error);
        });
}

function handleItemEdit(e) {
    openModal(e)
}


const btn = document.getElementById('btn')
btn.addEventListener('click', () => {
    sendPosts();

})

async function sendPosts() {

    const url = 'https://quantico.kz:3300/posts';
    const formData = new FormData();
    const imageInput = document.getElementById('imagePath');
    const mainTitle = document.querySelector('.main__title');
    const mainDescription = document.querySelector('.main__description');
    const imageFile = imageInput.files[0];
    if (imageInput.files.length > 0) {
        formData.append('image', imageFile);
    } else {
        formData.append('imageEmty', true);
    }
    formData.append('title', mainTitle.value);
    formData.append('body', mainDescription.value);

    await fetch(url, {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {

                mainTitle.value = "";
                mainDescription.value = "";
                imageInput.value = "";
                location.reload();
            } else {
                console.error('Ошибка при выполнении запроса:', response.status);
            }
        })
        .catch(error => {
            console.error('Ошибка при выполнении запроса:', error);
        });
}
// const fileInput = document.getElementById("imagePath");
// const selectedFileName = document.getElementById("selectedFileName");

// fileInput.addEventListener("change", (event) => {
//     const fileName = event.target.files[0].name;
//     selectedFileName.textContent = "Выбранный файл: " + fileName;
//     selectedFileName.style.display = "block";
// });




function openModal(e) {
    document.querySelector(".modal-content").style.display = "flex";
    document.querySelector(".main").style.display = "none";
    let elementId = e.target.parentNode.parentNode.id
    const title = document.querySelector('.title');
    title.id = elementId
    const description = document.getElementById('description');
    const image = document.getElementById('preview-image');
    let child = e.target.parentNode.parentNode.children

    for (let i = 0; i < child.length; i++) {
        console.log(child[i]);
        if (child[i].className === 'item__h2') {
            title.value = child[i].innerText
            console.log(child[i].innerText);
        }
        if (child[i].className === 'item__description') {
            description.innerText = child[i].innerText;
        }

        if (child[i].className === 'item__img') {
            image.src = child[i].src;
        }
    }
}
function closeModal() {
    document.querySelector(".modal-content").style.display = "none";
    document.querySelector(".main").style.display = "flex";
    console.log("closeModal");
}


function changeImage() {
    const fileInput = document.getElementById("image-upload");
    const previewImage = document.getElementById("preview-image");

    // Проверка, выбран ли файл
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        // Событие загрузки файла
        reader.onload = function (e) {
            previewImage.src = e.target.result;
        };

        // Чтение выбранного файла как URL-адреса данных
        reader.readAsDataURL(fileInput.files[0]);
    }
}



//отображение картинки при выборе в модальном окне-+
const previewInput = document.getElementById('update-image');
previewInput.addEventListener('change', function () {
    readImage(this);
});
function readImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var previewImage = document.getElementById('preview-image');
            previewImage.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}
//кнопка UPDATE на модальном окне 
const btnUpdate = document.querySelector(".btn-edit");
console.log(btnUpdate)
btnUpdate.addEventListener('click', editBtnClick)

async function editBtnClick() {
    const title = document.querySelector('.title');
    let titleId = title.id
    const description = document.getElementById('description');
    const image = document.getElementById('preview-image');
    const fileInput = document.getElementById("update-image");

    const url = 'https://quantico.kz:3300/posts/' + String(titleId);
    console.log(url);
    const formData = new FormData();
    const imageFile = fileInput.files[0];
    //если нет картинки то отправляем true
    if (fileInput.files.length > 0) {
        formData.append('image', imageFile);
    } else {
        formData.append('imageEmty', true);
    }
    formData.append('title', title.value);
    formData.append('body', description.value);

    // //асинхрон Update на сервер
    console.log("editPosts");
    await fetch(url, {
        method: 'PUT',
        body: formData
    }).then(response => {
        if (response.ok) {
            // title.value = "";
            // description.value = "";
            //imageInput.value = "";
            console.log(response + "response");
            alert("Запрос отправлен успешно!!")
            console.log('Запрос отправлен успешно!!');
            location.reload();
        } else {
            console.log('Ошибка при выполнении запроса:', response.status + "response");
        }
    })
        .catch(error => {
            console.log(response + "response");
            console.error('Ошибка при выполнении запроса:', error + "response");
        });

    //location.reload();


}

// await fetch(url, {
//     method: 'POST',
//     body: formData
// })
//     .then(response => {
//         if (response.ok) {

//             mainTitle.value = "";
//             mainDescription.value = "";
//             imageInput.value = "";
//             location.reload();
//         } else {
//             console.error('Ошибка при выполнении запроса:', response.status);
//         }
//     })
//     .catch(error => {
//         console.error('Ошибка при выполнении запроса:', error);
//     });

async function editPosts(url, formData) {


}
