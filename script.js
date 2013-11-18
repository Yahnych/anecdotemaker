/*jshint indent: 2, eqeqeq: true, strict: true, trailing: true, maxlen: 500, browser: true, devel: true*/
(function () {
  "use strict";

  var className, grades, students, studentName,
    currentStudent, currentClass, template, templateElement,
    button, qualityOption, customSentence, anecdoteOutput, generalComment;

  /*Next: Convert markdown to JSON
  //Load a markdown document
  var markdown = "";
  //Create a new xhr objet.
  var xhr2 = new XMLHttpRequest();
  //Use xhr to load the JSON file.
  xhr2.open("GET", "test.markdown", true);
  xhr2.addEventListener("readystatechange", function () {
    //Check to make sure the file has loaded properly.
    if (xhr2.status === 200 && xhr2.readyState === 4) {
      //Convert the JSON data file into an ordinary object
      markdown = xhr2.responseText;
      console.log("markdown loaded");
      //var temp = jsonmark.parse(markdown);
      console.log(temp);
    }
  });
  //Send the request to load the file
  xhr2.send();
  */
  
  
  //Create an empty object to hold the JSON data.
  var data = {};
  //Create a new xhr objet.
  var xhr = new XMLHttpRequest();
  //Use xhr to load the JSON file.
  xhr.open("GET", "data.json", true);
  xhr.addEventListener("readystatechange", function () {
    //Check to make sure the file has loaded properly.
    if (xhr.status === 200 && xhr.readyState === 4) {
      //Convert the JSON data file into an ordinary object
      data = JSON.parse(xhr.responseText);
      console.log("data loaded");
      initialize();
    }
  });
  //Send the request to load the file
  xhr.send();

  function initialize() {
    className = document.querySelector("#class");
    grades = Object.keys(data);
    studentName = document.querySelector("#studentName");
    templateElement = document.querySelector("#template");
    button = document.querySelector("#button");
    button.addEventListener("mousedown", makeAnnecdote, false);
    qualityOption = document.querySelector("#quality");
    customSentence = document.querySelector("#customSentence");
    anecdoteOutput = document.querySelector("#anecdoteOutput");

    grades.forEach(function (grade) {
      var el = document.createElement("option");
      el.textContent = grade;
      el.value = grade;
      className.appendChild(el);
    });
    classNameHandler();
    studentNameHandler();
    className.addEventListener("change", classNameHandler, false);
    studentName.addEventListener("change", studentNameHandler, false);

  }

  function classNameHandler() {
    //Remove any previous options
    while (studentName.firstChild) {
      studentName.removeChild(studentName.firstChild);
    }
    students = data[className.value].students;
    students.forEach(function (student) {
      var el = document.createElement("option");
      el.textContent = student.name;
      el.value = student.name;
      studentName.appendChild(el);
    });
    studentNameHandler();
    currentClass = data[className.value];
    template = data[className.value].template;
    generalComment = data[className.value].general;
    templateElement.value = template;
  }

  function studentNameHandler() {
    students = data[className.value].students;
    students.some(function (student) {
      if (student.name === studentName.value) {
        currentStudent = student;
        return true;
      }
    });
  }

  function makeAnnecdote() {
    var gender, quality, anecdote, name, matches, stringArrays;

    quality = currentStudent.quality;
    gender = currentStudent.gender;
    name = currentStudent.name;

    //Replace the  [name]
    //anecdote = template.replace(/\[name\]/g, name);
    anecdote = template.split("[name]").join(name);

    //Set the correct gender
    if (gender.charAt(0) === "b") {
      anecdote = anecdote.split("to [her]").join("to him");
      anecdote = anecdote.split("[her]").join("his");
      anecdote = anecdote.split("[Her]").join("His");
      anecdote = anecdote.split("[she]").join("he");
      anecdote = anecdote.split("[She]").join("He");
      anecdote = anecdote.split("[his]").join("his");
      anecdote = anecdote.split("[His]").join("His");
      anecdote = anecdote.split("[he]").join("he");
      anecdote = anecdote.split("[He]").join("He");
    }
    if (gender.charAt(0) === "g") {
      anecdote = anecdote.split("[his]").join("her");
      anecdote = anecdote.split("[His]").join("Her");
      anecdote = anecdote.split("[he]").join("she");
      anecdote = anecdote.split("[He]").join("She");
      anecdote = anecdote.split("[her]").join("her");
      anecdote = anecdote.split("[Her]").join("Her");
      anecdote = anecdote.split("[she]").join("she");
      anecdote = anecdote.split("[She]").join("She");
    }

    //Now we need to customize the quality messages
    //1. Find all the text in square brackets and convert them to arrays
    matches = anecdote.match(/\[(.*?)\]/g);

    //2. Convert each submatch into an array of strings
    stringArrays = matches.map(function (match) {
      match = match.slice(1, -1).split(/\s*,\s*/);
      return match;
    });
    //console.log(matches);
    //If the stringArrays have more than one element, then we
    //know that it contains some options
    stringArrays.forEach(function (stringArray, index) {
      if (stringArray.length !== 0) {
        //This is the fun part
        //a. Get a reference to the original string that's 
        //surrounded by square brackets
        var originalString = matches[index];
        //b. Select the element from the new stringArray that matches
        //the student's quality (1,2, or 5)
        var newString = stringArray[quality - 1];
        //c. Replace the orginalString with the newString
        anecdote = anecdote.split(originalString).join(newString);
      }
    });

    //Build the anecdote
    anecdote += " " + customSentence.value;
    anecdote = anecdote.replace(/(\r\n|\n|\r)/gm, "");
    anecdoteOutput.innerHTML = generalComment + "\n\n" + anecdote;
  }
}());