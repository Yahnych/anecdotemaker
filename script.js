/*jshint indent: 2, eqeqeq: true, strict: true, trailing: true, maxlen: 500, browser: true, devel: true*/
(function() {
  "use strict";

  var className, grades, students, studentName,
    currentStudent, currentClass, template, templateElement,
    button, qualityOption, customSentence, anecdoteOutput;

  //Create an empty object to hold the JSON data.
  var data = {};
  //Create a new xhr objet.
  var xhr = new XMLHttpRequest();
  //Use xhr to load the JSON file.
  xhr.open("GET", "data.json", true);
  xhr.addEventListener("readystatechange", function() {
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
    
    grades.forEach(function(grade) {
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
    students.forEach(function(student) {
      var el = document.createElement("option");
      el.textContent = student.name;
      el.value = student.name;
      studentName.appendChild(el);
    });
    studentNameHandler();
    currentClass = data[className.value];
    template = data[className.value].template
    templateElement.value = template
  }

  function studentNameHandler() {
    students = data[className.value].students;
    students.some(function(student) {
      if (student.name === studentName.value) {
        currentStudent = student;
        return true;
      }
    });
  }

  function makeAnnecdote() {
    var gender, quality, anecdote, name, words;

    quality = currentStudent.quality;
    gender = currentStudent.gender;
    name = currentStudent.name;
    console.log("Name: " + name.value);
    console.log("Gender: " + gender);
    console.log("Quality: " + quality);
    console.log("Sentence: " + customSentence.value);
    console.log("Template: " + template.value);
    
    //Replace the  [name]
    anecdote = template.split("[name]").join(name);
    
    //Replace the  [quality]
    //anecdote = anecdote.split("[quality]").join(quality);
    
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
    
    if (quality === "1") {
      anecdote = anecdote.split("[an excellent, a very good, a good]").join("an excellent");
      anecdote = anecdote.split("[are well developed, are developing well, are developing]").join("are well developed");
      anecdote = anecdote.split("[a highly imaginative, an imaginative, an interesting]").join("a highly imaginative");
      anecdote = anecdote.split("[very well constructed, well constructed, acceptably constructed]").join("very well constructed");
      anecdote = anecdote.split("[an excellent, a very good, a good]").join("an excellent");
      anecdote = anecdote.split("[produced artwork of a high standard and showed an impressive commitment, produced good quality work and will continue to improve with practise, shows an ability in art but should remember to maintain focus when in class]").join("produced artwork of a high standard and showed an impressive commitment");
    }
    if (quality === "2") {
      anecdote = anecdote.split("[an excellent, a very good, a good]").join("a very good");
      anecdote = anecdote.split("[are well developed, are developing well, are developing]").join("are developing well");
      anecdote = anecdote.split("[a highly imaginative, an imaginative, an interesting]").join("an imaginative");
      anecdote = anecdote.split("[very well constructed, well constructed, acceptably constructed]").join("well constructed");
      anecdote = anecdote.split("[an excellent, a very good, a good]").join("a very good");
      anecdote = anecdote.split("[produced artwork of a high standard and showed an impressive commitment, produced good quality work and will continue to improve with practise, shows an ability in art but should remember to maintain focus when in class]").join("produced good quality work and will continue to improve with practise");
    }
    if (quality === "3") {
      anecdote = anecdote.split("[an excellent, a very good, a good]").join("a good");
      anecdote = anecdote.split("[are well developed, are developing well, are developing]").join("are developing");
      anecdote = anecdote.split("[a highly imaginative, an imaginative, an interesting]").join("an interesting");
      anecdote = anecdote.split("[very well constructed, well constructed, acceptably constructed]").join("acceptably constructed");
      anecdote = anecdote.split("[an excellent, a very good, a good]").join("a good understanding");
      anecdote = anecdote.split("[produced artwork of a high standard and showed an impressive commitment, produced good quality work and will continue to improve with practise, shows an ability in art but should remember to maintain focus when in class]").join("shows an ability in art but should remember to maintain focus when in class");
    }
    
    //Add the custom sentence
    anecdote += " " + customSentence.value;
    
    console.log("Annecdote: " + anecdote);
    anecdote = anecdote.replace(/(\r\n|\n|\r)/gm,"");
    anecdoteOutput.innerHTML = anecdote;
    
    /*
    words = template.split(" ");
    console.log(name);
    words = words.map(function(word) {
      if (word === "[name]." || word === "[name]") {
        word = name;
      }
      if (word === "[quality]." || word === "[quality]") {
        word = quality;
      }
      if (gender.charAt(0) === "b") {
        if (word === "[Her].") {
          word = "Him.";
        }
        if (word === "[her].") {
          word = "him.";
        }
        if (word === "[Her]") {
          word = "Him";
        }
        if (word === "[her]") {
          word = "him.";
        }
      } else {

      }
      return word;
    })
    console.log(words.toString());
    */
  }

}());