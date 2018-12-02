function constructAPI_URL(
  gameType,
  questionCategoryID,
  questionDifficulty,
  questionAmount
) {
  //at mininum need amount parameter
  //gameType ("True/False": boolean, "Multiple Choise": multiple)
  //questionAmount (1 to 50)
  //questionDifficulty (easy, medium, hard)
  //format: baseURL?amount&category&difficulty&type
  //the HTML selection value will be the correct value
  var baseURL = "https://opentdb.com/api.php?";
  var newURL;
  var gameTypeParam;
  var questionCategoryParam;
  var questionDifficultyParam;
  var questionAmountParam;
  if (gameType !== undefined) {
    gameTypeParam = "&type=" + gameType;
  } else {
    gameTypeParam = "";
  }
  if (questionCategoryID !== undefined) {
    questionCategoryParam = "&category=" + questionCategoryID;
  } else {
    questionCategoryParam = "";
  }
  if (questionDifficulty !== undefined) {
    questionDifficultyParam = "&difficulty=" + questionDifficulty;
  } else {
    questionDifficultyParam = "";
  }
  if (questionAmount !== undefined) {
    questionAmountParam = "amount=" + questionAmount;
  } else {
    questionAmountParam = "amount=10";
  }

  newURL =
    baseURL +
    questionAmountParam +
    questionCategoryParam +
    questionDifficultyParam +
    gameTypeParam;
  return newURL;
}

//suffles the answer array
function shuffle(arr) {
  var j, x, i;
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
}

function startTimer(duration, display) {
  var timer = setInterval(function() {
    minutes = parseInt(duration / 60, 10);
    seconds = parseInt(duration % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.html(minutes + ":" + seconds);
    duration--;

    if (duration < 0) {
      clearInterval(timer);
      console.log("time's up");
    }
  }, 1000);

  return timer;
}

function getCategory() {
  var URL = "https://opentdb.com/api_category.php";
  $.getJSON(URL, function(responseData) {
    //the json data retrived will be converted to an object, which contains (response_code and results)
    //store the responseData object in a new gameData object for the rest of the game
    console.log(responseData.trivia_categories);
    parseCategoryList(responseData.trivia_categories);
  });
}

function parseCategoryList(arr) {
  for (var i = 0; i < arr.length; i++) {
    var opt = $("<option>");
    opt.attr("value", arr[i].id);
    opt.html(arr[i].name);
    $("#questionCategory").append(opt);
  }
}

function getInput(item, defaultVal) {
  //console.log(item + ":" + $(item).val());
  if ($(item).val() !== defaultVal) {
    return $(item).val();
  } else {
    return undefined;
  }
}
