//game type (multiple choice or true/false)
//category (not specified will be any category)
//difficulty
//number of questions(1 to 50) - check the available number of questions based on the category and difficulty to see if there is enough questions for the specified # of questions
//countdown timer for each question
//show correct answer when time runs out
//wait a few seconds then move to the next question
//generate a token for the game session (so it won't have duplicate questions) - good to have?
//parse the question and answers from the response
//plan to catch response_code other than 0 (success)
//end of game, show correct answer count, incorrect count, and option to restart the game without page reload

//format in an array of objects:[{category: "", type: "", difficulty: "", question: "", correct_answer: "", type: "", incorrect_answers: []}]
var timer;
var categoryList = [];

$(window).on("load", function() {
  getCategory();
  $(".triviaModal").modal("show");
});

$(document).ready(function() {
  $(".checkAnswer").hide();
  $(".restartGame").hide();
  $(".correctCount").html("0");
  $(".incorrectCount").html("0");
  $(".getData").on("click", function() {
    var gameType = getInput("#questionType", "any");
    var questionCategoryID = getInput("#questionCategory", "any");
    var questionDifficulty = getInput("#questionDifficulty", "any");
    var questionAmount = getInput("#questionQuantity", "10");
    var URL = constructAPI_URL(
      gameType,
      questionCategoryID,
      questionDifficulty,
      questionAmount
    );
    console.log(URL);
    $.getJSON(URL, function(responseData) {
      //the json data retrived will be converted to an object, which contains (response_code and results)
      //store the responseData object in a new gameData object for the rest of the game
      console.log(responseData);
      if (responseData.response_code === 0) {
        triviaGame.startGame(responseData.results);
        $(".triviaModal").modal("hide");
        $(".restartGame").hide();
        $(".checkAnswer").show();
      } else if (
        responseData.response_code === 1 ||
        responseData.response_code === 2
      ) {
        alert("Error, please adjust your selection and try again");
      }
    });
  });

  $(".checkAnswer").on("click", function() {
    var option = $("input:radio:checked", ".triviaOption").val();
    //if non of the option buttons are checked, option will be undefined
    if (option !== undefined) {
      clearInterval(timer);
      //hide the check button so user's don't accidentally click twice
      $(".checkAnswer").hide();
      //if user answers correctly
      if (triviaGame.checkAnswer(option)) {
        // change this to circule correct answer and get rid of other bad answers
        // change triviaAnswer div to display timer, correct number and incorrect number
        $(".triviaAnswer").html("You are correct!");
        //wait a few seconds and display the next question
        setTimeout(function() {
          triviaGame.nextQuestion();
        }, 1000 * 3);
      } else {
        //if user answers incorrectly
        $(".triviaAnswer").html(
          "Sorry, correct answer is: " + triviaGame.correctAnswer
        );
        setTimeout(function() {
          triviaGame.nextQuestion();
        }, 1000 * 3);
      }
    } else {
      $(".triviaAnswer").html("Please make a selection");
    }
  });

  $(".restartGame").on("click", function() {
    $(".triviaModal").modal("show");
  });
});

var triviaGame = {
  gameData: [],
  questionCount: 0,
  questionMax: 0,
  correctAnswer: "",
  incorrectAnswer: [],
  correctCount: 0,
  incorrectCount: 0,
  gameOver: false,

  timingQuestion: function() {
    var timePerQuestion = 15;
    timer = setInterval(function() {
      $(".countDownTimer").html(timePerQuestion);
      timePerQuestion--;
      if (timePerQuestion === 0) {
        $(".countDownTimer").html(timePerQuestion);
        clearInterval(timer);
        //hide the check button so user's don't accidentally click twice
        $(".checkAnswer").hide();
        triviaGame.checkAnswer();
        $(".triviaAnswer").html(
          "Time's up! Correct answer is: " + triviaGame.correctAnswer
        );
        setTimeout(function() {
          triviaGame.nextQuestion();
        }, 1000 * 3);
      }
    }, 1000);
  },

  startGame: function(arr) {
    //assign the variables
    this.gameData = arr;
    this.questionCount = 0;
    this.correctCount = 0;
    this.incorrectCount = 0;
    this.questionMax = this.gameData.length;
    this.nextQuestion();
  },

  nextQuestion: function() {
    //if there are available questions left, continue display
    if (this.questionCount < this.questionMax) {
      $(".triviaAnswer").html("");
      $(".checkAnswer").show();
      this.timingQuestion();
      this.displayQuestion();
      this.questionCount++;
    } else {
      $(".triviaAnswer").html("");
      $(".triviaQuestion").html("End of Questions");
      $(".triviaOption").empty();
      $(".restartGame").show();
      $(".checkAnswer").hide();
      $(".countDownTimer").html("");
    }
  },

  displayQuestion: function() {
    $(".triviaQuestion").html(this.gameData[this.questionCount].question);
    //a list of options
    this.correctAnswer = this.gameData[this.questionCount].correct_answer;
    this.incorrectAnswer = this.gameData[this.questionCount].incorrect_answers;
    console.log(this.correctAnswer);
    console.log(this.incorrectAnswer);
    var questionOption = this.incorrectAnswer.slice();
    questionOption.push(this.correctAnswer);
    questionOption = shuffle(questionOption);
    //remove the previous options for new options to be added
    $(".triviaOption").empty();
    //list out the options
    for (i = 0; i < questionOption.length; i++) {
      //this catches the rare instances where one of the question options is blank
      if (questionOption[i] !== "") {
        var q1 = $("<div>");
        q1.addClass("form-check col-12");
        var q2 = $("<input>");
        q2.addClass("form-check-input");
        //radio buttons require the same name
        q2.attr("name", "triviaOption");
        q2.attr("type", "radio");
        q2.attr("value", questionOption[i]);
        q2.attr("id", questionOption[i]);
        var q3 = $("<label>");
        q3.attr("for", questionOption[i]);
        q3.html("<h3>" + questionOption[i] + "</h3>");
        $(".triviaOption").append(q1.append(q2, q3));
      }
    }
  },

  checkAnswer: function(answerInput) {
    if (this.correctAnswer === answerInput) {
      this.correctCount++;
      this.updateDisplay();
      return true;
    } else {
      this.incorrectCount++;
      this.updateDisplay();
      return false;
    }
  },

  updateDisplay: function() {
    $(".correctCount").html(this.correctCount);
    $(".incorrectCount").html(this.incorrectCount);
  }
};
