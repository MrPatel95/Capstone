// http://promincproductions.com/blog/cross-domain-ajax-request-cookies-cors/


//  This function logs in a new user
function checkLoginCredentials() {

    //  Login Information
    var loginUsername = document.getElementById('username_login').value;
    var loginPassword = document.getElementById('password_login').value;

    //  Preparing JSON request object
    var loginRequestData = {
        "username": loginUsername,
        "password": loginPassword
    }

    $.ajax({
        type: "POST",
        url: "https://infinite-reef-90129.herokuapp.com/loginUser",
        data: JSON.stringify(loginRequestData),
        datatype: "json",
        //xhrFields: {withCredentials: true},
        async: true,
        "Access-Control-Allow-Origin": "*",
        contentType: "application/json; charset=utf-8",
        success: function processData(r) {
            var myObj = JSON.parse(r);
            if (myObj["response"] == "pass") {
                //window.location = "forum.html";
                console.log(r);

            } else {
                alert("User is not authenticated");
            }
        }
    });
}

//  This function will register new users
function registerNewUser() {

    //  Register Information
    var registerUsername = document.getElementById('register_username').value;
    var registerEmail = document.getElementById('register_email').value;
    var registerPassword = document.getElementById('register_password').value;

    var registerNewUserRequestData = {
        "username": registerUsername,
        "password": registerPassword,
        "email": registerEmail
    }

    if (window.XMLHttpRequest) {
        // code for modern browsers
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for old IE browsers
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xmlhttp.open("POST", "https://infinite-reef-90129.herokuapp.com/registerUser", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    //xmlhttp.setRequestHeader("Access-Control-Allow-Origin","*");
    xmlhttp.send(JSON.stringify(registerNewUserRequestData));

}

//  This function will add is-invalid to the division
function turnFieldToRedColorBorder(elementName) {
    elementName.classList.add("is-invalid");
}

//  This function is called when the Forum page is fully loaded
function onLoadFunctionForForumPosts() {

    //  Preparing JSON request object
    // var loadNPosts = {
    //     "n": 50
    // }
    //
    // $.ajax({
    //     type: "POST",
    //     url: "https://infinite-reef-90129.herokuapp.com/getNRecentForumPosts",
    //     data: JSON.stringify(loadNPosts),
    //     datatype: "json",
    //     xhrFields: {withCredentials: true},
    //     async: true,
    //     contentType: "application/json; charset=utf-8",
    //     success: function processData(r) {
    //         alert(r);
    //     }
    // });
}

//  This function is called when the user clicks logout button
function onClickOfLogout(){
    if (window.XMLHttpRequest) {
        // code for modern browsers
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for old IE browsers
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText)
            var myObj = JSON.parse(this.responseText);

            if (myObj["response"] == "pass") {
                window.location = "loginRegister.html";
            } else {
                console.log("Logout error");
            }


        }
    };
    xmlhttp.open("POST", "https://infinite-reef-90129.herokuapp.com/logoutUser", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send();
}



[
    {
        "post_id": 1,
        "user__username": "ali",
        "post_title": "There will be an event tomorrow",
        "post_image": "",
        "post_datetime": "2018-02-22T22:22:22.350197+00:00",
        "connect_count": 3,
        "reply_count": 7
    },
    {
        "post_id": 2,
        "user__username": "ali",
        "post_title": "my second forum post",
        "post_image": "",
        "post_datetime": "2018-02-22T22:56:36.772572+00:00",
        "connect_count": 3,
        "reply_count": 1
    },
    {
        "post_id": 3,
        "user__username":"ali",
        "post_title": "Who hates the capstone class?",
        "post_image": "",
        "post_datetime": "2018-02-24T19:10:09.980698+00:00",
        "connect_count": 0,
        "reply_count": 0
    }
]
