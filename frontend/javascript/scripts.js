// http://promincproductions.com/blog/cross-domain-ajax-request-cookies-cors/

function testAlert(){
    alert("liked");
}

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
        xhrFields: {withCredentials: true},
        async: true,
        //"Access-Control-Allow-Origin": "*",
        contentType: "application/json; charset=utf-8",
        success: function processData(r) {
            var myObj = JSON.parse(r);
            if (myObj["response"] == "pass") {
                window.location = "forum.html";
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

    //Preparing JSON request object
    var loadNPosts = {
        "n": 50
    }

    $.ajax({
        type: "POST",
        url: "https://infinite-reef-90129.herokuapp.com/getNRecentForumPosts",
        data: JSON.stringify(loadNPosts),
        datatype: "json",
        xhrFields: {withCredentials: true},
        async: true,
        contentType: "application/json",
        success: function processData(r) {
            var json_data = JSON.parse(r);
            generatePostCards(json_data);
        }
    });

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

// This function creates post cards
function generatePostCards(posts){

    for (i = 0; i < posts.length; i++){
        generatePostData(posts[i]);
    }
}

// This function enters data in posts
function generatePostData(post_data){

    var sample = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim, impedit beatae, est reiciendis expedita deserunt id in odio quam laudantium veritatis excepturi distinctio voluptates eos sit, placeat laboriosam nam porro!';
    var post_append = document.getElementById('main-holder');

    var mainDiv = document.createElement('div');
    mainDiv.classList.add("row");

    //ROW1- Image and Title
    var row1 = document.createElement('div');
    row1.classList.add("row");
    mainDiv.appendChild(row1);

    var row1_col1 = document.createElement('div');
    row1_col1.classList.add("col-sm-2");
    row1.appendChild(row1_col1);

    var row1_col2 = document.createElement('div');
    row1_col2.classList.add("col-sm-10");
    row1.appendChild(row1_col2);

    //ROW2- Post Description
    var row2 = document.createElement('div');
    row2.classList.add("row");
    mainDiv.appendChild(row2);

    var row2_col1 = document.createElement('div');
    row2_col1.classList.add("col-sm-2");
    row2.appendChild(row2_col1);

    var row2_col2 = document.createElement('div');
    row2_col2.classList.add("col-sm-10");
    row2.appendChild(row2_col2);

    //ROW3- Connects, Replies, Time, Name
    var row3 = document.createElement('div');
    row3.classList.add("row");
    mainDiv.appendChild(row3);

    var row3_col1 = document.createElement('div');
    row3_col1.classList.add("col-sm-3");
    row3.appendChild(row3_col1);

    var row3_col2 = document.createElement('div');
    row3_col2.classList.add("col-sm-3");
    row3.appendChild(row3_col2);

    var row3_col3 = document.createElement('div');
    row3_col3.classList.add("col-sm-3");
    row3.appendChild(row3_col3);

    var row3_col4 = document.createElement('div');
    row3_col4.classList.add("col-sm-3");
    row3.appendChild(row3_col4);

    //Post data appending on rows and columns

    var post_title = document.createTextNode(post_data['post_title']);
    row1_col2.appendChild(post_title);

    var sample_data = document.createTextNode(sample);
    row2_col2.appendChild(sample_data);

    var connect_count = document.createTextNode(post_data['connect_count']);
    row3_col1.appendChild(connects);

    var reply_count = document.createTextNode(post_data['reply_count']);
    row3_col2.appendChild(reply_count);

    var post_date = document.createTextNode(post_data['post_datetime']);
    row3_col3.appendChild(post_date);

    var username = document.createTextNode(post_data['user__username']);
    row3_col4.appendChild(username);

    post_append.appendChild(mainDiv);

}
