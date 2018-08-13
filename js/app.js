'use strict';

function initializeImg() {
  new ImageObj('bag.jpg');
  new ImageObj('banana.jpg');
  new ImageObj('bathroom.jpg');
  new ImageObj('breakfast.jpg');
  new ImageObj('bubblegum.jpg');
  new ImageObj('boots.jpg');
  new ImageObj('chair.jpg');
  new ImageObj('cthulhu.jpg');
  new ImageObj('dog-duck.jpg');
  new ImageObj('dragon.jpg');
  new ImageObj('pen.jpg');
  new ImageObj('pet-sweep.jpg');
  new ImageObj('scissors.jpg');
  new ImageObj('shark.jpg');
  new ImageObj('sweep.png');
  new ImageObj('tauntaun.jpg');
  new ImageObj('unicorn.jpg');
  new ImageObj('usb.gif');
  new ImageObj('water-can.jpg');
  new ImageObj('wine-glass.jpg');
}

function ImageObj(fileName) {
  this.fileName = fileName;
  this.clicked = 0;
  this.shown = 0;
  ImageObj.allImages.push(this);
}
ImageObj.allImages = [];
ImageObj.usedImgs = [];

function createImage(imgObj){
  var imgTag = document.createElement('img');
  imgTag.src = `img/${imgObj.fileName}`;
  imgTag.alt = imgObj.fileName;
  imgTag.width = imgWidth;
  appendTo.appendChild(imgTag);

  return imgTag;
}

function addHandler(tag, objImg){
  tag.addEventListener('click', function(){
    objImg.clicked++;
    objImg.shown++;
    refreshImages();
    addOldImgs();
  });
}

function refreshImages(){
  clearImgs();

  var newUsed = [];
  for(var i = 0; i < amtToDisplay; i++){
    var objNum;
    do {
      objNum = Math.floor(Math.random()*objArr.length);
    } while(ImageObj.usedImgs.includes(objNum) || newUsed.includes(objNum));

    var objImg = objArr[objNum];
    newUsed.push(objNum);
    addHandler(createImage(objImg), objImg);
  }

  ImageObj.usedImgs = newUsed;

}

function clearImgs(){
  while(appendTo.firstChild){
    appendTo.removeChild(appendTo.firstChild);
  }
}

function addOldImgs(){

}

var amtToDisplay = 3;
var objArr = ImageObj.allImages;
var imgWidth = 600/amtToDisplay;
var appendTo = document.getElementsByTagName('main')[0];

initializeImg();
refreshImages();