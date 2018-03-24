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
            //alert(JSON.stringify(json_data));
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

    //  addNewPost
    //  displayAllPosts

    var cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = "";
    // if (postType == "displayAllPosts"){
    //     cardsContainer.innerHTML = "";
    // }


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
        // if (postType == "displayAllPosts"){
        //     cardsContainer.appendChild(card);
        // }else if (postType == "addNewPost"){
        //     cardsContainer.insertBefore(card, cardsContainer.firstChild);
        // }

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

        var conReplyColumn = document.createElement("div");
        conReplyColumn.classList.add("col-12", "col-md-1", "col-lg-1");
        conRepDes.appendChild(conReplyColumn);

        //  Row for Connect and Reply
        var contentReply = document.createElement("div");
        contentReply.classList.add("row");
        contentReply.classList.add("reply-connect");
        conReplyColumn.appendChild(contentReply);

        //  Column for Connect
        var connect = document.createElement("div");
        connect.classList.add("col-6", "col-sm-12", "col-md-12", "col-lg-12", "icon_count");
        contentReply.appendChild(connect);

        var buttonForConnect = document.createElement("button");
        buttonForConnect.classList.add("mdl-button", "mdl-js-button", "mdl-button--icon", "mdl-button--colored", "buttonForConnect");
        buttonForConnect.setAttribute("id", posts[i].post_id);
        connect.appendChild(buttonForConnect);

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



        //  add a row for replies
        var replyRow = document.createElement("div");
        replyRow.classList.add("row");
        replyRow.setAttribute("style","transition: max-height 0.15s ease-out");
        replyRow.style.display = "none";
        replyRow.setAttribute("id","replyRow"+ posts[i].post_id);
        cardColumn.appendChild(replyRow);


        var sampleText = document.createTextNode("Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam");
        replyRow.appendChild(sampleText);

        //Button for expanding the post
        var postExpandRow = document.createElement("div");
        postExpandRow.classList.add("row");
        postExpandRow.setAttribute("style","display: block");
        cardColumn.appendChild(postExpandRow);

        var postExpandCol = document.createElement("div");
        postExpandCol.classList.add("offset-11", "offset-sm-11", "offset-md-11", "offset-lg-11");
        postExpandCol.classList.add("col-1", "col-sm-1", "col-md-1", "col-lg-1", "postExpandCol");
        postExpandRow.appendChild(postExpandCol);

        //  button to hold the image
        var downButton = document.createElement("button");
        downButton.classList.add("downButton");
        downButton.setAttribute("onclick", "onClickOfShowPost("+ posts[i].post_id +")");
        downButton.setAttribute("id", "button"+ posts[i].post_id);
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
function addNewPost(){
  alert("addNewPost called");

  //  Login Information
  var newPostTitle = document.getElementById('newPostTitle').value;
  var newPostDesc = document.getElementById('newPostDesc').value;
  var newImageURL = document.getElementById('newImageURL').value;

  //  Preparing JSON request object
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
      xhrFields: {withCredentials: true},
      async: true,
      //"Access-Control-Allow-Origin": "*",
      contentType: "application/json; charset=utf-8",
      success: function processData(r) {
          var myObj = JSON.parse(r);
          if (myObj["response"] == "pass") {
              //
              //addNewPostOnTop(newPostTitle, newPostDesc, newImageURL);
              console.log(r);

          } else {
              alert("User is not authenticated");

          }
      }
  });
}

// This function will add a new post on the top of the displayed posts when a new post is added
function addNewPostOnTop(newPostTitle, newPostDesc, newImageURL){


}

//  This function is called when show Post/Replies is clicked
function onClickOfShowPost(post_id){

    var rowId = "replyRow" + post_id;
    var buttonId = "button" + post_id;
    var icon = "buttonImg" + post_id;
    var conRepDes = "conRepDes" + post_id;

    var buttonIcon = document.getElementById(icon);
    var replyRow = document.getElementById(rowId);
    var crdRow = document.getElementById(conRepDes);

    if(replyRow.style.display === "none"){
        buttonIcon.setAttribute("src", "../assets/up-arrow.svg");
        replyRow.style.display = "block";
        crdRow.style.display = "none";
    }else if(replyRow.style.display === "block"){
        replyRow.style.display = "none";
        buttonIcon.setAttribute("src", "../assets/down-arrow.svg");
        crdRow.style.display = "block";
    }

    //Preparing JSON request object
    var loadPostAndReplies = {
        "post_id": post_id
    };

    $.ajax({
        type: "POST",
        url: "https://infinite-reef-90129.herokuapp.com/getPostAndRepliesByPostId",
        data: JSON.stringify(loadPostAndReplies),
        datatype: "json",
        xhrFields: {withCredentials: true},
        async: true,
        contentType: "application/json",
        success: function processData(r) {
            //console.log(r);
            //var json_data = JSON.parse(r);
            //  console.log(JSON.stringify(json_data));

            showReplies(r, rowId);

        }
    });

}

//  This function will show all the replies
function showReplies(allReplies, rowId){

    var obj = JSON.parse(allReplies);

    var imageColumn = documen.createElement("div");
    imageColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
    imageColumn.setAttribute("id", "imageColumn");
    imageColumn.style.display = "none";
    replyRow.appendChild(imageColumn);

    var postImage = document.createElement("img");
    postImage.classList.add("postImage");
    postImage.setAttribute("src", allReplies.post.post_image);
    imageColumn.appendChild(postImage);

    if(obj.replies.length == 0){
        var addReplyColumn = document.createElement("div");
        addReplyColumn.classList.add("col-12", "col-sm-12", "col-md-12", "col-lg-12");
        addReplyColumn.setAttribute("id", "addReplyColumn");
        replyRow.appendChild(addReplyColumn);
    }

    /*
        check if the JSON is empty
        if empty
            Add reply form
        if not empty
            Add reply form
            All replies
            Add reply

    */

    //  var obj = JSON.parse(allReplies);
    // console.log(obj.post);
    // allReply = {
    //   "post": {
    //     "post_id": "6",
    //     "user": "ali",
    //     "post_title": "my first forum post",
    //     "post_body": "my first forum post body",
    //     "post_image": "",
    //     "post_datetime": "2018-03-11 01:55:08.061589+00:00",
    //     "connect_count": "0"
    //   },
    //   "replies":
    //     [
    //         {
    //           "reply_id": "22",
    //           "user": "hrishi",
    //           "post_id": "6",
    //           "parent_id": "None",
    //           "reply_body": "This is a reply to the main post",
    //           "reply_datetime": "2018-03-11 01:57:16.986748+00:00",
    //           "connect_count": "0"
    //         },
    //         {
    //           "reply_id": "23",
    //           "user": "jeet",
    //           "post_id": "6",
    //           "parent_id": "None",
    //           "reply_body": "This reply is to the main post",
    //           "reply_datetime": "2018-03-11 01:57:16.986748+00:00",
    //           "connect_count": "0"
    //         },
    //         {
    //           "reply_id": "24",
    //           "user": "ali",
    //           "post_id": "6",
    //           "parent_id": "22",
    //           "reply_body": "This reply is to Hrishi",
    //           "reply_datetime": "2018-03-11 01:57:16.986748+00:00",
    //           "connect_count": "0"
    //         },
    //         {
    //           "reply_id": "25",
    //           "user": "Manahil",
    //           "post_id": "6",
    //           "parent_id": "24",
    //           "reply_body": "This reply is to ali's reply",
    //           "reply_datetime": "2018-03-11 01:57:16.986748+00:00",
    //           "connect_count": "0"
    //         },
    //         {
    //           "reply_id": "26",
    //           "user": "hrishi",
    //           "post_id": "6",
    //           "parent_id": "23",
    //           "reply_body": "This reply is to Jeet's reply",
    //           "reply_datetime": "2018-03-11 01:57:16.986748+00:00",
    //           "connect_count": "0"
    //         }
    //     ]
    // }
    //console.log(obj.replies);

    alert(allReply.replies.length)





}
