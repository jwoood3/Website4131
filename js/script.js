///Displays a thumbnail image when the user mouses into the table row
function AppearImage(id) {
    document.getElementById(id).style.visibility = "visible";
}

///Hides the thumbnail image in the table after the user mouses out of the table row
function DissapearImage(id) {
    document.getElementById(id).style.visibility = "hidden";
}

///Determines the strength of password typed in based on contents of password
function passwordStrength() {
    let strength = 0;
    let passwordText = document.getElementById('password').value;
    let resultString;
    console.log(passwordText);

    //Password Strength Conditions
    //Length
    if (passwordText.length > 7) {
        strength+=1;
    }
    //Contains uppercase and lowercase letters
    if (passwordText.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
        strength+=1;
    }
    //Contains letters and numbers
    if (passwordText.match(/([a-zA-Z])/) && passwordText.match(/([0-9])/)) {
        strength+=1;
    }
    //Contains special symbols
    if (passwordText.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
        strength+=1;
    }

    //Check the password strength value to determine what the user should see
    if (passwordText.length <= 7) {
        resultString = 'Too Short!';
        resultString = resultString.fontcolor("red")
    }
    else if (strength < 2) {
        resultString = 'weak';
        resultString = resultString.fontcolor("red")

    }
    else if (strength == 2) {
        resultString = 'good';
        resultString = resultString.fontcolor("blue")
    }
    else {
        resultString = 'strong';
        resultString = resultString.fontcolor("green")
    }

    document.getElementById('result').innerHTML = resultString;
}

///Displays a random image from the randomPics array when the random button is pressed.
var randomPics = ['img/morrill_140522_2592.jpg', 'img/walter2.jpg', 'img/keller.jpg', 'img/lindHall.jpg', 'img/Shepherd.jpg', 'img/campusChair.jpg'];
var randomPicsDescriptions = ['Morril', 'Walter', 'Keller', 'Lind', 'Shepherd', 'Campus Chair'];

function pickImage() {
    var theImage = document.getElementById("sideImage");
    let randomPicIndex = Math.floor(Math.random() * randomPics.length);
    theImage.src = randomPics[randomPicIndex];
    theImage.alt = randomPicsDescriptions[randomPicIndex];
}

///This function rotates the side image when the rotate button is pressed.
var isRotating = false;
var degree = 0;

function rotateImage() {
    //Get the image and the button
    var ImageToRotate = document.getElementById('sideImage');
    var changeButtonText = document.getElementById('rotateButton')

    //Rotate image if not currently rotating
    //Stop rotation if currently rotating
    //This is done by pausing and unpausing the animation set in the css
    //located under the rotate class
    if (!isRotating) {
        ImageToRotate.style.animationPlayState = "running";
        changeButtonText.innerHTML = "Pause";
    }
    else {
        ImageToRotate.style.animationPlayState = "paused";
        changeButtonText.innerHTML = "Rotate";
    }

    //Update the state
    isRotating = !isRotating;
}

///The keyword input element can only be accessed by the user if they select
///the "other" option in the select dropdown menu. This function handles that.
function enableOrDisableInput() {
    let selectedValue = document.getElementById('findTypeID').value;
    if (selectedValue == "other") {
        document.getElementById('keywordBox').disabled = false;
    }
    else {
        document.getElementById('keywordBox').disabled = true;
    }   
}