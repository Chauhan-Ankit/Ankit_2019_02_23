var canvasArray;
var jsonData;
var activeCanvas = null;
var globalVal = {
	'text':{'fontSize':'10'},
	'image':{'top':'0','originX':'left','originY':'top'},
	'circle':{'radius':'25'}
	}

function init(){
    fetch("https://jsonplaceholder.typicode.com/photos")
    .then((resp) => resp.json()) //Transform the data into json
    .then(function(data) {
        jsonData = Object.values(data);
        document.querySelector("#randomCan").disabled = false;
    });
}

function createRandomCanvas(){
    let canvasContainer = document.querySelector("#canvasContainer");
    removeChildren(canvasContainer);
    let randomN = getRandomNumber(2,4);
    canvasArray = [];

    for(var i=1; i<= randomN; i++){
        let canvas = document.createElement("CANVAS");
        canvas.setAttribute("id", "canvas-"+i);
        canvasContainer.appendChild(canvas);
        canvas = new fabric.Canvas("canvas-"+i);
        canvas.observe("object:moving", dragHandler);
        

        canvas.on('mouse:over', function() {
            activeCanvas = canvas;
        });

        canvas.on('mouse:out', function() {
            activeCanvas = null;
        });

        canvasArray.push(canvas);
    }

    addCanvasId(randomN);
    document.querySelector("#generateBtn").disabled = false;
}

function generateShapes(){
    var shape;
    let e1 = document.querySelector("#canvasSelect");
    let selectedCanvas = e1.options[e1.selectedIndex].value;
      
    let can = canvasArray[parseInt(selectedCanvas.split("-")[1]) - 1];
    let rndNmbr = getRandomNumber(0,jsonData.length);

    let getRandomObj = jsonData[rndNmbr];
    let selectedId = getRandomObj.id;

    document.querySelector("#generateBtn").disabled = true;
    
    if(getRandomObj.albumId >= 100){
        let title = getRandomObj.title;
        shape = new fabric.Text(title, globalVal.text);
        updateCanvas(can, shape)
    }
    else if(selectedId % 2 == 0){
        let title = getRandomObj.title;
        shape = new fabric.Text(title, globalVal.text);
        updateCanvas(can, shape)
    }
    else if(Math.abs(selectedId % 2) == 1){
        let imgObj = new Image();
        imgObj.src = getRandomObj.thumbnailUrl;
        imgObj.onload = function () 
        {
           console.log("Loaded....")
           shape = new fabric.Image(imgObj, globalVal.image);
           shape.setCoords();
           updateCanvas(can, shape)
        }
    }  
}
   
function updateCanvas(can, shape){
    can.add(shape);
    can.renderAll();
    document.querySelector("#generateBtn").disabled = false;
}

function addCanvasId(_rnd){
   let canvasSelect = document.querySelector("#canvasSelect");
   removeChildren(canvasSelect);

   for(var i=1; i<= _rnd; i++){
       canvasSelect.options[canvasSelect.options.length] = new Option('Canvas '+i,'canvas-'+i);
   }
}

function removeChildren(_par){
    while(_par.hasChildNodes()){
        _par.removeChild(_par.firstChild);
    }
}

function getRandomNumber(_min,_max){
    return  Math.floor(Math.random()*(_max-_min+1)+_min);
}

function dragHandler(event){
    var activeObject;
    if(activeCanvas){
        activeObject = activeCanvas.getActiveObject();
    }
    if(activeObject){
    activeObject.clone(function (c) {
        dragImage = c;
       // console.log(c);
        if(c.type == "image"){
            $('#dragImage').attr('src',c.src);
        }
        else{
            $('#dragImage').attr('src','');
            $('#dragImage').attr('alt',c.text);
        }    
    });
        activeCanvas.remove(activeObject);
    }
}

function mousemove(e){
   // console.log(document.getElementById("dragImage"))
    if (dragImage != null) {

        document.getElementById("dragImage").style.display = "block";
        document.getElementById("dragImage").style.left = e.clientX;
        document.getElementById("dragImage").style.top = e.clientY;
        return;
    }else{
        document.getElementById("dragImage").style.display = "none";
    }
}

function mouseup(event){
    if (dragImage != null) {
        $(canvasArray).each(function (i, v) {
            if (Intersect([event.clientX, event.clientY],$(v.wrapperEl))) {
                dragImage.left = event.clientX - $(v.wrapperEl).offset().left;
                dragImage.top = event.clientY - $(v.wrapperEl).offset().top;
                v.add(dragImage);
            }              

        });

        dragImage = null;
    }
}

function Intersect(point, element) {
    return (      point[0] > element.offset().left
               && point[0] < element.offset().left + element.width()
               && point[1] < element.offset().top + element.height()
               && point[1] > element.offset().top
            );    
}

window.addEventListener("mousemove", mousemove);
window.addEventListener("mouseup", mouseup);

init();