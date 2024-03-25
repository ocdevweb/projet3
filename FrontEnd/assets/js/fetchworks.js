window.addEventListener("load", function () {

    var works = this.document.getElementsByTagName('figure');
    console.log(works);
    [...works].map((e) => e.remove());


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
                var categories = new Set();
                let gallery = this.document.getElementsByClassName("gallery")[0];
                for(const doc of jsonArray){
                    categories.add(doc['category']['name']);
                    console.log(doc);
                    let figure = this.document.createElement("figure");
                    let image = this.document.createElement("img");
                    image.setAttribute("alt", doc['title']);
                    image.setAttribute("src", doc['imageUrl']);
                    let figcaption = document.createElement("figcaption");
                    figcaption.innerHTML = doc['title'];
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
                    portfolio.insertBefore(filterbuttons, gallery);
                    filterbuttons.append(button);
                    for(const category of categories){
                        console.log(category);
                        let button = this.document.createElement("button");
                        button.innerHTML = category;
                        filterbuttons.append(button);
                    }
                }


            } else {
            };
        });

});