
    document.getElementById("header-scanner").onclick = function () {
        var url = window.location.href;
    var parts = url.split("?")
    var username = parts[1];

        location.href = "/scanner?" + username;
    };
