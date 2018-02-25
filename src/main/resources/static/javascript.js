window.fbAsyncInit = function() {
                FB.init({
                    appId      : '2048548748696487',
                    cookie     : true,
                    xfbml      : true,
                    version    : 'v2.12'
                });

                FB.getLoginStatus(function(response) {
                    statusChangeCallback(response);
                });

};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {
    if (response.status === 'connected') {
        setElements(true);
        getPages();
    } else {
        setElements(false);
    }
}

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

function setElements(isLoggedIn) {
    if(isLoggedIn) {
        document.getElementById('pages').style.display = 'block';
        document.getElementById('fb-btn').style.display = 'none';
        document.getElementById('heading').style.display = 'none';
        document.getElementById('logout').style.display = 'block';
    } else {
        document.getElementById('pages').style.display = 'none';
        document.getElementById('fb-btn').style.display = 'block';
        document.getElementById('heading').style.display = 'block';
        document.getElementById('logout').style.display = 'none';
        document.getElementById('posts').style.display = 'none';
    }
}

function goBackToPages() {
    document.getElementById('pages').style.display = 'block';
    document.getElementById('posts').style.display = 'none';
}

function logout() {
    FB.logout(function(response) {
        setElements(false);
    });
}

function formatDate(createdTime) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                 'October', 'November', 'December'];
    var date = new Date(createdTime);
    return days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()] + ', ' + date.getFullYear()
            + ' at ' + date.getHours() + ':' + date.getMinutes();
}


function getPages() {
    var meNode = 'me';
    var fields = 'name, accounts{picture,id,name,access_token,category}';
    FB.api(meNode + '?fields=' + fields, function(response) {
        if (response && !response.error) {
            showPages(response);
        }
    });
}

function getPage(pageId, accessToken) {
    var promotablePostsNode = 'promotable_posts';
    var fields = 'is_published,created_time,picture,message&include_hidden=true';
    FB.api(pageId + '/' + promotablePostsNode + '?fields=' + fields + '&access_token=' + accessToken, function(response) {
            if (response && !response.error) {
                showPosts(response, pageId, accessToken);
            }
    });
}

function populateViews(ids, accessToken) {

    ids.forEach(function(id, index, array) {
        FB.api(id + '/insights/post_impressions_unique/lifetime?access_token=' + accessToken, function(response) {
                    if (response && !response.error) {
                        var views = response.data[0].values[0].value;
                        document.getElementById('published-' + index).innerHTML = "Viewed by : " + views;
                    }
        });
    });
}

function createNewPost(pageId, accessToken) {
    document.getElementById('posts').style.display = 'none';
    document.getElementById('create-post').style.display = 'block';
    document.getElementById('btn-cancel').onclick = function(){
        getPage(pageId, accessToken);
        document.getElementById('create-post').style.display = 'none';
        };
    document.getElementById('btn-create-post').onclick = function(){
        var postMessage = document.getElementById('message').value;
        var postHidden = document.getElementById('post-hidden-check').checked;
        FB.api(
            "/" + pageId + "/feed",
             "POST",
             {
                 "message": postMessage,
                 "access_token": accessToken,
                 "published" : !postHidden
             },
             function (response) {
                if (response && !response.error) {
                    alert("Post id: " + response.id + " successfully created!");
                    getPage(pageId, accessToken);
                } else {
                    var message = response.error.message;
                    alert("There was an error posting your message, please try again. Error message: " + message);
                }
             }
        );

    };
}

function showPages(user) {
    document.getElementById('pages-heading').innerHTML = user.name + " - Manage your pages";
    document.getElementById('posts').style.display = 'none';
    var accounts = user.accounts.data;
    let htmlForPages = ``;

    for (let i in accounts) {
        htmlForPages += `
            <div class="card mb-4 box-shadow">
                <div class="card-header">
                    <h4 class="my-0 font-weight-normal">${accounts[i].name}</h4>
                </div>
                <div class="card-body">
                    <ul class="list-unstyled mt-3 mb-4">
                        <li>Page id: ${accounts[i].id}</li>
                        <li>Category: ${accounts[i].category}</li>
                    </ul>
                    <button type="button" id="button-${i}" class="btn btn-block btn-outline-primary"
                            onclick="getPage('${accounts[i].id}','${accounts[i].access_token}');">Select</button>
                </div>
            </div>
        `;
    }
    document.getElementById('pages-list').innerHTML = htmlForPages;
    document.getElementById('pages').style.display = 'block';
}

function showPosts(posts, pageId, accessToken) {
    document.getElementById('pages').style.display = 'none';
    document.getElementById('create-post').style.display = 'none';
    document.getElementById('message').value = "";
    document.getElementById('post-hidden-check').checked = false;
    document.getElementById('new-post-btn').onclick = function() { createNewPost(pageId, accessToken); };
    var postsData = posts.data;
    let htmlForPublishedPosts = `<h5 class="border-bottom border-gray pb-2 mb-0" style="color: #007bff;">Published Posts</h5>`;
    let htmlForUnPublishedPosts = `<h5 class="border-bottom border-gray pb-2 mb-0" style="color: #007bff;">Unpublished Posts</h5>`;
    var publishedIds = [];
    var publishedCount = 0;

     postsData.forEach(function(post, index, array) {
        let createdDate = formatDate(post.created_time);
        let message = post.message;
        let picture = post.picture;

        if (post.is_published === true) {
            publishedIds.push(post.id);
            htmlForPublishedPosts += `<div class="media text-muted pt-3">
                                         <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                         <strong class="d-block text-gray-dark">Published on: ${createdDate}</strong>
                                         <strong id="published-${publishedCount}" class="d-block text-gray-dark"></strong>`;

            if (picture) {
                htmlForPublishedPosts += `<img class="mr-3" src="${picture}" style="margin-top: 15px;" width="130" height="130"/>`;
            }

            if (message) {
                htmlForPublishedPosts += `${message}`;
            }

            htmlForPublishedPosts += `   </p>
                                       </div>`;
            publishedCount++;
        } else {
            htmlForUnPublishedPosts += `<div class="media text-muted pt-3">
                                           <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                                           <strong class="d-block text-gray-dark">Created on: ${createdDate}</strong>`;

            if (picture) {
                htmlForUnPublishedPosts += `<img class="mr-3" src="${picture}" style="margin-top: 15px;" width="130" height="130"/>`;
            }

            if (message) {
                htmlForUnPublishedPosts += `${message}`;
            }

            htmlForUnPublishedPosts += `   </p>
                                        </div>`;
        }
     });
    populateViews(publishedIds, accessToken);
    document.getElementById('published-posts').innerHTML = htmlForPublishedPosts;
    document.getElementById('unpublished-posts').innerHTML = htmlForUnPublishedPosts;
    document.getElementById('posts').style.display = 'block';
}
