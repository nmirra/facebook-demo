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
    }
}

function logout() {
    FB.logout(function(response) {
        setElements(false);
    });
}

function getPages() {
    let meNode = 'me';
    let fields = 'name, accounts{picture,id,name,access_token,category}';
    FB.api(meNode + '?fields=' + fields, function(response) {
        if (response && !response.error) {
            console.log(response);
            showPages(response);
        }
    });
}

function getPage(pageId, accessToken) {
    let promotablePostsNode = 'promotable_posts';
    let fields = 'is_published,created_time,picture,message&include_hidden=true';
    FB.api(pageId + '/' + promotablePostsNode + '?fields=' + fields + '&access_token=' + accessToken, function(response) {
            if (response && !response.error) {
                console.log(response);
                showPosts(response);
            }
    });
}

function showPages(user) {
    document.getElementById('pages-heading').innerHTML = user.name + " - Manage your pages";
    document.getElementById('posts').style.display = 'none';
    let accounts = user.accounts.data;
    let htmlForPages = "";

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
                    <button type="button" id="button-${i}" class="btn btn-lg btn-block btn-outline-primary"
                            onclick="getPage('${accounts[i].id}','${accounts[i].access_token}');">Select</button>
                </div>
            </div>
        `
    }
    document.getElementById('pages-list').innerHTML = htmlForPages;
    document.getElementById('pages').style.display = 'block';
}

function showPosts(posts) {
    document.getElementById('pages').style.display = 'none';
    let postsData = posts.data;
    let htmlForPublishedPosts = ``;

    let htmlForUnPublishedPosts = ``;

    for (let i in postsData) {
        if (postsData.is_published === 'true') {
            htmlForPublishedPosts += ``;
         } else {
            htmlForUnPublishedPosts += ``;
         }
    }

    htmlForPublishedPosts += `</div>`;
    htmlForUnPublishedPosts += `</div>`;

    //document.getElementById('posts-list').innerHTML = + htmlForPublishedPosts + htmlForUnPublishedPosts;
    document.getElementById('posts').style.display = 'block';
}
