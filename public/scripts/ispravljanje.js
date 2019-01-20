
var request = new XMLHttpRequest();
var url_string = window.location.href;
var url = new URL(url_string);
var user = url.searchParams.get("user");
var exam = url.searchParams.get("exam");
var contexts = new Array();
var canvases = new Array();

    request.open('GET', `http://localhost:3000/exams_per_prof/${user}`, true);
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


request.open('GET', `http://localhost:3000/usersbyprof/${user}`, true);
request.onload = function () {
// Begin accessing JSON data here
var data = JSON.parse(this.response);
if (request.status >= 200 && request.status < 400) {
    var dropdown1 = document.getElementById("student-list");
data.forEach(user => {
    var option1 = document.createElement("option");
    option1.value = user.Id;
    option1.innerText = user.Ime +" "+ user.Prezime;
    dropdown1.appendChild(option1);


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



var context;
$('#ispravi-button').click(function(){
    var ispit = $( "#exams-list option:selected" ).val();
    var korisnik = $( "#student-list option:selected" ).val();


    request.open('GET', `http://localhost:3000/uvid/${ispit}/${korisnik}`, true);
    request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
        
   
        var slike = data.slike;
        var qrkod = data.kosuljica.Qrkod;
        var kosuljica = document.getElementById("sheet-id");
        kosuljica.innerText = qrkod;
        var images = document.getElementById("canvas-images-ispravljanje");
var brojac = 0;


        slike.forEach(slika =>{
            var base_image = new Image();
            base_image.src =  `http://localhost:3000/slika/${slika.Id}`;
       
            base_image.onload = function(){
    
                var container = document.createElement('div');
                container.setAttribute('class','container-canvas');
    
    
                var barcodeCanvas = document.createElement("canvas");
                barcodeCanvas.setAttribute('id', 'canvas');
                barcodeCanvas.width = 640;
                barcodeCanvas.height = 480
                barcodeCanvas.onmousemove = mouseMove;
                barcodeCanvas.onmousedown = mouseDown;
                barcodeCanvas.onmouseup = mouseUp;
                barcodeCanvas.onmouseleave = mouseLeave;
                context = barcodeCanvas.getContext('2d');
                context.drawImage(base_image, 0, 0, 640, 480);
                contexts.push(context);
                canvases.push(barcodeCanvas);
                
                container.appendChild(base_image);
                container.appendChild(barcodeCanvas);
                images.appendChild(container);
              }
    


        });
      
       
    
    } else {
    console.log('error');
    }
    }
    request.send();


});




function mouseDown(e){
    var mouseX = e.pageX - document.getElementById('canvas').offsetParent.offsetLeft;
    var mouseY = e.pageY - document.getElementById('canvas').offsetParent.offsetTop;
          
    paint = true;
    addClick(e.pageX - document.getElementById('canvas').offsetParent.offsetLeft, e.pageY - document.getElementById('canvas').offsetParent.offsetTop);
    redraw();
  }


function mouseMove(e){
    if(paint){
      addClick(e.pageX - document.getElementById('canvas').offsetParent.offsetLeft, e.pageY - document.getElementById('canvas').offsetParent.offsetTop, true);
      redraw();
    }
  }

function mouseUp(e){
    paint = false;
  }

 function mouseLeave(e){
    paint = false;
  }


var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function redraw(){
    contexts[0].clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    
    contexts[0].strokeStyle = "#df4b26";
    contexts[0].lineJoin = "round";
    contexts[0].lineWidth = 5;
              
    for(var i=0; i < clickX.length; i++) {		
      contexts[0].beginPath();
      if(clickDrag[i] && i){
        contexts[0].moveTo(clickX[i-1], clickY[i-1]);
       }else{
         contexts[0].moveTo(clickX[i]-1, clickY[i]);
       }
       contexts[0].lineTo(clickX[i], clickY[i]);
       contexts[0].closePath();
       contexts[0].stroke();
    }
  }



  
  $("#send-image").click(function() {

    var imageData = contexts[0].getImageData(0, 0, 640, 480);

    var file = imageData.data;
    var formData = new FormData();
    formData.append('file', file);
  

    const urlParams = new URLSearchParams(window.location.search);
    const user = $( "#student-list option:selected" ).val();
    var exam = $( "#exams-list option:selected" ).val();
    var kosuljica = document.getElementById("sheet-id").innerText;

   
 
    var j;
    for (j = 0; j < 1; j++) { 

    var blobBin = atob(canvases[0].toDataURL().split(',')[1]);
    var array = [];
    for(var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }
    var file=new Blob([new Uint8Array(array)], {type: 'image/png'});
    
    var formdata = new FormData();
    formdata.append("file", file);
    $.ajax({
       url: "http://localhost:3000/uploaddraw?user="+ user + "&exam=" + exam + "&sheet=" + kosuljica + "&rbr=" + j,
       type: "POST",
       data: formdata,
       processData: false,
       contentType: false,
    }).done(function(respond){

    });


    }

    alert("Slike uspjesno poslane!");
    
    
   }); 