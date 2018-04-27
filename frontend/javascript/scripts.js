// http://promincproductions.com/blog/cross-domain-ajax-request-cookies-cors/

//  This function is called on  blur of any input field
function onBlurFormValidation(id) {

    var textField = document.getElementById(id);

    if (textField.value != "") {
        textField.style.borderColor = '#CED4DA';
    } else {
        textField.style.borderColor = 'red';
    }
}

// This function checks valid UCID
function ucidCheck(input) {

    var letters = /[^0-9a-z]/gi;
    input.value = input.value.replace(letters, "");
}

//  This function logs in a new user
function checkLoginCredentials() {

    //  Login Information
    var loginUsername = document.getElementById('username_login').value.trim();
    var loginPassword = document.getElementById('password_login').value.trim();

    //  Login Form validation
    var loginFormValidationResult = loginFormValidation();

    if (loginFormValidationResult == true) {
        $(".loginButtonModalClass").html("Confirming your existence...");

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
            xhrFields: {
                withCredentials: true
            },
            async: true,
            //"Access-Control-Allow-Origin": "*",
            contentType: "application/json; charset=utf-8",
            success: function processData(r) {
                var myObj = JSON.parse(r);
                if (myObj["response"] == "pass") {

                    localStorage.setItem("username", loginUsername);

                    $(".loginButtonModalClass").html("Legit User!");

                    window.location = "forum.html";
                    console.log(r);

                } else {

                    var invalidUserSection = document.getElementById("invalidUserSectionId");
                    invalidUserSection.style.display = "block";

                    $(".loginButtonModalClass").html("Login");

                }
            }
        });
    }

}

//  Login Form Validation 
function loginFormValidation() {

    //  Login Information
    var user = document.getElementById('username_login');
    var pass = document.getElementById('password_login');

    if (user.value.trim() == "" && pass.value.trim() == "") {
        user.style.borderColor = 'red';
        pass.style.borderColor = 'red';
    } else if (user.value.trim() == "") {
        user.style.borderColor = 'red';
    } else if (pass.value.trim() == "") {
        pass.style.borderColor = 'red';
    } else {
        return true;
    }

}

//  This will submit the login form on enter key press event 
function loginSubmitButtonEvent(e) {
    if (e.keyCode == 13) {
        checkLoginCredentials();
    }
}

//  This will submit the login form on enter key press event 
function registerSubmitButtonEvent(e) {
    if (e.keyCode == 13) {
        registerNewUser();
    }
}

//  Register Form validation function
function registerFormValidation() {

    //  Login Information
    var user = document.getElementById('register_username');
    var email = document.getElementById('register_email');
    var pass = document.getElementById('register_password');
    var repass = document.getElementById('register_re_password');

    if (email.value.trim() == "" || user.value.trim() == "" || pass.value.trim() == "" || repass.value.trim() == "") {
        if (email.value.trim() == "") {
            email.style.borderColor = 'red';
        }
        if (user.value.trim() == "") {
            user.style.borderColor = 'red';
        }
        if (pass.value.trim() == "") {
            pass.style.borderColor = 'red';
        }
        if (repass.value.trim() == "") {
            repass.style.borderColor = 'red';
        }
    } else {
        return true;
    }

}

//  This function will register new users
function registerNewUser() {

    //  Register Information
    var registerUsername = document.getElementById('register_username').value.trim();
    var registerEmail = document.getElementById('register_email').value.trim();
    var registerPassword = document.getElementById('register_password').value.trim();
    var registerRepass = document.getElementById('register_re_password').value.trim();
    var invalidRegister = document.getElementById('invalidRegister');

    var registerEmail = registerEmail + "@njit.edu";

    var registerFormValidationResult = registerFormValidation();


    if (registerFormValidationResult == true) {

        if (registerPassword == registerRepass) {

            document.getElementById("invalidRegister").style.display = "none";

            var registerNewUserRequestData = {
                "username": registerUsername,
                "password": registerPassword,
                "email": registerEmail
            }

            //  Creating HTTP object
            if (window.XMLHttpRequest) {
                // code for modern browsers
                xmlhttp = new XMLHttpRequest();
            } else {
                // code for old IE browsers
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            //  Preparing and send request
            xmlhttp.open("POST", "https://infinite-reef-90129.herokuapp.com/registerUser", true);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            //xmlhttp.setRequestHeader("Access-Control-Allow-Origin","*");
            xmlhttp.send(JSON.stringify(registerNewUserRequestData));

            //  Checking for response
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    var result = JSON.parse(this.responseText);
                    if (result.response == "pass") {
                        document.getElementById("registerResponseHolder").style.display = "block";
                        document.getElementById("registerResponseHolder").style.color = "#27ae60";
                        $('#registerResponseId').text("Confirmation email has been sent to " + registerEmail);
                    } else if (result.response == "email in use") {
                        document.getElementById("registerResponseHolder").style.display = "block";
                        document.getElementById("registerResponseHolder").style.color = "#E14938";
                        $('#registerResponseId').text("Email already in use. Please log in.");
                    } else if (result.response == "username in use") {
                        document.getElementById("registerResponseHolder").style.display = "block";
                        document.getElementById("registerResponseHolder").style.color = "#E14938";
                        $('#registerResponseId').text("Username in use. Try another username.");
                    }
                }
            };

        } else {
            var invalidRegister = document.getElementById("invalidRegister");
            invalidRegister.style.display = "block";
        }
    }
}

//  This function will add is-invalid to the division
function turnFieldToRedColorBorder(elementName) {
    elementName.classList.add("is-invalid");
}

//  Create Date variable
function createDate(todaysDate, postDate) {

    var newPostDate = new Date(postDate);
    var diff = todaysDate - newPostDate;
    var time = "";

    if (diff < 5999) {
        time = "Just now";
        return time;
    } else {
        var seconds = diff / 1000;
        if (seconds < 60) {
            return Math.floor(seconds) + " seconds ago";
        } else {
            var mins = seconds / 60;
            if (mins < 60) {
                if (mins < 2) {
                    return Math.floor(mins) + " minute ago";
                }
                return Math.floor(mins) + " minutes ago";
            } else {
                var hours = mins / 60;
                if (hours < 25) {
                    if (hours < 2) {
                        return Math.floor(hours) + " hour ago";
                    }
                    return Math.floor(hours) + " hours ago";
                } else {
                    var days = hours / 24;
                    if (days < 366) {
                        if (days < 2) {
                            return Math.floor(days) + " day ago";
                        }
                        return Math.floor(days) + " days ago"
                    } else {
                        var year = days / 365;
                        if (year < 2) {
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
    // alert();
    if (localStorage.getItem("username") === null) {
        window.location.replace("../html/loginRegister.html");
    } else {
        $("#usernameDropdown").html(localStorage.username);

        var loadNPosts = {
            "n": 50
        }

        $.ajax({
            type: "POST",
            url: "https://infinite-reef-90129.herokuapp.com/getNRecentForumPosts",
            data: JSON.stringify(loadNPosts),
            datatype: "json",
            xhrFields: {
                withCredentials: true
            },
            async: true,
            contentType: "application/json",
            success: function processData(r) {
                var json_data = JSON.parse(r);
                var postType = "displayAllPosts";
                //alert(JSON.stringify(json_data));
                generatePostCards(json_data, postType);
            }
        });

        $(document).ready(function () {
            $('#page-body').ajaxStart(function () {
                alert("AJAX sent");
                $('#posts-loading').show();
            }).ajaxStop(function () {
                $('#posts-loading').hide();
            });
        });
    }



}

//  This function is called when the user clicks logout button
function onClickOfLogout() {
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
                localStorage.clear();
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
function generatePostCards(posts, postType) {


    var cardsContainer = document.getElementById("cards-container");

    if (postType == "displayAllPosts") {
        cardsContainer.innerHTML = "";
    }


    var todaysDate = new Date();

    for (i = 0; i < posts.length; i++) {


        // call function to create the post time variable
        var time = createDate(todaysDate, posts[i].post_datetime);
        postImage = "";

        if (posts[i].post_image === "") {
            postImage = "../assets/batman.jpg";
        } else {
            postImage = posts[i].post_image;
        }


        var card = document.createElement("div");
        card.classList.add("row");
        card.classList.add("custom-card");
        cardsContainer.appendChild(card);

        // Check if post is a new post or displayAllPosts
        if (postType == "displayAllPosts") {
            cardsContainer.appendChild(card);
        } else if (postType == "addNewPost") {
            cardsContainer.insertBefore(card, cardsContainer.childNodes[0]);
        }


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
        title.classList.add("col-12", "post-title");

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
        conRepDes.setAttribute("id", "conRepDes" + posts[i].post_id);
        cardColumn.appendChild(conRepDes);

        //  Description column
        var description = document.createElement("div");
        description.classList.add("col-12", "col-sm-10", "col-md-11", "col-lg-11", "description");
        description.classList.add("offset-sm-1", "offset-md-1", "offset-lg-1");
        conRepDes.appendChild(description);

        if ((posts[i].post_body).length > 399) {
            var postBody = document.createTextNode((posts[i].post_body).substring(0, 399) + "........");
            description.appendChild(postBody);
        } else {
            var postBody = document.createTextNode((posts[i].post_body));
            description.appendChild(postBody);
        }

        //  Expand post
        var replyRow = document.createElement("div");
        replyRow.classList.add("row");
        replyRow.setAttribute("style", "transition: max-height 0.15s ease-out");
        replyRow.style.display = "none";
        replyRow.setAttribute("id", "replyRow" + posts[i].post_id);
        cardColumn.appendChild(replyRow);

        //  Row for Connect and Reply
        var contentReply = document.createElement("div");
        contentReply.classList.add("row");
        contentReply.classList.add("reply-connect");
        cardColumn.appendChild(contentReply);

        //  Column for Connect
        var connect = document.createElement("div");
        connect.classList.add("col-6", "col-sm-2", "col-md-2", "col-lg-2", "icon_count");
        connect.classList.add("offset-sm-1", "offset-md-1", "offset-lg-1");
        contentReply.appendChild(connect);

        var connectIncrementLabel = "post";

        var buttonForConnect = document.createElement("button");
        buttonForConnect.classList.add("button", "btn", "btn-primary", "buttonForConnect");
        buttonForConnect.setAttribute("id", "postConnectButton" + posts[i].post_id);
        buttonForConnect.setAttribute("value", "connect");
        buttonForConnect.setAttribute("onclick", "connectIncrement(" + posts[i].post_id + ", '" + connectIncrementLabel + "', '" + posts[i].connected + "')");
        connect.appendChild(buttonForConnect);


        if (posts[i].connected == 1) {
            buttonForConnect.setAttribute("style", "background-color:#e0e0e0");
        }

        var connectIcon = document.createElement("div");
        connectIcon.classList.add("material-icons", "connect-icon");
        connectIcon.setAttribute("id", "connectIcon");
        buttonForConnect.appendChild(connectIcon);

        var icon = document.createTextNode("compare_arrows");
        connectIcon.appendChild(icon);

        var connectToolTip = document.createElement("div");
        connectToolTip.classList.add("mdl-tooltip");
        connectToolTip.setAttribute("data-mdl-for", posts[i].post_id);
        connect.appendChild(connectToolTip);

        var connectToolTipText = document.createTextNode("Connect");
        connectToolTip.appendChild(connectToolTipText);

        var postConnectButtonSpan = document.createElement("span");
        postConnectButtonSpan.setAttribute("id", "postConnectButtonSpan" + posts[i].post_id);
        buttonForConnect.appendChild(postConnectButtonSpan);

        if (posts[i].connect_count > 1) {
            var connectsText = document.createTextNode(posts[i].connect_count + " Connects");
            postConnectButtonSpan.appendChild(connectsText);
        } else if (posts[i].connect_count <= 1) {
            var connectsText = document.createTextNode(posts[i].connect_count + " Connect");
            postConnectButtonSpan.appendChild(connectsText);
        }


        //  Column for Reply
        var reply = document.createElement("div");
        reply.classList.add("col-6", "col-sm-2", "col-md-2", "col-lg-2", "reply_count");
        contentReply.appendChild(reply);

        var replyButtonId = "replyToPostButton" + posts[i].post_id;

        var buttonForReply = document.createElement("button");
        buttonForReply.classList.add("button", "btn", "btn-primary", "buttonForReply");
        buttonForReply.setAttribute("id", replyButtonId);
        buttonForReply.setAttribute("onclick", "replyToPostFun(" + posts[i].post_id + ")");
        reply.appendChild(buttonForReply);

        var replyIcon = document.createElement("div");
        replyIcon.classList.add("material-icons", "reply-icon");
        connectIcon.setAttribute("id", "replyIcon");
        buttonForReply.appendChild(replyIcon);

        var icon2 = document.createTextNode("reply");
        replyIcon.appendChild(icon2);

        if (posts[i].reply_count > 1) {
            var replyText = document.createTextNode(posts[i].reply_count + " Replies");
            buttonForReply.appendChild(replyText);
        } else if (posts[i].reply_count <= 1) {
            var replyText = document.createTextNode(posts[i].reply_count + " Reply");
            buttonForReply.appendChild(replyText);
        }

        //  New reply to a post when not expanded
        var addReplyRow = document.createElement("div");
        addReplyRow.classList.add("row");
        addReplyRow.setAttribute("style", "transition: max-height 0.15s ease-out");
        addReplyRow.style.display = "none";
        addReplyRow.setAttribute("id", "addReplyRow" + posts[i].post_id);
        cardColumn.appendChild(addReplyRow);

        //Button for expanding the post's ROW
        var postExpandRow = document.createElement("div");
        postExpandRow.classList.add("row");
        postExpandRow.setAttribute("style", "display: block");
        cardColumn.appendChild(postExpandRow);

        var postExpandCol = document.createElement("div");
        postExpandCol.classList.add("offset-11", "offset-sm-11", "offset-md-11", "offset-lg-11");
        postExpandCol.classList.add("col-1", "col-sm-1", "col-md-1", "col-lg-1", "postExpandCol");
        postExpandRow.appendChild(postExpandCol);

        //  button to hold the image
        var downButton = document.createElement("button");
        downButton.classList.add("downButton");
        downButton.setAttribute("onclick", "onClickOfShowPost(" + posts[i].post_id + ")");
        downButton.setAttribute("id", "button" + posts[i].post_id);
        postExpandCol.appendChild(downButton);

        //  Down image
        var showMore = document.createElement("img");
        showMore.classList.add("showMore");
        showMore.setAttribute("src", "../assets/down-arrow.svg");
        showMore.setAttribute("id", "buttonImg" + posts[i].post_id);
        showMore.setAttribute("alt", "show more");
        downButton.appendChild(showMore);
    }

}

// This function adds a new post_title
function addNewPost() {

    //alert("addNewPost called");

    //  Login Information
    var newPostTitle = document.getElementById('newPostTitle').value;
    var newPostDesc = document.getElementById('newPostDesc').value;
    var newImageURL = document.getElementById('newImageURL').value;

    var validate = false;
    if (newPostTitle != "" && newPostDesc != "") {
        validate = true;
    }

    if (validate) {
        var newPost = {
            "post_title": newPostTitle,
            "post_body": newPostDesc,
            "post_image": newImageURL,
        }

        $.ajax({
            type: "POST",
            url: "https://infinite-reef-90129.herokuapp.com/addForumPost",
            data: JSON.stringify(newPost),
            datatype: "json",
            xhrFields: {
                withCredentials: true
            },
            async: true,
            //"Access-Control-Allow-Origin": "*",
            contentType: "application/json; charset=utf-8",
            success: function processData(r) {
                var myObj = JSON.parse(r);
                if (myObj["post_id"] != null) {

                    document.getElementById('newPostTitle').value = "";
                    document.getElementById('newPostDesc').value = "";
                    document.getElementById('newImageURL').value = "";


                    $('#exampleModalCenter').modal('hide');

                    snackBar();

                    var todaysDate = new Date();
                    var postData = [
                        {
                            "post_id": myObj["post_id"],
                            "user__username": localStorage.username,
                            "post_title": myObj["post_title"],
                            "post_body": myObj["post_body"],
                            "post_datetime": todaysDate,
                            "post_image": myObj["post_image"],
                            "connect_count": myObj["connect_count"],
                            "reply_count": 0,
                            "connected": false
                        }
                    ];

                    var postType = "addNewPost";
                    generatePostCards(postData, postType);




                } else {
                    alert("User is not authenticated");

                }
            }
        });
    } else {
        alert("Post title and post body cannot be empty");
    }
    //  Preparing JSON request object

}


function snackBar() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}


// This function will add a new post on the top of the displayed posts when a new post is added
function addNewPostOnTop(newPostTitle, newPostDesc, newImageURL) {

}

//  This function is called when show Post/Replies is clicked
function onClickOfShowPost(post_id) {

    var rowId = "replyRow" + post_id;
    var buttonId = "button" + post_id;
    var icon = "buttonImg" + post_id;
    var conRepDes = "conRepDes" + post_id;

    var buttonIcon = document.getElementById(icon);
    var replyRow = document.getElementById(rowId);
    var crdRow = document.getElementById(conRepDes);
    var addReplyRow = document.getElementById("addReplyRow" + post_id);

    if (replyRow.style.display === "none") {
        buttonIcon.setAttribute("src", "../assets/up-arrow.svg");
        addReplyRow.style.display = "none";
        replyRow.style.display = "block";
        crdRow.style.display = "none";

        //Preparing JSON request object
        var loadPostAndReplies = {
            "post_id": post_id
        };

        $.ajax({
            type: "POST",
            url: "https://infinite-reef-90129.herokuapp.com/getPostAndRepliesByPostId",
            data: JSON.stringify(loadPostAndReplies),
            datatype: "json",
            xhrFields: {
                withCredentials: true
            },
            async: true,
            contentType: "application/json",
            success: function processData(r) {
                showReplies(r, rowId);

            }
        });
    } else if (replyRow.style.display === "block") {
        addReplyRow.innerHTML = "";
        replyRow.style.display = "none";
        buttonIcon.setAttribute("src", "../assets/down-arrow.svg");
        crdRow.style.display = "block";
    }

}

//  This function will show all the replies WHEN EXPANDED
function showReplies(allReplies, rowId) {

    var rowReply = document.getElementById(rowId);
    rowReply.innerHTML = "";

    var obj = JSON.parse(allReplies);

    // var text = document.createTextNode("Test");
    // rowReply.appendChild(text);

    //alert(obj.post.post_image);

    if (obj.post.post_image != "") {

        //  Column for Image
        var imageColumn = document.createElement("div");
        imageColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
        imageColumn.setAttribute("id", "imageColumn");
        rowReply.appendChild(imageColumn);

        var postImage = document.createElement("img");
        postImage.classList.add("postImage");
        postImage.setAttribute("id", "postImage");
        postImage.setAttribute("src", obj.post.post_image);
        imageColumn.appendChild(postImage);
    }

    //  Column for description
    var descColumn = document.createElement("div");
    descColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
    descColumn.setAttribute("id", "descColumn");
    rowReply.appendChild(descColumn);

    var postDesc = document.createTextNode(obj.post.post_body);
    descColumn.appendChild(postDesc);

    //  Add a new reply to this column
    var addReplyColumn = document.createElement("div");
    addReplyColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
    addReplyColumn.setAttribute("id", "addReplyColumn");
    rowReply.appendChild(addReplyColumn);

    // Text area and submit row
    var textSubmitRow = document.createElement("div");
    textSubmitRow.classList.add("row");
    textSubmitRow.setAttribute("id", "textSubmitRow");
    addReplyColumn.appendChild(textSubmitRow);

    // A new reply text column
    var replyTextColumn = document.createElement("div");
    replyTextColumn.classList.add("col-12", "col-sm-10", "col-md-10", "col-lg-10");
    replyTextColumn.setAttribute("id", "replyTextColumn");
    textSubmitRow.appendChild(replyTextColumn);

    // Text area for a new reply
    var replyTextArea = document.createElement("textarea");
    replyTextArea.setAttribute("rows", "3");
    replyTextArea.classList.add("form-control");
    replyTextArea.setAttribute("id", "replyTextArea" + obj.post.post_id);
    replyTextColumn.appendChild(replyTextArea);

    // Submit button column for a new reply
    var replySubmitColumn = document.createElement("div");
    replySubmitColumn.classList.add("col-12", "col-sm-2", "col-md-2", "col-lg-2");
    replySubmitColumn.setAttribute("id", "replySubmitColumn");
    textSubmitRow.appendChild(replySubmitColumn);

    var replyIsComingFrom = "whenExpanded";

    // Submit button for a new reply
    var submitReply = document.createElement("button");
    submitReply.classList.add("btn", "btn-secondary", "btn-block");
    submitReply.setAttribute("id", "submitReply");
    submitReply.setAttribute("onclick", "addReply(" + obj.post.post_id + ", '" + replyIsComingFrom + "', '" + obj.post.user + "')");
    replySubmitColumn.appendChild(submitReply);

    var submitReplyText = document.createTextNode("Reply");
    submitReply.appendChild(submitReplyText);

    // All replies column
    var allReplyColumn = document.createElement("div");
    allReplyColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
    allReplyColumn.setAttribute("id", "allReplyColumn");
    rowReply.appendChild(allReplyColumn);

    // All replies row
    var allReplyRow = document.createElement("div");
    allReplyRow.classList.add("row");
    allReplyRow.setAttribute("id", "allReplyRow" + obj.post.post_id);
    allReplyColumn.appendChild(allReplyRow);

    if (obj.replies.length == 0) {
        var noRepliesColumn = document.createElement("div");
        noRepliesColumn.classList.add("offset-sm-1", "offset-md-1", "offset-lg-1", "col-10", "col-sm-10", "col-md-10", "col-lg-10", "alert", "alert-info");
        noRepliesColumn.setAttribute("id", "noRepliesColumn");
        noRepliesColumn.setAttribute("role", "alert");
        allReplyRow.appendChild(noRepliesColumn);

        var noReplyText = document.createTextNode("No reply yet");
        noRepliesColumn.appendChild(noReplyText);

    } else {
        //console.log(allReplies);
        for (var i = obj.replies.length - 1; i >= 0; i--) {
            // for (var i = 0; i < obj.replies.length; i++) {

            if (obj.replies[i].parent_id == "None") {

                //  All reply id
                var allRepliesIdHolder = document.getElementById("allReplyRow" + obj.post.post_id);

                // Add a main reply to post
                var mainReplyColumn = document.createElement("div");
                mainReplyColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12", "individualMainReply");
                mainReplyColumn.setAttribute("id", "mainReplyColumn" + obj.replies[i].reply__reply_id);
                //allReplyRow.appendChild(mainReplyColumn);
                allReplyRow.insertBefore(mainReplyColumn, allReplyRow.childNodes[0]);

                // var mainReplyText = document.createTextNode(obj.replies[i].reply_body);
                // mainReplyColumn.appendChild(mainReplyText);

            } else if (obj.replies[i].parent_id != "None") {
                var parentReplyId = document.getElementById("mainReplyColumn" + obj.replies[i].parent_id);

                console.log("Test to append child: " + obj.replies[i].parent_id);

                // Add a main reply to post
                var mainReplyColumn = document.createElement("div");
                mainReplyColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12", "individualMainReply");
                mainReplyColumn.setAttribute("style", "padding-left: 30px;");
                mainReplyColumn.setAttribute("id", "mainReplyColumn" + obj.replies[i].reply__reply_id);
                parentReplyId.appendChild(mainReplyColumn);

                // var replyToReplyText = document.createTextNode(obj.replies[i].reply_body);
                // mainReplyColumn.appendChild(replyToReplyText);

            }

            // Main reply card row for main reply
            var mainReplyRow = document.createElement("div");
            mainReplyRow.classList.add("row", "replyBorder");
            mainReplyRow.setAttribute("id", "mainReplyRow" + obj.replies[i].reply__reply_id);
            mainReplyColumn.appendChild(mainReplyRow);

            // Posted by and body column for main reply
            var postByBodyColumn = document.createElement("div");

            postByBodyColumn.classList.add("col-10", "col-sm-10", "col-md-10", "col-lg-10");
            postByBodyColumn.setAttribute("id", "postByBodyColumn");
            mainReplyRow.appendChild(postByBodyColumn);

            // Posted by and body row for main reply
            var postByBodyRow = document.createElement("div");
            postByBodyRow.classList.add("row");
            postByBodyRow.setAttribute("id", "postByBodyRow");
            postByBodyColumn.appendChild(postByBodyRow);

            // Posted by and time column for main reply
            var postByTimeColumn = document.createElement("div");
            postByTimeColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
            postByTimeColumn.setAttribute("id", "postByTimeColumn");
            postByBodyRow.appendChild(postByTimeColumn);

            //  Span for posted by user
            var spanByUser = document.createElement("span");
            spanByUser.setAttribute("style", "font-weight: bold; font-size: 15px;");
            postByTimeColumn.appendChild(spanByUser);

            if (obj.replies[i].parent_id == "None") {

                //  Posted by user
                var postedByText = document.createTextNode(obj.replies[i].user + " replied to post");
                spanByUser.appendChild(postedByText);
            } else {

                //  Posted by user
                var postedByText = document.createTextNode(obj.replies[i].user + " replied to " + obj.replies[i].parent_user);
                spanByUser.appendChild(postedByText);
            }



            //  creating time string
            var todaysDate = new Date();
            var replyDate = createDate(todaysDate, obj.replies[i].reply_datetime);

            //  Span for reply time 
            var spanForReplyTime = document.createElement("span");
            spanForReplyTime.setAttribute("style", "font-size: 10px; font-color: grey; margin-left: 10px;");
            postByTimeColumn.appendChild(spanForReplyTime);

            //  Posted by user
            var postedByTimeText = document.createTextNode(" " + replyDate);
            spanForReplyTime.appendChild(postedByTimeText);

            // Post body column for main reply
            var replyBodyColumn = document.createElement("div");
            replyBodyColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
            replyBodyColumn.setAttribute("id", "replyBodyColumn");
            postByBodyRow.appendChild(replyBodyColumn);

            //  Reply body/description
            var replyBodyText = document.createTextNode(obj.replies[i].reply_body);
            replyBodyColumn.appendChild(replyBodyText);

            // Connect and reply column for main reply
            var connectReplyColumn = document.createElement("div");
            connectReplyColumn.classList.add("col-2", "col-sm-2", "col-md-2", "col-lg-2");
            connectReplyColumn.setAttribute("id", "connectReplyColumn");
            mainReplyRow.appendChild(connectReplyColumn);

            // Connect and reply row for main reply
            var connectReplyRow = document.createElement("div");
            connectReplyRow.classList.add("row");
            connectReplyRow.setAttribute("id", "connectReplyRow");
            connectReplyColumn.appendChild(connectReplyRow);

            // Connect column for main reply
            var connectColumn = document.createElement("div");
            connectColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
            connectColumn.setAttribute("id", "connectColumn");
            connectReplyRow.appendChild(connectColumn);

            var label = "reply";

            //  Connect Button for main reply
            var buttonForMainReplyConnect = document.createElement("button");
            buttonForMainReplyConnect.classList.add("button", "btn", "btn-primary", "replyButtons");
            buttonForMainReplyConnect.setAttribute("id", "connectToReply" + obj.replies[i].reply__reply_id);
            buttonForMainReplyConnect.setAttribute("onclick", "connectIncrement(" + obj.replies[i].reply__reply_id + ",'" + label + "')");
            connectColumn.appendChild(buttonForMainReplyConnect);

            if (obj.replies[i].connect_count > 1) {
                var mianReplyConnectsText = document.createTextNode(obj.replies[i].connect_count + " Connects");
                buttonForMainReplyConnect.appendChild(mianReplyConnectsText);
            } else if (obj.replies[i].connect_count <= 1) {
                var mianReplyConnectsText = document.createTextNode(obj.replies[i].connect_count + " Connect");
                buttonForMainReplyConnect.appendChild(mianReplyConnectsText);
            }


            // Reply column for main reply
            var replyColumn = document.createElement("div");
            replyColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
            replyColumn.setAttribute("id", "replyColumn");
            connectReplyRow.appendChild(replyColumn);

            //  Reply button for main reply
            var buttonForMainReplyToReply = document.createElement("button");
            buttonForMainReplyToReply.classList.add("button", "btn", "btn-primary", "replyButtons");
            //buttonForMainReplyToReply.setAttribute("id", replyButtonId);
            buttonForMainReplyToReply.setAttribute("onclick", "replyToReplyFun(" + obj.replies[i].reply__reply_id + ")");
            replyColumn.appendChild(buttonForMainReplyToReply);


            if (obj.replies[i].reply_count > 1) {
                var mainReplyToReplyText = document.createTextNode(obj.replies[i].reply_count + " Replies");
                buttonForMainReplyToReply.appendChild(mainReplyToReplyText);
            } else if (obj.replies[i].reply_count <= 1) {
                var mainReplyToReplyText = document.createTextNode(obj.replies[i].reply_count + " Reply");
                buttonForMainReplyToReply.appendChild(mainReplyToReplyText);
            }




            //  Reply to reply column
            //  Add a new reply to this column
            var addReplyColumn = document.createElement("div");
            addReplyColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
            addReplyColumn.setAttribute("id", "replyToReplyColumn" + obj.replies[i].reply__reply_id);
            addReplyColumn.setAttribute("style", "display:none");
            mainReplyRow.appendChild(addReplyColumn);

            // Text area and submit row
            var textSubmitRow = document.createElement("div");
            textSubmitRow.classList.add("row");
            textSubmitRow.setAttribute("id", "textSubmitRow");
            addReplyColumn.appendChild(textSubmitRow);

            // A new reply text column
            var replyTextColumn = document.createElement("div");
            replyTextColumn.classList.add("col-12", "col-sm-10", "col-md-10", "col-lg-10");
            replyTextColumn.setAttribute("id", "replyTextColumn");
            textSubmitRow.appendChild(replyTextColumn);

            // Text area for a new reply
            var replyTextArea = document.createElement("textarea");
            replyTextArea.setAttribute("rows", "3");
            replyTextArea.classList.add("form-control");
            replyTextArea.setAttribute("id", "replyToReplyTextArea" + obj.replies[i].reply__reply_id);
            replyTextColumn.appendChild(replyTextArea);

            // Submit button column for a new reply
            var replySubmitColumn = document.createElement("div");
            replySubmitColumn.classList.add("col-12", "col-sm-2", "col-md-2", "col-lg-2");
            replySubmitColumn.setAttribute("id", "replySubmitColumn");

            textSubmitRow.appendChild(replySubmitColumn);

            var fromWhere = "replyToReply";

            // Submit button for a new reply
            var submitReply = document.createElement("button");
            submitReply.classList.add("btn", "btn-secondary", "btn-block");
            submitReply.setAttribute("id", "submitReply");
            submitReply.setAttribute("onclick", "addReplyToReply(" + obj.post.post_id + "," + obj.replies[i].reply__reply_id + ",'" + obj.replies[i].user + "','" + localStorage.username + "')");
            replySubmitColumn.appendChild(submitReply);

            var submitReplyText = document.createTextNode("Reply");
            submitReply.appendChild(submitReplyText);


        }
    }

}

//   Add a reply to reply function 
function replyToReplyFun(replyId) {
    alert(replyId);

    var replyToReplySection = document.getElementById("replyToReplyColumn" + replyId);

    if (replyToReplySection.style.display == "block") {
        replyToReplySection.style.display = "none";
    } else {
        replyToReplySection.style.display = "block";
    }
}

// Add a reply to a reply
function addReplyToReply(postId, replyId, parent_user, reply_user) {

    var reply = document.getElementById("replyToReplyTextArea" + replyId).value;

    if (reply != "") {

        //  Preparing JSON request object
        var addAReply = {
            "post_id": postId,
            "parent_id": replyId,
            "reply_body": reply
        }

        $.ajax({
            type: "POST",
            url: "https://infinite-reef-90129.herokuapp.com/addReply",
            data: JSON.stringify(addAReply),
            datatype: "json",
            xhrFields: {
                withCredentials: true
            },
            async: true,
            //"Access-Control-Allow-Origin": "*",
            contentType: "application/json; charset=utf-8",
            success: function processData(r) {
                var myObj = JSON.parse(r);
                if (myObj["response"] == "pass") {

                    //  closing add reply text area 
                    var replyToReplySection = document.getElementById("replyToReplyColumn" + replyId);
                    replyToReplySection.style.display = "none";

                    var new_reply_id = myObj["reply_id"];
                    var replyIsComingFrom = "replyToReply";

                    attachReplyToReply(replyId, reply, parent_user, reply_user, new_reply_id, replyIsComingFrom);

                    /*
                        reply id
                        reply user 
                        reply 
                        session user
                        newly added reply ID (FROM ALI)                        

                    */

                } else {
                    alert("Error while adding a reply");

                }
            }
        });
    }

}

// Attaches a newly added reply to a reply
function attachReplyToReply(replyId, reply, parent_user, reply_user, new_reply_id, replyIsComingFrom) {


    // Add a main reply to post
    var mainReplyColumn = document.createElement("div");
    mainReplyColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12", "individualMainReply");
    //mainReplyColumn.setAttribute("style", "padding-left: 30px;");
    mainReplyColumn.setAttribute("id", "mainReplyColumn" + new_reply_id);


    if (replyIsComingFrom != "whenExpanded") {
        $(mainReplyColumn).insertAfter("#mainReplyRow" + replyId);
    } else if (replyIsComingFrom == "whenExpanded") {

        var allReplyRow = document.getElementById("allReplyRow" + replyId);
        allReplyRow.insertBefore(mainReplyColumn, allReplyRow.childNodes[0]);
        //alert("when Expanded rendering");
    }


    // Main reply card row for main reply
    var mainReplyRow = document.createElement("div");
    mainReplyRow.classList.add("row", "replyBorder");
    mainReplyRow.setAttribute("id", "mainReplyRow" + new_reply_id);
    mainReplyColumn.appendChild(mainReplyRow);

    // Posted by and body column for main reply
    var postByBodyColumn = document.createElement("div");

    postByBodyColumn.classList.add("col-10", "col-sm-10", "col-md-10", "col-lg-10");
    postByBodyColumn.setAttribute("id", "postByBodyColumn");
    mainReplyRow.appendChild(postByBodyColumn);

    // Posted by and body row for main reply
    var postByBodyRow = document.createElement("div");
    postByBodyRow.classList.add("row");
    postByBodyRow.setAttribute("id", "postByBodyRow");
    postByBodyColumn.appendChild(postByBodyRow);

    // Posted by and time column for main reply
    var postByTimeColumn = document.createElement("div");
    postByTimeColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
    postByTimeColumn.setAttribute("id", "postByTimeColumn");
    postByBodyRow.appendChild(postByTimeColumn);

    //  Span for posted by user
    var spanByUser = document.createElement("span");
    spanByUser.setAttribute("style", "font-weight: bold; font-size: 15px;");
    postByTimeColumn.appendChild(spanByUser);

    //  Posted by user
    var postedByText = document.createTextNode(reply_user + " replied to " + parent_user);
    spanByUser.appendChild(postedByText);

    //  Span for reply time 
    var spanForReplyTime = document.createElement("span");
    spanForReplyTime.setAttribute("style", "font-size: 10px; font-color: grey; margin-left: 10px;");
    postByTimeColumn.appendChild(spanForReplyTime);

    //  Posted by user
    var postedByTimeText = document.createTextNode(" Just now");
    spanForReplyTime.appendChild(postedByTimeText);

    // Post body column for main reply
    var replyBodyColumn = document.createElement("div");
    replyBodyColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
    replyBodyColumn.setAttribute("id", "replyBodyColumn");
    postByBodyRow.appendChild(replyBodyColumn);

    //  Reply body/description
    var replyBodyText = document.createTextNode(reply);
    replyBodyColumn.appendChild(replyBodyText);

    // Connect and reply column for main reply
    var connectReplyColumn = document.createElement("div");
    connectReplyColumn.classList.add("col-2", "col-sm-2", "col-md-2", "col-lg-2");
    connectReplyColumn.setAttribute("id", "connectReplyColumn");
    mainReplyRow.appendChild(connectReplyColumn);

    // Connect and reply row for main reply
    var connectReplyRow = document.createElement("div");
    connectReplyRow.classList.add("row");
    connectReplyRow.setAttribute("id", "connectReplyRow");
    connectReplyColumn.appendChild(connectReplyRow);

    // Connect column for main reply
    var connectColumn = document.createElement("div");
    connectColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
    connectColumn.setAttribute("id", "connectColumn");
    connectReplyRow.appendChild(connectColumn);

    var label = "reply";

    //  Connect Button for main reply
    var buttonForMainReplyConnect = document.createElement("button");
    buttonForMainReplyConnect.classList.add("button", "btn", "btn-primary", "replyButtons");
    buttonForMainReplyConnect.setAttribute("id", "connectToReply" + new_reply_id);
    buttonForMainReplyConnect.setAttribute("onclick", "connectIncrement('" + new_reply_id + "','" + label + "')");
    connectColumn.appendChild(buttonForMainReplyConnect);

    var mianReplyConnectsText = document.createTextNode("0 Connect");
    buttonForMainReplyConnect.appendChild(mianReplyConnectsText);


    // Reply column for main reply
    var replyColumn = document.createElement("div");
    replyColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
    replyColumn.setAttribute("id", "replyColumn");
    connectReplyRow.appendChild(replyColumn);

    //  Reply button for main reply
    var buttonForMainReplyToReply = document.createElement("button");
    buttonForMainReplyToReply.classList.add("button", "btn", "btn-primary", "replyButtons");
    //buttonForMainReplyToReply.setAttribute("id", replyButtonId);
    buttonForMainReplyToReply.setAttribute("onclick", "replyToReplyFun(" + new_reply_id + ")");
    replyColumn.appendChild(buttonForMainReplyToReply);

    var mainReplyToReplyText = document.createTextNode("0 Reply");
    buttonForMainReplyToReply.appendChild(mainReplyToReplyText);

}

//  Add a reply to a post
function addReply(postId, replyIsComingFrom, parentUser) {


    var postIdTag = "replyTextArea" + postId;
    var rowId = "replyRow" + postId;
    var addReplyID = "addReplyRow" + postId;
    var addReplyID = document.getElementById(addReplyID);
    var reply = document.getElementById(postIdTag).value;


    if (reply != "") {

        //  Preparing JSON request object
        var addAReply = {
            "post_id": postId,
            "reply_body": reply
        }

        $.ajax({
            type: "POST",
            url: "https://infinite-reef-90129.herokuapp.com/addReply",
            data: JSON.stringify(addAReply),
            datatype: "json",
            xhrFields: {
                withCredentials: true
            },
            async: true,
            //"Access-Control-Allow-Origin": "*",
            contentType: "application/json; charset=utf-8",
            success: function processData(r) {
                var myObj = JSON.parse(r);
                if (myObj["response"] == "pass") {

                    if (replyIsComingFrom != "whenExpanded") {
                        document.getElementById(postIdTag).value = "";
                        addReplyID.innerHTML = "";
                        var replyHasBeenAddedColumn = document.createElement("div");
                        replyHasBeenAddedColumn.classList.add("offset-sm-1", "offset-md-1", "offset-lg-1", "col-10", "col-sm-10", "col-md-10", "col-lg-10", "alert", "alert-success");
                        replyHasBeenAddedColumn.setAttribute("id", "replyHasBeenAddedColumn");
                        replyHasBeenAddedColumn.setAttribute("role", "alert");
                        addReplyID.appendChild(replyHasBeenAddedColumn);

                        var replyAddedText = document.createTextNode("Reply has been added. Expand the post to see yours and other replies.");
                        replyHasBeenAddedColumn.appendChild(replyAddedText);

                    } else if (replyIsComingFrom == "whenExpanded") {
                        //allReplyRow.insertBefore(mainReplyColumn, allReplyRow.childNodes[0]);
                        alert(parentUser);

                        // "reply__reply_id": "129",
                        // "user": "ali",
                        // "parent_id": "122",
                        // "replyconnector__user": "None",
                        // "parent_user": "ali",
                        // "reply_body": "reply added ",
                        // "reply_datetime": "2018-04-21 21:51:41.727107+00:00",
                        // "reply_count": "0",
                        // "connect_count": "2"
                        //  call attachReplyToReply(replyId, reply, parent_user, reply_user, new_reply_id)

                        var reply_user = localStorage.username;
                        var new_reply_id = myObj["reply_id"];
                        attachReplyToReply(postId, reply, parentUser, reply_user, new_reply_id, replyIsComingFrom)
                    }


                } else {
                    alert("Error while adding a reply");

                }
            }
        });
    }
}

// This function addes a reply to post
function replyToPostFun(postId) {
    var replyRowID = document.getElementById("replyRow" + postId);
    var addReplyID = document.getElementById("addReplyRow" + postId);

    if (addReplyID.style.display == "block") {
        addReplyID.style.display = "none";
    } else if (replyRowID.style.display == "none" && addReplyID.style.display == "none") {

        //  empty this div
        addReplyID.innerHTML = "";
        addNewReplyToPost(postId);
    } else {
        $('html, body').animate({
            scrollTop: $("#replyTextArea" + postId).offset().top - ($(window).height() - $("#replyTextArea" + postId).outerHeight(true)) / 3
        }, 500);
    }

    //alert(postId);

}

// This function increments the connect for post and reply
function connectIncrement(id, label, flag) {

    if (flag != '1') {
        if (label == "post") {
            var connectIncrement = {
                "post_id": id
            };
            var urlType = "https://infinite-reef-90129.herokuapp.com/incrementConnectByPostId";
        } else {
            var connectIncrement = {
                "reply_id": id
            };
            var urlType = "https://infinite-reef-90129.herokuapp.com/incrementConnectByReplyId";
        }
        $.ajax({
            type: "POST",
            url: urlType,
            data: JSON.stringify(connectIncrement),
            datatype: "json",
            xhrFields: { withCredentials: true },
            async: true,
            contentType: "application/json",
            success: function processData(r) {
                var myObj = JSON.parse(r);
                if (myObj["response"] == "pass") {

                    if (label == "post") {
                        var postConnectButtonSpan = document.getElementById("postConnectButtonSpan" + id);
                        var postConnectButton = document.getElementById("postConnectButton" + id);

                        postConnectButtonSpan.innerHTML = "";
                        postConnectButtonSpan.innerHTML = myObj["connect_count"] + " Connects";

                        postConnectButton.style.backgroundColor = "#e0e0e0";
                    } else {
                        var connectToReply = document.getElementById("connectToReply" + id);
                        connectToReply.style.backgroundColor = "#e0e0e0";
                        $("#connectToReply" + id).html(myObj["connect_count"] + " Connects");
                    }

                }
            }
        });
    }

}

//  This function is called when sort by connect is cliked
function sortByConnect() {
    //Preparing JSON request object
    var loadNPosts = {
        "n": 50
    }

    $.ajax({
        type: "POST",
        url: "https://infinite-reef-90129.herokuapp.com/getNRecentForumPostsByConnectCount",
        data: JSON.stringify(loadNPosts),
        datatype: "json",
        xhrFields: {
            withCredentials: true
        },
        async: true,
        contentType: "application/json",
        success: function processData(r) {
            var json_data = JSON.parse(r);
            //alert(JSON.stringify(json_data));
            var postType = "displayAllPosts";
            //alert(JSON.stringify(json_data));
            generatePostCards(json_data, postType);
        }
    });

    $(document).ready(function () {
        $('#page-body').ajaxStart(function () {
            alert("AJAX sent");
            $('#posts-loading').show();
        }).ajaxStop(function () {
            $('#posts-loading').hide();
        });
    });
}

//  This function is called when sort by time is clicked
function sortByTime() {
    onLoadFunctionForForumPosts();
}

// This function searches for post and post by username
function searchPostBy() {

    var searchByOption = document.getElementById("searchByOption").value;
    var searchById = document.getElementById("searchById").value;


    if (searchById != "" && searchByOption != "") {

        if (searchByOption == "2") {
            //Preparing JSON request object
            var loadNPosts = {
                "username": searchById
            }

            $.ajax({
                type: "POST",
                url: "https://infinite-reef-90129.herokuapp.com/getForumPostsByUsername",
                data: JSON.stringify(loadNPosts),
                datatype: "json",
                xhrFields: {
                    withCredentials: true
                },
                async: true,
                contentType: "application/json",
                success: function processData(r) {
                    
                    var json_data = JSON.parse(r);
                    if(json_data.hasOwnProperty('response')){
                        alert("No username found!");
                    }else{
                        var postType = "displayAllPosts";
                        generatePostCards(json_data, postType);
                    }
                }
            });
        }else if (searchByOption == "1") {
            //Preparing JSON request object
            var loadNPosts = {
                "keywords": searchById
            }

            $.ajax({
                type: "POST",
                url: "https://infinite-reef-90129.herokuapp.com/searchPostsByTitle",
                data: JSON.stringify(loadNPosts),
                datatype: "json",
                xhrFields: {
                    withCredentials: true
                },
                async: true,
                contentType: "application/json",
                success: function processData(r) {
                    var json_data = JSON.parse(r);
                    if(json_data.hasOwnProperty('response')){
                        alert("No posts found!");
                    }else{
                        var postType = "displayAllPosts";
                        generatePostCards(json_data, postType);
                    }
                    
                }
            });
        }


    }

}

// This function renders the new row for reply when post not expanded
function addNewReplyToPost(postId) {
    var addReplyRow = document.getElementById("addReplyRow" + postId);

    addReplyRow.style.display = "block";

    //  Add a new reply to this column
    var addReplyColumn = document.createElement("div");
    addReplyColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
    addReplyColumn.setAttribute("id", "addReplyColumn");
    addReplyRow.appendChild(addReplyColumn);

    // Text area and submit row
    var textSubmitRow = document.createElement("div");
    textSubmitRow.classList.add("row");
    textSubmitRow.setAttribute("id", "textSubmitRow");
    addReplyColumn.appendChild(textSubmitRow);

    // A new reply text column
    var replyTextColumn = document.createElement("div");
    replyTextColumn.classList.add("col-12", "col-sm-10", "col-md-10", "col-lg-10");
    replyTextColumn.setAttribute("id", "replyTextColumn");
    textSubmitRow.appendChild(replyTextColumn);

    // Text area for a new reply
    var replyTextArea = document.createElement("textarea");
    replyTextArea.setAttribute("rows", "3");
    replyTextArea.classList.add("form-control");
    replyTextArea.setAttribute("id", "replyTextArea" + postId);
    replyTextColumn.appendChild(replyTextArea);

    // Submit button column for a new reply
    var replySubmitColumn = document.createElement("div");
    replySubmitColumn.classList.add("col-12", "col-sm-2", "col-md-2", "col-lg-2");
    replySubmitColumn.setAttribute("id", "replySubmitColumn");

    textSubmitRow.appendChild(replySubmitColumn);

    var replyIsComingFrom = "doNothing";
    var postUser = "null";

    // Submit button for a new reply
    var submitReply = document.createElement("button");
    submitReply.classList.add("btn", "btn-secondary", "btn-block");
    submitReply.setAttribute("id", "submitReply");
    submitReply.setAttribute("onclick", "addReply(" + postId + ", '" + replyIsComingFrom + "', '" + postUser + "')");
    replySubmitColumn.appendChild(submitReply);

    var submitReplyText = document.createTextNode("Reply");
    submitReply.appendChild(submitReplyText);
}