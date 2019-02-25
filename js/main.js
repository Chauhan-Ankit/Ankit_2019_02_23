var canvasArray;
var jsonData;
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
        //canvas.setHeight(400);
       // canvas.setWidth(400);
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
       // console.log("URL :: ", getRandomObj.thumbnailUrl)
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

init();