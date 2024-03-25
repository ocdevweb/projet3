window.addEventListener("load", function () {

    var works = this.document.getElementsByTagName('figure');
    console.log(works);
    [...works].map((e) => e.remove());

    function setVisibility(id) {
        var works = this.document.getElementsByTagName('figure');
        console.log('id: ', id);

        for( var figure of works){
            console.log('figure: ', figure);
            console.log("figure['categoryid']", figure.getAttribute('categoryid'));
            if (id==0 || figure.getAttribute('categoryid')==id){
                figure.style.display = 'block';
            }
            else{
                figure.style.display = 'none'
            }
        }
    }

    fetch("http://localhost:5678/api/works", {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response.json())
        .then((jsonArray) => {
            
            console.log(jsonArray);
            if (jsonArray) {
                var categories = new Map();
                let gallery = this.document.getElementsByClassName("gallery")[0];
                for(const doc of jsonArray){
                    categories.set(doc['category']['id'],  doc['category']['name']);
                    console.log(doc);
                    let figure = this.document.createElement("figure");
                    let image = this.document.createElement("img");
                    image.setAttribute("alt", doc['title']);
                    image.setAttribute("src", doc['imageUrl']);
                    let figcaption = document.createElement("figcaption");
                    figcaption.innerHTML = doc['title'];
                    figure.setAttribute('categoryid', doc['category']['id']);
                    figure.append(image);
                    figure.append(figcaption);
                    gallery.append(figure);
                }

                if (categories.size >0) {
                    let portfolio = this.document.getElementById("portfolio");
                    let filterbuttons = document.createElement("div");
                    filterbuttons.classList.add("filterbuttons"); 
                    let button = this.document.createElement("button");
                    button.innerHTML = "Tous";
                    button.classList.add("active");
                    button.classList.add("btn");
                    portfolio.insertBefore(filterbuttons, gallery);
                    filterbuttons.append(button);
                    button.addEventListener('click', () => setVisibility(0));
                    for(const  [id, name] of categories){
                        console.log(name);
                        console.log(id);
                        let button = this.document.createElement("button");
                        button.classList.add("btn");
                        button.addEventListener('click', () => setVisibility(id));
                        button.innerHTML = name;
                        filterbuttons.append(button);
                    }
                }
            } else {
            };
        });

});