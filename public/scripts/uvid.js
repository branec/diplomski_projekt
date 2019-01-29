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

  var d = new Date(exam.VrijemeOd);
  d = d.getUTCFullYear() + '-' +
    ('00' + (d.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + d.getUTCDate()).slice(-2) + ' ' + 
    ('00' + d.getUTCHours()).slice(-2) + ':' + 
    ('00' + d.getUTCMinutes()).slice(-2) + ':' + 
    ('00' + d.getUTCSeconds()).slice(-2);
  var td4 = document.createElement("td");
  td4.innerText = d;
  red.appendChild(td4);

  var d0 = new Date(exam.VrijemeDo);
  d0 = d0.getUTCFullYear() + '-' +
    ('00' + (d0.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + d0.getUTCDate()).slice(-2) + ' ' + 
    ('00' + d0.getUTCHours()).slice(-2) + ':' + 
    ('00' + d0.getUTCMinutes()).slice(-2) + ':' + 
    ('00' + d0.getUTCSeconds()).slice(-2);
  var td5 = document.createElement("td");
  td5.innerText = d0;
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
