var request = new XMLHttpRequest();
var url = window.location.href;
var parts = url.split("=")
var username = parts[1];
    request.open('GET', 'http://localhost:3000/exams_uvid/' + username, true);
    request.onload = function () {
// Begin accessing JSON data here
var data = JSON.parse(this.response);
if (request.status >= 200 && request.status < 400) {
    var tablica = document.getElementById("ispiti-tbody");
    var brojac = 1;
data.forEach(exam => {
  var red = document.createElement("tr");
  var td1 = document.createElement("td");
  td1.innerText = brojac;
  brojac++;
  red.appendChild(td1);

  var td2 = document.createElement("td");
  td2.innerText = exam.Predmet;
  red.appendChild(td2);

  var td3 = document.createElement("td");
  td3.innerText = exam.Naziv;
  red.appendChild(td3);

  var td4 = document.createElement("td");
  td4.innerText = exam.VrijemeOd;
  red.appendChild(td4);

  var td5 = document.createElement("td");
  td5.innerText = exam.VrijemeDo;
  red.appendChild(td5);

  var td6 = document.createElement("td");
  td6.innerText = exam.Prostorija;
  red.appendChild(td6);

  var td7 = document.createElement("td");
  td7.innerText = exam.Trajanje;
  red.appendChild(td7);

  var td8 = document.createElement("td");
  var a = document.createElement("a");
  a.innerText = "Uvid";
  a.href = `/uvid?exam=${exam.Id}&user=${username}`;
  td8.appendChild(a);
  red.appendChild(td8);

  tablica.appendChild(red);

});
} else {
console.log('error');
}
}
request.send();
