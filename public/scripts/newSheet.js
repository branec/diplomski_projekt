var request = new XMLHttpRequest();
var url = window.location.href;
var parts = url.split("=")
var username = parts[1];
    request.open('GET', 'http://localhost:3000/exams_user/' + username, true);
    request.onload = function () {
// Begin accessing JSON data here
var data = JSON.parse(this.response);
if (request.status >= 200 && request.status < 400) {
    var dropdown = document.getElementById("exams-list");
data.forEach(exam => {
  var option = document.createElement("option");
  option.value = exam.Id;
  option.innerText = exam.Naziv +","+ exam.Predmet;
  dropdown.appendChild(option);

});
} else {
console.log('error');
}
}
request.send();


document.getElementById("gedddtdata").onclick = function () {


var premdet = $( "#exams-list option:selected" ).val();
var inputfiledvalue = document.getElementById("barcode-input").value;




}





