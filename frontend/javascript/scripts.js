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

    var cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = "";

    for (i = 0; i < posts.length; i++){
        var card = document.createElement("div");
        card.classList.add("row");
        card.classList.add("custom-card");
        cardsContainer.appendChild(card);

        var cardColumn = document.createElement("div");
        cardColumn.classList.add("col");
        cardColumn.classList.add("card-padding");
        card.appendChild(cardColumn);

        var thumbnailRow = document.createElement("div");
        thumbnailRow.classList.add("row");
        cardColumn.appendChild(thumbnailRow);

        var thumbnail = document.createElement("div");
        thumbnail.classList.add("col-2");
        thumbnail.classList.add("col-md-1");
        thumbnail.classList.add("col-lg-1");
        thumbnailRow.appendChild(thumbnail);

        var thumbnailTag = document.createElement("img");
        thumbnailTag.classList.add("thumbnail");
        thumbnailTag.setAttribute("src", posts[i].post_image);
        thumbnailTag.setAttribute("alt", "IMG");
        thumbnail.appendChild(thumbnailTag);

        var titleTime = document.createElement("div");
        titleTime.classList.add("col-10");
        titleTime.classList.add("col-md-11");
        titleTime.classList.add("col-lg-11");
        thumbnailRow.appendChild(titleTime);

        var titleRow = document.createElement("div");
        titleRow.classList.add("row");
        titleTime.appendChild(titleRow);

        var title = document.createElement("div");
        title.classList.add("col-10");
        title.classList.add("post-title");
        var titleText = document.createTextNode(posts[i].post_title);
        title.appendChild(titleText);
        titleRow.appendChild(title);

        var timeUsername = document.createElement("div");
        timeUsername.classList.add("col-12");
        timeUsername.classList.add("time-username");
        var timeUser = document.createTextNode(posts[i].post_datetime + " by " + posts[i].user__username);
        timeUsername.appendChild(timeUser);
        titleRow.appendChild(timeUsername);

        var conRepDes = document.createElement("div");
        conRepDes.classList.add("row");
        cardColumn.appendChild(conRepDes);

        var desColumn = document.createElement("div");
        desColumn.classList.add("col-12");
        desColumn.classList.add("col-md-1");
        desColumn.classList.add("col-lg-1");
        conRepDes.appendChild(desColumn);

        var contentReply = document.createElement("div");
        contentReply.classList.add("row");
        contentReply.classList.add("reply-connect");
        desColumn.appendChild(contentReply);

        var connect = document.createElement("div");
        connect.classList.add("col-6");
        connect.classList.add("col-sm-12", "col-md-12", "col-lg-12", "icon_count");
        contentReply.appendChild(connect);

        var connectIconLink = document.createElement("a");
        connectIconLink.setAttribute("onclick", "testAlert()");
        connect.appendChild(connectIconLink);

        var connectIcon = document.createElement("i");
        connectIcon.classList.add("material-icons", "connect-icon");
        connectIconLink.appendChild(connectIcon);
        var icon = document.createTextNode("compare_arrows");
        connectIcon.appendChild(icon);

        var connectCount = document.createTextNode(posts[i].connect_count);
        connect.appendChild(connectCount);

        //REPLY COUNT AND ICON
        var reply = document.createElement("div");
        reply.classList.add("col-6", "col-sm-12", "col-md-12", "col-lg-12", "reply_count");
        contentReply.appendChild(reply);

        var replyIconLink = document.createElement("a");
        replyIconLink.setAttribute("onclick", "testAlert()");
        reply.appendChild(replyIconLink);

        var replyIcon = document.createElement("i");
        replyIcon.classList.add("material-icons", "reply-icon");
        replyIconLink.appendChild(replyIcon);
        var icon2 = document.createTextNode("reply");
        replyIcon.appendChild(icon2);

        var replyCount = document.createTextNode(posts[i].reply_count);
        reply.appendChild(replyCount);

        var description = document.createElement("div");
        description.classList.add("col-12", "col-sm-10", "col-md-11", "col-lg-11", "description");
        conRepDes.appendChild(description);

        var postBody = document.createTextNode(posts[i].post_body);
        description.appendChild(postBody);




















    }

}
