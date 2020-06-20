$(document).ready(function () {
  // Declaration of initial variables
  var currentDay = $("#currentDay");
  var scheduleArea = $(".schedule");
  var timeRow = $(".time-row");
  var currentDate = moment().format("dddd, MMMM Do");
  var currentHour = moment().format("H");
  var toDoItems = [];
  var localContent = JSON.parse(localStorage.getItem("schedule")) || {};
  const container = $(".container");
  var hourArray = [
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
  ];

  $.fn.styleHours = function () {
    let nowHour = moment().hour();
    let hour = parseInt($(this)[0].id.split("-")[1]);

    if (nowHour === hour) {
      $(this).addClass("present");
    } else if (nowHour > hour) {
      $(this).addClass("past");
    } else {
      $(this).addClass("future");
    }
    return this;
  };

  // An array of objects
  function startSchedule() {
    timeRow.each(function () {
      var thisRow = $(this);
      var thisRowHr = parseInt(thisRow.attr("data-hour"));

      var todoObj = {
        hour: thisRowHr,
        text: "",
      };
      toDoItems.push(todoObj);
    });
    // Loop all rows, save to local storage
    localStorage.setItem("todos", JSON.stringify(toDoItems));
  }

  function saveIt(event) {
    event.preventDefault();

    var hourToUpdate = $(this).parent().attr("data-hour");
    var itemToAdd = $(this).parent().children("textarea").val();
    for (var j = 0; j < toDoItems.length; j++) {
      if (toDoItems[j].hour == hourToUpdate) {
        toDoItems[j].text = itemToAdd;
      }
    }
    localStorage.setItem("todos", JSON.stringify(toDoItems));
    renderSchedule();
  }

  //format the rows colors depending on time
  function setUpRows() {
    timeRow.each(function () {
      var thisRow = $(this);
      var thisRowHr = parseInt(thisRow.attr("data-hour"));

      // style rows to show where we are in the day
      if (thisRowHr == currentHour) {
        thisRow.addClass("present").removeClass("past future");
      }
      if (thisRowHr < currentHour) {
        thisRow.addClass("past").removeClass("present future");
      }
      if (thisRowHr > currentHour) {
        thisRow.addClass("future").removeClass("past present");
      }
    });
  }

  function renderSchedule() {
    toDoItems = localStorage.getItem("todos");
    toDoItems = JSON.parse(toDoItems);

    for (var i = 0; i < toDoItems.length; i++) {
      var itemHour = toDoItems[i].hour;
      var itemText = toDoItems[i].text;

      $("[data-hour=" + itemHour + "]")
        .children("textarea")
        .val(itemText);
    }
  }

  setUpRows();

  function formatHour(hour) {
    if (hour === 12) return "12PM";
    if (hour > 12) return hour - 12 + "PM";
    return hour + "AM";
  }

  if (!localStorage.getItem("todos")) {
    //initialize the array of objects
    startSchedule();
  } //otherwise we will get it from local storage

  function makeSchedule(hours) {
    // foreach hour build a row
    hours.forEach((hour) => {
      // CREATE row
      let div = $("<div class=row time-row>");

      // CREATE time
      let timeBlock = $('<div class="col-2 col-lg-1 hour">');
      let timeBlockText = $("<span>");
      timeBlockText.text(formatHour(hour));
      timeBlock.append(timeBlockText);

      // CREATE text input
      let txtArea = $('<textarea class="col-8 col-lg-10">');
      txtArea.styleHours();

      if (localContent[hour] && localContent[hour].length) {
        $(txtArea).val(localContent[hour]);
      } else {
        $(txtArea).val("");
      }

      // CREATE save button
      let saveBtn = $(
        '<button class="col-2 col-lg-1 btn btn-block saveBtn d-flex justify-content-center align-items-center">'
      );
      saveBtn.append($('<i class="fas fa-save">'));
      saveBtn.on("click", saveIt);

      // APPEND time, txt, save to div
      div.append(timeBlock, txtArea, saveBtn);

      // APPEND div to container
      container.append(div);
    });
  }

  //display current date
  currentDay.text(currentDate);
  renderSchedule();
  makeSchedule(hourArray);
  //render schedule from local storage
  //renderSchedule();
  //when a todo item save button is clicked, save it
  scheduleArea.on("click", "button", saveIt);
});
