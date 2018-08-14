'use strict';

// initializes all the images by making new objects
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

// image object constructors
function ImageObj(fileName) {
  this.fileName = fileName;
  this.clicked = 0;
  this.shown = 0;
  ImageObj.allImages.push(this);
}
// adds two class arrays, one for used images and one for all images
ImageObj.allImages = [];
ImageObj.usedImgs = [];

// function to create the image HTML
function createImage(imgObj){
  var imgTag = document.createElement('img');
  imgTag.src = `img/${imgObj.fileName}`;
  imgTag.alt = imgObj.fileName;
  imgTag.width = imgWidth;
  imgTag.height = imgWidth;
  appendTo.appendChild(imgTag);

  // returns the tag
  return imgTag;
}

// adds handler to each images
function addHandler(tag, objImg){
  objImg.shown++; // adds to shown

  // adds the listerner
  tag.addEventListener('click', function(){
    objImg.clicked++;
    clicks++;
    refreshImages();
  });
}

// refreshes the images on the page
function refreshImages(){
  // clears all the images
  clearImgs();

  if(clicks < 25){
    // creates the amount of images according to how many the user wants
    var newUsed = [];
    for(var i = 0; i < amtToDisplay; i++){
      var objNum;
      // while the images were previously used or have just been added this iteration, find another image
      do {
        objNum = Math.floor(Math.random()*objArr.length);
      } while(ImageObj.usedImgs.includes(objNum) || newUsed.includes(objNum));

      // finds the object and adds an event listener to it
      var objImg = objArr[objNum];
      newUsed.push(objNum);
      addHandler(createImage(objImg), objImg);
    }

    // resets the previously used array, updates the click count
    ImageObj.usedImgs = newUsed;
  }
  else {
    // here is where you notify users
    displayResults();
  }
}

// function that clears all of the images
function clearImgs(){
  while(appendTo.firstChild){
    appendTo.removeChild(appendTo.firstChild);
  }
}

function displayResults(){
  for(var i = 0; i < ImageObj.allImages.length; i++){
    var imageLI = document.createElement('li');
    var ul = document.getElementById('results');
    
    imageLI.textContent = `${ImageObj.allImages[i].fileName}: ${ImageObj.allImages[i].clicked} votes`;
    ul.appendChild(imageLI);
  }
}

// sets global variables
var amtToDisplay = 1;
var objArr = ImageObj.allImages;
var imgWidth = 600/amtToDisplay;
var appendTo = document.getElementById('mainSection');
var clicks = 0;

// initialize variables and creates images
initializeImg();
refreshImages();