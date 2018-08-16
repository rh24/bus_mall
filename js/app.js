'use strict';

// adds class arrays, one for used images and one for all images. also one for the object names
// Need to declare this or else we can't make shortcuts
ImageObj.names = [];
ImageObj.allImages = [];
ImageObj.usedImgs = [];

// sets global variables
var objArr = ImageObj.allImages;
var nameArr = ImageObj.names;
var amtToDisplay = 3;
var imgWidth = 175;
var appendTo = document.getElementById('mainSection');
var clicks = 0;

// initializes all the images by making new objects
function initializeImg() {
  // loads items from local storage
  var loadedItems = JSON.parse(localStorage.getItem('items'));
  // if it exists, load data from previous
  if(loadedItems) {
    for (var i = 0; i < loadedItems.length; i++){
      new ImageObj(loadedItems[i].fileName, loadedItems[i].clicked, loadedItems[i].shown);
    }
  }
  else { // else create new items
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
  // saves state when window closes
  window.onunload = window.onbeforeunload = saveVotes;
}

// image object constructors
function ImageObj(fileName, clicked = 0, shown = 0) {
  ImageObj.names.push(fileName.substring(0, fileName.length-4));
  this.fileName = fileName;
  this.clicked = clicked;
  this.shown = shown;
  objArr.push(this);
}

// function to create the image HTML
function createImage(imgObj){
  var imgTag = document.createElement('img');
  imgTag.src = `img/${imgObj.fileName}`;
  imgTag.alt = imgObj.fileName;

  // change size if less than 3 items
  if(amtToDisplay < 3){
    imgWidth = 418/amtToDisplay;
  }else{
    imgWidth = 175;
  }

  // sets with and height
  imgTag.width = `${imgWidth}`;
  imgTag.height = `${imgWidth}`;
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
    // saves all of our results to local storage
    saveVotes();
    // displays results and gets the name array
    var dataColors = displayResults();
    // here is where you notify users
    createChart(createCanvas(), dataColors[0], dataColors[1], dataColors[2]);
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
  // var name = [];
  var clicked = [];
  var colors = [];
  var borderColors = [];
  for(var i = 0; i < objArr.length; i++){
    var imageLI = document.createElement('li');
    var ul = document.getElementById('results');

    // generates arrays for clicked count, colors to put in chart
    clicked[i] = objArr[i].clicked;
    colors[i] = randomColor('.4');
    borderColors[i] = randomColor('1');

    // Create the text inside
    imageLI.textContent = `${nameArr[i]}: ${objArr[i].clicked} ${(objArr[i].clicked === 1)?'vote':'votes'}`;
    ul.appendChild(imageLI);
  }

  // returns an array of name, click count, colors for later
  return [clicked, colors, borderColors];
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
function createChart(chart, clicked, colors, borderColors){
  var ctx = chart.getContext('2d');
  // creates the actual chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: nameArr,
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

// function for refreshing images when 
function outOfTB(){
  var textbox = document.getElementById('itemNum');
  textbox.addEventListener('blur', function(){

    // grabs user input
    var userInputNum = Number(textbox.value);
    // sets to max 10 if the number is greater than 10 or NaN
    if(userInputNum > 10 || isNaN(userInputNum)){
      userInputNum = 10;
      textbox.value = 10;
    }
    amtToDisplay = userInputNum;
    refreshImages();
  });
}

// function that saves votes to local storage
function saveVotes(){
  localStorage.setItem('items', JSON.stringify(objArr));
}

// initialize variables and creates images
initializeImg();
//addCloseListener();
outOfTB();
refreshImages();