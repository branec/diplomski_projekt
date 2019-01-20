document.getElementById("predmeti").onclick = function () {
    var url = window.location.href;
var parts = url.split("?")
var username = parts[1];

    location.href = "/predmeti?" + username;
};

document.getElementById("ispravljanje").onclick = function () {
    var url = window.location.href;
var parts = url.split("?")
var username = parts[1];

    location.href = "/ispravljanje?" + username;
};

document.getElementById("ispravljeni").onclick = function () {
    var url = window.location.href;
var parts = url.split("?")
var username = parts[1];

    location.href = "/ispravljeni?" + username;
};

document.getElementById("studenti").onclick = function () {
    var url = window.location.href;
var parts = url.split("?")
var username = parts[1];

    location.href = "/studenti?" + username;
};