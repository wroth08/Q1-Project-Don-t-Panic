/* global $ moment */

// Get the current date
var time = moment().format('YYYY-MM-DD');

// Render the page using the current date
render();

// Render the page again if the title is clicked
$(".brand-logo").click( function () {
  $(".render-body").empty();
  render();
})


function render () {
// API call
  $.get("https://api.nasa.gov/neo/rest/v1/feed?start_date=" + time + "&end_date=" + time + "&api_key=mDpNGA7bOsIOF6nDdXgg83g9HvqyQdblpt8PKwcS").then(function (data) {

// Put the API data into a more readable and usable format
  var asteroids = [];
  for (var i = 0; i < data['near_earth_objects'][time].length; i++) {
    asteroids.push(data['near_earth_objects'][time][i]);
  }

// Find out how many have the potentially dangerous classification
  var dangerousAsteroids = 0;
  for (i = 0; i < asteroids.length; i++) {
    if (asteroids[i]['is_potentially_hazardous_asteroid'] === true) {
      dangerousAsteroids += 1;
    }
  }


// Render top part of page
  $(".render-body").append("<div class='container col s6 offset-s3 scary-box z-depth-5'></div>");
  $(".scary-box").append("<h1 id='asteroidTitle'>Showing Near-Apocalyptic Misses For: " + time +
  "</div>");
  $(".scary-box").append("<div class='asteroids-facts'></div>");
  $(".scary-box").append("<div class='new-date-input input-field'></div>");
  $(".new-date-input").append("<h1>Or, Choose A New Date Here (YYYY-MM-DD):  </h1>");
  $(".new-date-input").append("<div class='input-box'></div>")
  $(".input-box").append("<input id='search' class='center-align' type='text'></input>");
  $(".new-date-input").append("<button id='change-time' class='btn brown waves-effect waves-light z-depth-5'>Submit!</button>");


// Render the three parts of the top section of the page
  $(".asteroids-facts").append("<div class='total-asteroids z-depth-5'></div>");
  $(".total-asteroids").append("<h1>" + asteroids.length + "</h1>");
  $(".total-asteroids").append("<h2>Total Near Earth Asteroids</h2>");
  $(".asteroids-facts").append("<div class='scary-asteroids z-depth-5'></div>");
  $(".scary-asteroids").append("<h1>" + dangerousAsteroids + "</h1>");
  $(".scary-asteroids").append("<h2>Potentially Hazardous</h2>");
  $(".asteroids-facts").append("<div class='harmless-asteroids z-depth-5'></div>");
  $(".harmless-asteroids").append("<h1>" + (asteroids.length - dangerousAsteroids) + "</h1>");
  $(".harmless-asteroids").append("<h2><i>Harmless </i> Asteroids</h2>");

// Render the bottom list of asteroids
  $(".render-body").append("<div class='container col s6 offset-s3 z-depth-5' id='list-container'></div>")
  $("#list-container").append("<ul class='collapsible' data-collapsible='accordion' id='asteroid-list'></ul>");
  for (i = 0; i < asteroids.length; i++) {
    $("ul").append("<li></li>");
  }
  $("#asteroid-list li").each(function(i) {
    $(this).append("<div class='collapsible-header'><p>Asteroid Name: " + asteroids[i]['name'] + "</p><p>(Click to Expand)</p></div>");
  })
  $("#asteroid-list li").each(function() {
    $(this).append("<div class='collapsible-body'></div>");
  })
  $("#asteroid-list li .collapsible-body").each(function() {
    $(this).append("<div class=asteroid-diameter-box></div>");
    $(this).append("<div class=asteroid-speed-box></div>");
    $(this).append("<div class=asteroid-missed-by-box></div>");
  })
  $(".asteroid-diameter-box").each(function(i) {
    $(this).append("<h1>" + asteroids[i]['estimated_diameter']['miles']['estimated_diameter_max'].toFixed(3) + "</h1>");
    $(this).append("<h2>Diameter In Miles</h2>");
  })
  $(".asteroid-speed-box").each(function(i) {
    var speed = asteroids[i]['close_approach_data'][0]['relative_velocity']['miles_per_hour'];
    speed = parseInt(speed);
    $(this).append("<h1>" + speed + "</h1>");
    $(this).append("<h2>Relative Velocity (MPH)</h2>");
  })
  $(".asteroid-missed-by-box").each(function(i) {
    $(this).append("<h1>" + (asteroids[i]['close_approach_data'][0]['miss_distance']['miles'] / 1000000).toFixed(1) + "</h1>");
    $(this).append("<h2>Missed Earth By (Million Miles)</h2>");
  })

// Make the Materialize collapsible list render
  $('.collapsible').collapsible();

// Add the side buttons
  $(".render-body").append("<div class='panic-button z-depth-5'></div>");
  $(".panic-button").append("<h1>PANIC</h1>");
  $(".render-body").append("<div class='comfort-button z-depth-5'></div>");
  $(".comfort-button").append("<h1>CALM</h1>");
  $("body").append("<img src=124583.svg id='asteroids'>")

// Allow the use of different dates and render appropriately
  $("button").click( function() {
    time = $("input").val();
    if (time !== "") {
      $(".render-body").empty();
      render();
    }
  })

// Panic button functionality
  $(".panic-button").click( function () {
    $(".render-body").empty();
    $(".render-body").append("<audio autoplay src=O_Fortuna.mp3 type='audio/mpeg'>")
    $("#asteroids").animate({
      width: "50%",
      height: "100vh",
    }, {
      duration: 5000
    });
    $("#asteroids").fadeOut(500, function () {
      $(".render-body").append("<img src=flame.svg id='death1'>");
      $(".render-body").append("<img src=flame.svg id='death2'>");
      $(".render-body").append("<img src=flame.svg id='death3'>");
      $(".render-body img").animate({
        opacity: 1
      }, {
        duration: 1000
      }
    );
    });
  })

// Comfort button functionality
  $(".comfort-button").click( function () {
    $(".render-body").empty();
    $(".render-body").append("<div class='container z-depth-5 calming-info'></div>");
    $(".calming-info").append("<p>&nbsp;&nbsp;&nbsp;&nbsp;Even though these asteroids look terrifying, NASA estimates that none of these near-Earth objects are in danger of colliding with the Earth for the near future. A &quot;potentially hazardous&quot; designation simply means that they are being closely monitored, because they have the potential to be dangerous after 100 years have passed. </p>");
    $(".calming-info").append("<h1>Don't Worry!</h1>");
  })
})
}
