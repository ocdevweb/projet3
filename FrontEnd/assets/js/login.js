window.addEventListener("load", function () {

    var form = this.document.getElementById('loginForm');

    form.addEventListener('submit', (e) => {

        e.preventDefault();

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        var data = {
            email: email,
            password: password
        };

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.status == 200) {
                    return response;
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then(response => response.json())
            .then(json => {

                this.localStorage.setItem('token', json.token);
                window.location.replace("index.html");
            })
            .catch(error => {
                this.alert(error);
            });

    });


});