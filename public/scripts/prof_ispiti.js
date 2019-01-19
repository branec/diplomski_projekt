var request = new XMLHttpRequest();
var url_string = window.location.href;
var url = new URL(url_string);
var user = url.searchParams.get("user");
var exam = url.searchParams.get("exam");

    request.open('GET', `http://localhost:3000/exams_prof/${user}/${exam}`, true);
    request.onload = function () {
// Begin accessing JSON data here
var data = JSON.parse(this.response);
if (request.status >= 200 && request.status < 400) {
    var tablica = document.getElementById("prof_ispiti_table");
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

  tablica.appendChild(red);


  
  var url_string = window.location.href;
  var url = new URL(url_string);
  var exam = url.searchParams.get("exam");

request.open('GET', `http://localhost:3000/users/${exam}`, true);
request.onload = function () {
// Begin accessing JSON data here
var data = JSON.parse(this.response);
if (request.status >= 200 && request.status < 400) {
var tablica = document.getElementById("prof_studenti_table");
var brojac = 1;
data.forEach(user => {
var red = document.createElement("tr");
var td1 = document.createElement("td");
td1.innerText = brojac;
brojac++;
red.appendChild(td1);

var td2 = document.createElement("td");
td2.innerText = user.JMBAG;
red.appendChild(td2);
var td3 = document.createElement("td");
td3.innerText = user.Ime;
red.appendChild(td3);
var td4 = document.createElement("td");
td4.innerText = user.Prezime;
red.appendChild(td4);

tablica.appendChild(red);

});
} else {
console.log('error');
}
}
request.send();



});
} else {
console.log('error');
}
}
request.send();
