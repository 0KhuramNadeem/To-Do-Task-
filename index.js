const search_bar = document.querySelector(".search-bar");
const save_button = document.querySelector(".save-button");
const append_list = document.querySelector(".append_list");
const work_list = document.querySelector(".work-list");
const edit = document.querySelector(".edit");
const update_text = document.querySelector(".update-text");
const update_description = document.querySelector(".update-description");
const update_button = document.querySelector(".update-button");
const count = document.querySelector(".count");
const clear_button = document.querySelector(".clear-button");
const description = document.querySelector(".description");
const cancel_update = document.querySelector(".cancel-update");
const del_button = document.querySelector(".del-button");
const del_popup = document.querySelector(".del-popup");
const cancel_button = document.querySelector(".cancel-button");
const details = document.querySelector(".details");
const title = document.querySelector(".title");
const des = document.querySelector(".des");
const cancel = document.querySelector(".cancel");

let my_item;

let myArr = [];

// myArr = JSON.parse(localStorage.getItem("tasks"));

let id_counter = 0;
id_counter = localStorage.getItem("counter")

const dbWrapperPatch = (resourceId, updateData) => {
    return new Promise((resolve, reject) => {
        resolve(fetch(`http://localhost:3000/toDoData/${resourceId}`, {
            method: 'PATCH',

            body: JSON.stringify(updateData)
        }))
    });
}


const dbWrapperPost = (title, description) => {
    return new Promise((resolve, reject) => {
        resolve(fetch("http://localhost:3000/toDoData", {
            method: "POST",
            body: JSON.stringify({
                title: `${title}`,
                description: `${description}`
            }),
        }))
    })
}

const dbWrapperDelete = (resourceId) => {
    return new Promise((resolve, reject) => {
        resolve(fetch(`http://localhost:3000/toDoData/${resourceId}`, {
            method: 'DELETE',
        }))
    });
}


const dbWrapperGet = () => {
    return new Promise((resolve, reject) => {
        resolve(fetch("http://localhost:3000/toDoData", {
            method: "GET"
        }))
    })
}

// crud rest full api and rest api

dbWrapperGet().then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        myArr = data;
        updateTask();
    })
    .catch((error) => {
        console.log(error);
    })

const update = (item) => {
    edit.style.visibility = 'visible';
    update_text.value = item.title;

    update_description.value = item.description;
    if (update_description.value === "") {
        update_description.placeholder = "No Description Availible"
    }

    my_item = item;

}
const delItem = (item) => {
    del_popup.style.visibility = "visible";

    my_item = item;
}

const updateTask = () => {
    let counter = 0;
    append_list.innerHTML = "";
    if (myArr.length == 0) {
        localStorage.setItem("tasks", JSON.stringify(myArr));
        work_list.style.visibility = 'hidden';
        return;
    }
    work_list.style.visibility = 'visible';


    myArr.forEach((item) => {
        counter++;

        let myLi = document.createElement("li");
        myLi.classList.add("task-aliment");



        let paragraph = document.createElement("p");
        paragraph.classList.add("text-name");
        paragraph.textContent = `${counter}. ${item.title}`;
        paragraph.addEventListener("click", function() {
            title.textContent = "Title : " + item.title;
            if (item.description == "") {
                des.textContent = "Description : Not Availible";
            } else {
                des.textContent = "Description : " + item.description;
            }
            details.style.visibility = 'visible';
        });

        let div = document.createElement("div");


        let editText = document.createElement("img");
        editText.classList.add("del-update");
        editText.src = "./src/assets/update.svg"
        editText.addEventListener("click", function() {
            update(item);
        });

        let delText = document.createElement("img");
        delText.classList.add("del-update");
        delText.src = "./src/assets/del.svg"
        delText.addEventListener("click", function() {
            delItem(item);

        });



        myLi.appendChild(paragraph);
        div.appendChild(editText);
        div.appendChild(delText);
        myLi.appendChild(div);
        append_list.appendChild(myLi);

    });
    count.textContent = `Total Count  ${counter}`
    search_bar.value = "";
    description.value = "";

    // localStorage.setItem("tasks", JSON.stringify(myArr));
}



save_button.addEventListener("click", () => {
    let mytitle = search_bar.value;
    let myDes = description.value;

    id_counter++;
    if (search_bar.value === "") {
        return;
    }
    if (search_bar.value.length < 3) {
        alert("enter at least 3 alphabet in task title");
        return;
    }

    dbWrapperPost(mytitle, myDes).then(() => {
            dbWrapperGet().then((response) => {
                    return response.json();
                }).then((data) => {
                    console.log(data);
                    myArr = data;
                    updateTask();
                })
                .catch((error) => {
                    console.log(error);
                })
        })
        .catch((error) => {
            console.log(error);
        })

    // localStorage.setItem("counter", id_counter);
});

clear_button.addEventListener("click", (event) => {
    search_bar.value = "";
    description.value = "";
});

cancel_update.addEventListener("click", (event) => {
    update_text.value = "";
    update_description.value = ""
    edit.style.visibility = 'hidden';
});
cancel.addEventListener("click", (event) => {
    details.style.visibility = 'hidden';
});
cancel_button.addEventListener("click", (event) => {
    del_popup.style.visibility = "hidden"
});

del_button.addEventListener("click", (event) => {
    dbWrapperDelete(my_item.id).then(() => {
        console.log("deleted");
        dbWrapperGet().then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data);
                myArr = data;
                updateTask();
            })
            .catch((error) => {
                console.log(error);
            })

    })

    updateTask();
    del_popup.style.visibility = "hidden";
    my_item = null;
});

update_button.addEventListener("click", (event) => {


    console.log(my_item);
    if (update_text.value === "") {
        update_text.value = "";
        update_description.value = "";
        edit.style.visibility = 'hidden';
        return;
    }
    let new_val = update_text.value;
    let new_des = update_description.value;

    const updateData = {
        title: `${new_val}`,
        description: `${ new_des}`
    }
    dbWrapperPatch(my_item.id, updateData).then(() => {
        console.log("updated");
        dbWrapperGet().then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data);
                myArr = data;
                updateTask();
            })
            .catch((error) => {
                console.log(error);
            })
    })


    update_text.value = "";
    update_description.value = ""
    edit.style.visibility = 'hidden';
    my_item = null;
});