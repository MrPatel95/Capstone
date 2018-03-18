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

//  Create Date variable
function createDate(todaysDate, postDate){

    var newPostDate = new Date(postDate);
    var diff = todaysDate - newPostDate;
    var time = "";

    if(diff < 5999){
        time = "Just now";
        return time;
    }else{
        var seconds = diff/1000;
        if(seconds < 60){
            return Math.floor(seconds) + " seconds ago";
        }else{
            var mins = seconds/60;
            if(mins<60){
                if(mins < 2){
                    return Math.floor(mins) + " minute ago";
                }
                return Math.floor(mins) + " minutes ago";
            }else{
                var hours = mins/60;
                if(hours < 25){
                    if(hours < 2){
                        return Math.floor(hours) + " hour ago";
                    }
                    return Math.floor(hours) + " hours ago";
                }else{
                    var days = hours/24;
                    if(days < 366){
                        if(days < 2){
                            return Math.floor(days) + " day ago";
                        }
                        return Math.floor(days) + " days ago"
                    }else{
                        var year = days/365;
                        if(year < 2){
                            return Math.floor(year) + " year ago";
                        }
                        return Math.floor(year) + " years ago";
                    }
                }
            }
        }
    }

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

    $(document).ready(function(){
        $('#page-body').ajaxStart(function() {
            alert("AJAX sent");
            $('#posts-loading').show();
        }).ajaxStop(function() {
            $('#posts-loading').hide();
        });
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

    var  todaysDate = new Date();

    // var  todaysDate1 = new Date("2018-03-17T23:04:13.781205+00:00");
    // alert(todaysDate - todaysDate1);

    for (i = 0; i < posts.length; i++){


        // call function to create the post time variable
        var time = createDate(todaysDate, posts[i].post_datetime);
        postImage = "";

        if(posts[i].post_image === ""){
            postImage = "../assets/batman.jpg";
        }else{
            postImage = posts[i].post_image;
        }


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
        thumbnailTag.setAttribute("src", postImage);
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
        title.classList.add("col-12");
        title.classList.add("post-title");
        var titleText = document.createTextNode(posts[i].post_title);
        title.appendChild(titleText);
        titleRow.appendChild(title);

        var timeUsername = document.createElement("div");
        timeUsername.classList.add("col-12");
        timeUsername.classList.add("time-username");
        var timeUser = document.createTextNode(time + " by " + posts[i].user__username);
        timeUsername.appendChild(timeUser);
        titleRow.appendChild(timeUsername);

        var conRepDes = document.createElement("div");
        conRepDes.classList.add("row");
        cardColumn.appendChild(conRepDes);

        var conReplyColumn = document.createElement("div");
        conReplyColumn.classList.add("col-12");
        conReplyColumn.classList.add("col-md-1");
        conReplyColumn.classList.add("col-lg-1");
        conRepDes.appendChild(conReplyColumn);

        //  Row for Connect and Reply
        var contentReply = document.createElement("div");
        contentReply.classList.add("row");
        contentReply.classList.add("reply-connect");
        conReplyColumn.appendChild(contentReply);

        //  Column for Connect
        var connect = document.createElement("div");
        connect.classList.add("col-6");
        connect.classList.add("col-sm-12", "col-md-12", "col-lg-12", "icon_count");
        contentReply.appendChild(connect);

        var buttonForConnect = document.createElement("button");
        buttonForConnect.classList.add("mdl-button", "mdl-js-button", "mdl-button--icon", "mdl-button--colored", "buttonForConnect");
        connect.appendChild(buttonForConnect);

        var connectIcon = document.createElement("i");
        connectIcon.classList.add("material-icons", "connect-icon");
        buttonForConnect.appendChild(connectIcon);
        var icon = document.createTextNode("compare_arrows");
        connectIcon.appendChild(icon);

        var spanForConnectCount = document.createElement("span");
        spanForConnectCount.classList.add("connectCountSpan");
        connect.appendChild(spanForConnectCount);

        var connectCount = document.createTextNode(posts[i].connect_count);
        spanForConnectCount.appendChild(connectCount);


        //  Column for Reply
        var reply = document.createElement("div");
        reply.classList.add("col-6", "col-sm-12", "col-md-12", "col-lg-12", "reply_count");
        contentReply.appendChild(reply);


        var buttonForReply = document.createElement("button");
        buttonForReply.classList.add("mdl-button", "mdl-js-button", "mdl-button--icon", "mdl-button--colored", "mdl-button--colored", "buttonForReply");
        reply.appendChild(buttonForReply);

        var replyIcon = document.createElement("i");
        replyIcon.classList.add("material-icons", "reply-icon");
        buttonForReply.appendChild(replyIcon);

        var replyIconText = document.createTextNode("reply");
        replyIcon.appendChild(replyIconText);

        var spanForReplyCount = document.createElement("span");
        spanForReplyCount.classList.add("replyCountSpan");
        reply.appendChild(spanForReplyCount);

        var replyCount = document.createTextNode(posts[i].reply_count);
        spanForReplyCount.appendChild(replyCount);

        //  Description column
        var description = document.createElement("div");
        description.classList.add("col-12", "col-sm-10", "col-md-11", "col-lg-11", "description");
        conRepDes.appendChild(description);

        var postBody = document.createTextNode(posts[i].post_body);
        description.appendChild(postBody);



    }

}
