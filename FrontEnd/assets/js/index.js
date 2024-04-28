window.addEventListener("load", function () {

    fetch("http://localhost:5678/api/works", {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => {
            if (response.status == 200) {
                return response;
            } else {
                throw new Error(response.statusText);
            }
        })
        .then(response => response.json())
        .then(jsonArray => {

            if (jsonArray) {
                var categories = new Map();
                let gallery = this.document.getElementsByClassName("gallery")[0];
                let galleryModal = document.getElementById('galleryModal');

                for (const doc of jsonArray) {
                    categories.set(doc['category']['id'], doc['category']['name']);
                    let figure = this.document.createElement("figure");
                    let image = this.document.createElement("img");
                    image.setAttribute("alt", doc['title']);
                    image.setAttribute("src", doc['imageUrl']);
                    let figcaption = document.createElement("figcaption");
                    figcaption.innerHTML = doc['title'];
                    figure.setAttribute('categoryid', doc['category']['id']);
                    figure.setAttribute('id', doc['id']);
                    figure.append(image);
                    figure.append(figcaption);
                    gallery.append(figure);

                    let thumbnail = document.createElement("div");
                    thumbnail.classList.add('thumbnail');
                    thumbnail.setAttribute('id', doc['id']);
                    let imageCpy = image.cloneNode(true);
                    thumbnail.append(imageCpy);
                    let trash = document.createElement('img');
                    trash.setAttribute('src', "assets/images/trash.svg");
                    trash.classList.add('trashcan');
                    trash.addEventListener('click', (e) => deleteWork(e, doc['id']));
                    thumbnail.append(trash);
                    galleryModal.append(thumbnail);

                }

                var select = document.getElementById('newCategory');

                categories.forEach((value, key) => {
                    let option = document.createElement('option');
                    option.setAttribute('value', key);
                    option.innerHTML = value;
                    select.append(option);
                });


            }
        })
        .then(() => {
            if (!localStorage.token) {
                return filterButtons();
            }
            else {
                return editView();
            }
        })
        .catch(error => {
            this.alert(error);
        });

    const editView = () => {
        let dialog = this.document.getElementById('editModal');
        dialog.addEventListener("click", (e) => {
            if (e.target === dialog) {
                dialog.close();
            }
        });

        const input = document.querySelector("#imageUpload");
        const preview = document.querySelector(".preview");

        input.addEventListener("change", () => updateImageDisplay(input, preview));

        let addPanel = this.document.getElementById('addPanel');
        let removePanel = this.document.getElementById('removePanel');

        let inputs = [];
        let button = addPanel.querySelector('[type="submit"]');
        button.disabled = true
        inputs.push(input);
        inputs.push(this.document.getElementById('newTitle'));
        inputs.push(this.document.getElementById('newCategory'));

        for (i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('input', () => {
                let values = []
                inputs.forEach(v => values.push(v.value))
                button.disabled = values.includes('')
            })
        }

        let addForm = this.document.getElementById('addForm');
        addForm.addEventListener('submit', addWork);

        let back = this.document.getElementById('back');
        back.style.visibility = 'hidden';
        addPanel.style.display = 'none';

        let addButton = this.document.getElementById('addButton');
        addButton.addEventListener('click', () => {
            back.style.visibility = 'visible';
            addPanel.style.display = 'block';
            removePanel.style.display = 'none';
            var url = location.href;
            location.href = "#modalContent";
            history.replaceState(null, null, url);
        });

        back.addEventListener('click', () => {
            addPanel.style.display = 'none';
            removePanel.style.display = 'block';
            back.style.visibility = 'hidden';
            var url = location.href;
            location.href = "#modalContent";
            history.replaceState(null, null, url);
        });

        let close = this.document.getElementById('close');

        close.addEventListener('click', () => {
            dialog.close();
        });

        this.document.getElementById('editButton').style.display = 'inline';

        this.document.getElementById('editButton').addEventListener('click', () => {
            let dialog = window.document.getElementById('editModal');
            dialog.showModal();
        });

        let logout = this.document.getElementById('logoutButton');
        logout.style.display = 'block';
        logout.addEventListener("click", e => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.reload();
        });
        this.document.getElementById('loginButton').style.display = 'none';
    };

    const filterButtons = () => fetch("http://localhost:5678/api/categories", {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => {
            if (response.status == 200) {
                return response;
            } else {
                throw new Error(response.statusText);
            }
        })
        .then(response => response.json())
        .then(jsonArray => {

            if (jsonArray) {
                let gallery = this.document.getElementsByClassName("gallery")[0];
                let portfolio = this.document.getElementById("portfolio");
                let filterbuttons = document.createElement("div");
                filterbuttons.classList.add("filterbuttons");
                filterbuttons.id = "filter";
                let button = this.document.createElement("button");
                button.innerHTML = "Tous";
                button.classList.add("active");
                button.classList.add("btn");
                portfolio.insertBefore(filterbuttons, gallery);
                filterbuttons.append(button);
                button.addEventListener('click', () => setVisibility(button));
                for (const category of jsonArray) {
                    let button = this.document.createElement("button");
                    button.classList.add("btn");
                    button.addEventListener('click', () => setVisibility(button, category['id']));
                    button.innerHTML = category['name'];
                    filterbuttons.append(button);
                }

            }
            this.document.getElementById('editButton').style.display = 'none';
            let logout = this.document.getElementById('logoutButton');
            logout.style.display = 'none';
            this.document.getElementById('loginButton').style.display = 'block';

        });

    function deleteWork(event, id) {

        if (!window.confirm("Souhaitez-vous vraiment supprimer le travail ?")) {
            return;
        }

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;  charset=UTF-8',
        };
        if (localStorage.token) {
            headers['Authorization'] = 'Bearer ' + localStorage.token;
        }

        fetch("http://localhost:5678/api/works/" + id, {
            method: "DELETE",
            headers: headers
        })
            .then(response => {
                if (response.status == 204) {
                    return response;
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then(response => {
                let gallery = this.document.getElementsByClassName("gallery")[0];
                let figures = gallery.children;
                for (let i = 0; i < figures.length; i++) {
                    if (figures[i].id == id) {
                        figures[i].remove();
                    }
                }
                const parentNode = event.target.parentNode;
                parentNode.remove();

            })
            .catch(error => {
                this.alert(error);
            });

    }

    function addWork(event) {

        event.preventDefault();

        let headers = {
        };
        if (localStorage.token) {
            headers['Authorization'] = 'Bearer ' + localStorage.token;
        }

        var formData = new FormData(this);

        this.reset();
        const input = document.querySelector("#imageUpload");
        const preview = document.querySelector(".preview");
        updateImageDisplay(input, preview);

        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: headers,
            body: formData
        })
            .then(response => {
                if (response.status == 201) {
                    return response;
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then(response => response.json())
            .then(response => {

                let gallery = document.getElementsByClassName("gallery")[0];
                let galleryModal = document.getElementById('galleryModal');

                let figure = window.document.createElement("figure");
                let image = window.document.createElement("img");
                image.setAttribute("alt", response['title']);
                image.setAttribute("src", response['imageUrl']);
                let figcaption = window.document.createElement("figcaption");
                figcaption.innerHTML = response['title'];
                figure.setAttribute('categoryid', response['categoryId']);
                figure.setAttribute('id', response['id']);
                figure.append(image);
                figure.append(figcaption);
                gallery.append(figure);

                let thumbnail = window.document.createElement("div");
                thumbnail.classList.add('thumbnail');
                thumbnail.setAttribute('id', response['id']);
                let imageCpy = image.cloneNode(true);
                thumbnail.append(imageCpy);
                let trash = window.document.createElement('img');
                trash.setAttribute('src', "assets/images/trash.svg");
                trash.classList.add('trashcan');
                trash.addEventListener('click', (e) => deleteWork(e, response['id']));
                thumbnail.append(trash);
                galleryModal.append(thumbnail);
                let back = window.document.getElementById('back');
                back.click();

            })
            .catch(error => {
                alert(error);
            });

    }

    function setVisibility(button, id = 0) {
        var works = this.document.getElementById('portfolio').getElementsByTagName('figure');

        var buttons = this.document.getElementById('filter').children;
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');

        }
        button.classList.add('active');

        for (var figure of works) {
            if (id == 0 || figure.getAttribute('categoryid') == id) {
                figure.style.display = 'block';
            }
            else {
                figure.style.display = 'none'
            }
        }
    }

    function updateImageDisplay(input, preview) {

        while (preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }

        const curFiles = input.files;
        if (curFiles.length === 0) {
            let previous = document.getElementById('placeholderImage');
            previous.style.display = 'block';
        }

        for (const file of curFiles) {
            const para = document.createElement("p");
            if (validFileType(file)) {
                let previous = document.getElementById('placeholderImage');
                previous.style.display = 'none';

                para.textContent = `File name ${file.name}, file size ${returnFileSize(
                    file.size,
                )}.`;
                const image = document.createElement("img");
                image.src = URL.createObjectURL(file);
                image.alt = image.title = file.name;

                preview.appendChild(image);
                preview.appendChild(para);
            } else {
                para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
                preview.appendChild(para);
                let previous = document.getElementById('placeholderImage');
                previous.style.display = 'block';

            }
        }

    }

    const fileTypes = [
        "image/apng",
        "image/jpeg",
        "image/pjpeg",
        "image/png"
    ];

    function validFileType(file) {
        return fileTypes.includes(file.type);
    }

    function returnFileSize(number) {
        if (number < 1024) {
            return `${number} bytes`;
        } else if (number >= 1024 && number < 1048576) {
            return `${(number / 1024).toFixed(1)} KB`;
        } else if (number >= 1048576) {
            return `${(number / 1048576).toFixed(1)} MB`;
        }
    }

});