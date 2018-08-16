'use strict';

// adds class arrays, one for used images and one for all images. also one for the object names
// Need to declare this or else we can't make shortcuts
ImageObj.names = [];
ImageObj.allImages = [];
ImageObj.usedImgs = [];

// sets global variables
var objArr = ImageObj.allImages;
var nameArr = ImageObj.names;
var colorArr = [null, 'Green', 'Blue'];
var appendTo = document.getElementById('mainSection');
var amtToDisplay = 3;
var imgWidth = 175;
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
  else { // else clear objects and create new items
    clearObjects();
  }
  // saves state when window closes
  window.onunload = window.onbeforeunload = saveVotes;
}

// image object constructors
function ImageObj(fileName, clicked = 0, shown = 0) {
  // takes the file name and parses it to give it a name
  ImageObj.names.push(fileName.substring(0, fileName.length-4));
  this.fileName = fileName;
  this.clicked = clicked;
  this.shown = shown;
  objArr.push(this);
}

// adds handler to each images
function addHandler(tag, objImg){
  // adds the listener
  tag.addEventListener('click', function(){
    // runs through each item that has been used, only adds to all 3 shown when 1 has been clicked
    for(var i = 0; i < ImageObj.usedImgs.length; i++){
      ImageObj.usedImgs[i].shown++; // adds to the shown value
    }
    // updates clicks
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
      } while(ImageObj.usedImgs.includes(objArr[objNum]) || newUsed.includes(objArr[objNum]));

      // finds the object and adds an event listener to it
      var objImg = objArr[objNum];
      newUsed.push(objImg);
      addHandler(createImageTag(objImg), objImg);
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

// function to create the image HTML
function createImageTag(imgObj){
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

// adds a reset listener to button
function addResetListener() {
  getFirstTag('footer').children[0].addEventListener('click', function(){
    clearObjects();
    refreshImages();
    saveVotes();
  });
}

// clears all objects and creates new ones
function clearObjects() {
  objArr = [];
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

// function that adds a listener to change color themes
function addColorListener(){
  var childLI = document.querySelectorAll('nav ul li');

  // you can't pass i into event listeners since they are the same scope and event handlers will execute after the for loop
  for(var i = 0; i < childLI.length; i++){
    // so you have to pass it into a closure function that is immediately invoked to use i
    (function(index){ // I hate life :(
      childLI[index].addEventListener('click', function(){
        changeColors(colorArr[index]);
      });
    })(i); // immediately invoke with i
  }
}

// function that actually sets all of the element's colors by adding classes
function changeColors(color){
  // makes sure to clear the colors first
  clearColors();

  // if no color, just clear
  if(color){
    // sets the classes for each tag to change the colors
    getFirstTagCL('header').add(`primary${color}`);
    getFirstTagCL('footer').add(`primary${color}`);
    getFirstTagCL('aside').add(`secondary${color}`);
    getFirstTagCL('body').add(`text${color}`);

    // uses a helper function to set a class to all children
    var ulColor = getFirstTag('ul');
    setChildrenColor(ulColor.children, `primary${color}`);
    setChildrenColor(document.getElementsByTagName('img'), `primary${color}`);
    setChildrenColor(document.getElementsByTagName('div'), `secondary${color}`);
  }
}

// adds class to the children
function setChildrenColor(tagCollection, className){
  for(var i = 0; i < tagCollection.length; i++){
    tagCollection[i].classList.add(className);
  }
}

function clearColors(){
  for(var i = 0; i < colorArr.length; i++){
    // sets the classes for each tag to change the colors
    getFirstTagCL('header').remove(`primary${colorArr[i]}`);
    getFirstTagCL('footer').remove(`primary${colorArr[i]}`);
    getFirstTagCL('aside').remove(`secondary${colorArr[i]}`);
    getFirstTagCL('body').remove(`text${colorArr[i]}`);

    // uses a helper function to set a class to all children
    var ulColor = getFirstTag('ul');
    removeChildrenColor(ulColor.children, `primary${colorArr[i]}`);
    removeChildrenColor(document.getElementsByTagName('img'), `primary${colorArr[i]}`);
    removeChildrenColor(document.getElementsByTagName('div'), `secondary${colorArr[i]}`);
  }
}

// adds class to the children
function removeChildrenColor(tagCollection, className){
  for(var i = 0; i < tagCollection.length; i++){
    tagCollection[i].classList.remove(className);
  }
}

// returns the classlist of a tag because I hate typing
function getFirstTagCL(tag){
  return getFirstTag(tag).classList;
}

// same as above but for the first tag
function getFirstTag(tag){
  return document.getElementsByTagName(tag)[0];
}

// function that saves votes to local storage
function saveVotes(){
  localStorage.setItem('items', JSON.stringify(objArr));
}

// initialize variables and creates images
initializeImg();
addColorListener();
addResetListener();
outOfTB();
refreshImages();