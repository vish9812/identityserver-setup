var myis = {};

(function () {

    const _this = this;

    this.log = function() {
        document.getElementById('results').innerText = '';

        Array.prototype.forEach.call(arguments, function (msg) {
            if (msg instanceof Error) {
                msg = "Error: " + msg.message;
            } else if (typeof msg !== 'string') {
                msg = JSON.stringify(msg, null, 2);
            }
            document.getElementById('results').innerHTML += msg + '\r\n';
        });
    };

    this.checkUserLogin = function () {
        mgr.getUser().then(function (user) {
            if (user) {
                myis.log("User logged in", user.profile);
            }
            else {
                myis.log("User not logged in");
            }
        });
    };

    this.login = function () {
        mgr.signinRedirect();
    };

    this.api = function () {
        mgr.getUser().then(function (user) {
            var url = "http://localhost:61554/api/values";

            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = function () {
                _this.log(xhr.status, JSON.parse(xhr.responseText));
            }
            xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
            xhr.send();
        });
    };

    this.logout = function () {
        mgr.signoutRedirect();
    };

    var config = {
        authority: "http://localhost:61605",
        client_id: "myidentityserver_js",
        redirect_uri: "http://localhost:61606/callback.html",
        response_type: "id_token token",
        scope: "openid profile myidentityserver",
        post_logout_redirect_uri: "http://localhost:61606/index.html",
    };
    var mgr = new Oidc.UserManager(config);
}).apply(myis);

document.getElementById("login").addEventListener("click", myis.login, false);
document.getElementById("api").addEventListener("click", myis.api, false);
document.getElementById("logout").addEventListener("click", myis.logout, false);

myis.checkUserLogin();