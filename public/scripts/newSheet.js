var request = new XMLHttpRequest();
var url = window.location.href;
var parts = url.split("=")
var username = parts[1];
    request.open('GET', 'http://localhost:3000/subjects/' + username, true);
    request.onload = function () {
// Begin accessing JSON data here
var data = JSON.parse(this.response);
if (request.status >= 200 && request.status < 400) {
    var dropdown = document.getElementById("exams-list");
data.forEach(predmet => {
  var option = document.createElement("option");
  option.value = predmet.NAZIV
  option.innerText = predmet.NAZIV;
  dropdown.appendChild(option);

});
} else {
console.log('error');
}
}
request.send();


document.getElementById("getdata").onclick = function () {


var premdet = document.getElementById("exams-list").value;
var inputfiledvalue = document.getElementById("barcode-input").value;




}





