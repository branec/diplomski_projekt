var request = new XMLHttpRequest();
var url_string = window.location.href;
var url = new URL(url_string);
var user = url.searchParams.get("user");
var exam = url.searchParams.get("exam");
    request.open('GET', `http://localhost:3000/uvid_student/${exam}/${user}`, true);
    request.onload = function () {
// Begin accessing JSON data here
var data = JSON.parse(this.response);
if (request.status >= 200 && request.status < 400) {
    
    var ispit = document.getElementById('ispit-header');
    ispit.innerText = data.kosuljica.Naziv + " , " + data.kosuljica.ImePredmeta;

    var kosuljicaNaziv = document.getElementById('sheet-header');
    kosuljicaNaziv.innerHTML = data.kosuljica.Qrkod;

    var bodovi = document.getElementById('bodovi-header');
    bodovi.innerText = data.ukupnoBodova;

    var images = document.getElementById("canvas-images-ispravljanje");
    var container = document.createElement('div');
    container.setAttribute('class','container-canvas');


   

    var base_image = new Image();
    base_image.src =  `http://localhost:3000/slika/${ data.slike[0].Id}`;

    base_image.onload = function(){

        container.appendChild(base_image);

        var base_image1 = new Image();
        base_image1.src =  `http://localhost:3000/slika/${ data.slike[1].Id}`;

        base_image1.onload = function(){


            container.appendChild(base_image1);
            
            images.appendChild(container);
        }

        
        
    }

   
  


} else {
console.log('error');
}
}
request.send();
