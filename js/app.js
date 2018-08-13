function ImageObj(fileName) {
  this.fileName = fileName;
  this.clicked = 0;
  this.shown = 0;
  ImageObj.allImages.push(this);
}
ImageObj.allImages = [];

function createImage(imgObj){
  var appendTo = document.getElementsByTagName('main')[0];
  var imgTag = document.createElement('img');
  imgTag.src = `img/${imgObj.fileName}`;
  imgTag.alt = imgObj.fileName;
  appendTo.appendChild(imgTag);
}

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

var amtToDisplay = 3;
var objArr = ImageObj.allImages;

for(var i = 0; i < amtToDisplay; i++){
  var objNum = Math.floor(Math.random()*objArr.length);
  var objImg = objArr[objNum];
  objArr.splice(objNum, 1);
  createImage(objImg);
}