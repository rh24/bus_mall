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
  clearTag(appendTo);

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
    // displays results and gets the name array
    var nameDataColors = displayResults();
    // here is where you notify users
    createChart(createCanvas(), nameDataColors[0], nameDataColors[1], nameDataColors[2], nameDataColors[3]);
    // createEndText();
    createEndText();
  }
}

// function that clears all of the images
function clearTag(tag){
  while(tag.firstChild){
    tag.removeChild(tag.firstChild);
  }
}

// helper that creates the results display
function displayResults(){
  var name = [];
  var clicked = [];
  var colors = [];
  var borderColors = [];
  for(var i = 0; i < objArr.length; i++){
    var imageLI = document.createElement('li');
    var ul = document.getElementById('results');

    // generates arrays for name, clicked count, colors to put in chart
    name[i] = objArr[i].name;
    clicked[i] = objArr[i].clicked;
    colors[i] = randomColor('.4');
    borderColors[i] = randomColor('1');

    // Create the text inside
    imageLI.textContent = `${objArr[i].name}: ${objArr[i].clicked} ${(objArr[i].clicked === 1)?'vote':'votes'}`;
    ul.appendChild(imageLI);
  }

  // returns an array of name, click count, colors for later
  return [name, clicked, colors, borderColors];
}

// helper function that tells the user the end of voting
function createEndText(){
  var finishText = document.createElement('h2');
  finishText.textContent = '25 Votes casted, results to the left';
  finishText.width = 650;
  
  // appends text to let user know to look at results
  var bodyText = document.getElementById('instructions');
  clearTag(bodyText);
  bodyText.appendChild(finishText);
}

// function that creates a random color
function randomColor(opa){
  var color = 'rgba(';
  for(var i = 0; i < 3; i++){
    var hexString = Math.floor(Math.random()*256);
    color += `${hexString}, `;
  }

  // returns the color
  return `${color} ${opa})`;
}

// function to create the canvas tag
function createCanvas(){
  var containingDiv = document.createElement('div');
  var canvas = document.createElement('canvas');
  containingDiv.appendChild(canvas);
  appendTo.appendChild(containingDiv);
  return canvas;
}

// function that creates the chart
function createChart(chart, name, clicked, colors, borderColors){
  var ctx = chart.getContext('2d');
  // creates the actual chart
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: name,
      datasets: [{
        label: '# of Votes',
        data: clicked,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1
      }]
    },
    // options for the chart
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true,
            stepSize: 1
          }
        }],
        xAxes: [{
          ticks: {
            autoSkip: false,
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