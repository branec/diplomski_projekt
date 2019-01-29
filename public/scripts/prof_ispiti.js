var request = new XMLHttpRequest();
var url_string = window.location.href;
var url = new URL(url_string);
var user = url.searchParams.get("user");
var exam = url.searchParams.get("exam");
var predmet = url.searchParams.get("exam");

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
  td1.innerText = brojac.toString();
  brojac++;
  red.appendChild(td1);


  var td3 = document.createElement("td");
  td3.innerText = exam.Naziv;
  red.appendChild(td3);

  var td4 = document.createElement("td");
  var d0 = new Date(exam.VrijemeOd);
  d0 = d0.getUTCFullYear() + '-' +
    ('00' + (d0.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + d0.getUTCDate()).slice(-2) + ' ' + 
    ('00' + d0.getUTCHours()).slice(-2) + ':' + 
    ('00' + d0.getUTCMinutes()).slice(-2) + ':' + 
    ('00' + d0.getUTCSeconds()).slice(-2);
  td4.innerText = d0;
  red.appendChild(td4);

  var td5 = document.createElement("td");
  var d = new Date(exam.VrijemeDo);
  d = d.getUTCFullYear() + '-' +
    ('00' + (d.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + d.getUTCDate()).slice(-2) + ' ' + 
    ('00' + d.getUTCHours()).slice(-2) + ':' + 
    ('00' + d.getUTCMinutes()).slice(-2) + ':' + 
    ('00' + d.getUTCSeconds()).slice(-2);
  td5.innerText = d;
  red.appendChild(td5);

  var td6 = document.createElement("td");
  td6.innerText = exam.Prostorija;
  red.appendChild(td6);

  var td7 = document.createElement("td");
  td7.innerText = exam.Trajanje + " min";
  red.appendChild(td7);

  var td8 = document.createElement("td");
  td8.innerHTML = '<a href="/exams/updateExam?Id=' + exam.Id + '&predmet=' + predmet + '">Azuriraj ispit</a>'
  red.appendChild(td8);

  tablica.appendChild(red);
  
  console.log(exam);

  
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
console.log(user);
console.log(exam);
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
