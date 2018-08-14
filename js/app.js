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
  this.name = fileName.substring(0, fileName.length-4);
  this.clicked = 0;
  this.shown = 0;
  objArr.push(this);
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
    createChart(createCanvas());
    // createEndText();
    displayResults();
  }
}

// function that clears all of the images
function clearImgs(){
  while(appendTo.firstChild){
    appendTo.removeChild(appendTo.firstChild);
  }
}

// helper that creates the results display
function displayResults(){
  for(var i = 0; i < objArr.length; i++){
    var imageLI = document.createElement('li');
    var ul = document.getElementById('results');

    // Create the text inside
    imageLI.textContent = `${objArr[i].name}: ${objArr[i].clicked} ${(objArr[i].clicked === 1)?'vote':'votes'}`;
    ul.appendChild(imageLI);
  }
}

// helper function that tells the user the end of voting
function createEndText(){
  var finishText = document.createElement('h1');
  finishText.textContent = '25 Votes casted, results to the left';
  finishText.width = 650;
  appendTo.appendChild(finishText);
}

// function that creates a random color
function randomColor(){
  var color = '#';
  for(var i = 0; i < 6; i++){
    var hexString = Math.floor(Math.random()*15);
    color += hexString.toString(16);
  }

  // returns the color
  return color;
}

// function to create the canvas tag
function createCanvas(){
  var containingDiv = document.createElement('div');
  var canvas = document.createElement('canvas');
  containingDiv.appendChild(canvas);
  return canvas;
}

function createChart(chart){
  var ctx = chart.getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }
  });
}

// sets global variables
var amtToDisplay = 7;
var objArr = ImageObj.allImages;
var imgWidth = 600/amtToDisplay;
var appendTo = document.getElementById('mainSection');
var clicks = 0;

// initialize variables and creates images
initializeImg();
refreshImages();
console.log(randomColor());