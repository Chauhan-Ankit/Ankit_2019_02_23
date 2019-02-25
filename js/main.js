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
    console.log(getRandomObj)
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
        console.log("URL :: ", getRandomObj.thumbnailUrl)
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
    //let grp = can.item(0);
    //grp.addWithUpdate(shape);
    can.add(shape);
   // can.setCoords();
    can.renderAll();
    document.querySelector("#generateBtn").disabled = false;
}
/*
    if(can.getObjects().length > 7){
        window.alert("Maximun number of shapes in Canvas can be 8;");
        return false;
    }
	
	var left = can.getObjects().length * 65 +20;
    var top = 20;

    if(can.getObjects().length > 3){
        top = can.getHeight()/2 + 10;
        left = (can.getObjects().length - 4) *65 +20;
    }


    let grp = can.item(0);
    console.log(grp);
    console.log(grp.calcCoords())
    grp.addWithUpdate(shape);
    can.renderAll();
    */


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