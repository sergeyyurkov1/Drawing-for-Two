const appDimensions = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
  doc.style.setProperty("--app-width", `${window.innerWidth}px`);
}
window.addEventListener("resize", appDimensions);
appDimensions();

// panPan
const ele = document.getElementById("canvasContainer");
let pos = { top: 0, left: 0, x: 0, y: 0 };
const mouseDownHandler = function (e) {
  ele.style.cursor = "grabbing";
  ele.style.userSelect = "none";

  pos = {
    left: ele.scrollLeft,
    top: ele.scrollTop,
    // Get the current mouse position
    x: e.clientX,
    y: e.clientY,
  };

  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
};
const mouseMoveHandler = function (e) {
  // How far the mouse has been moved
  const dx = e.clientX - pos.x;
  const dy = e.clientY - pos.y;

  // Scroll the element
  ele.scrollTop = pos.top - dy;
  ele.scrollLeft = pos.left - dx;
};
const mouseUpHandler = function () {
  ele.style.cursor = "grab";
  ele.style.removeProperty("user-select");

  document.removeEventListener("mousemove", mouseMoveHandler);
  document.removeEventListener("mouseup", mouseUpHandler);
};


document.getElementById("panButton").addEventListener("click", togglePan);
function togglePan() {
  if (ele.style.touchAction == "none") {
    ele.style.touchAction = "auto";
    isPanning = true;
    ele.style.cursor = "grab";
    // Attach the handler
    ele.addEventListener("mousedown", mouseDownHandler);
  } else {
    ele.style.touchAction = "none";
    isPanning = false;
    ele.removeEventListener("mousedown", mouseDownHandler);
    ele.style.cursor = "auto"
  }
}

const color = document.getElementById("color");
const weight = document.getElementById("weight");

// ------------------------------------------------------------------------------------------
var drawing = [];
var currentPath = [];
var isDrawing = false;
var isPanning = false;

function setup() {
  setup_();
}

function setup_() {
  canvas = createCanvas(1000, 1000).parent("canvasContainer").id("drawingCanvas"); // WEBGL

  canvas.touchStarted(startPath);
  canvas.mousePressed(startPath);
  canvas.parent("canvasContainer");
  canvas.touchEnded(endPath);
  canvas.mouseReleased(endPath);

  var saveButton = select("#saveButton");
  // saveButton.mousePressed(saveDrawing);

  var undoButton = select("#undoButton");
  undoButton.mousePressed(undoDrawing);

  var clearButton = select("#clearButton");
  clearButton.mousePressed(clearDrawing);
}

function startPath() {
  isDrawing = true;
  currentPath = [];
  if (!isPanning) {
    drawing.push(currentPath);
  }
}

function endPath() {
  isDrawing = false;
}

function draw() {
  background("#1d1d1d");
  // translate(-width / 2, -height / 2, 0);

  if (!isPanning) {
    if (isDrawing) {
      var point = {
        x: mouseX,
        y: mouseY,
        color: color.value,
        weight: weight.value
      };
      currentPath.push(point);
    }
  }

  noFill();
  for (var i = 0; i < drawing.length; i++) {
    var path = drawing[i];
    if (path.length !== 0) {
      beginShape();
      for (var j = 0; j < path.length; j++) {
        // fill(path[j].color);
        stroke(path[j].color);
        strokeWeight(path[j].weight);
        vertex(path[j].x, path[j].y);
      }
      endShape();
    }
  }
}

function undoDrawing() {
  drawing.pop();
}

function clearDrawing() {
  drawing = [];
}

$(function () {
  $("#slider-vertical").slider({
    orientation: "vertical",
    range: "min",
    min: 2,
    max: 42,
    value: 2,
    slide: function (event, ui) {
      $("#weight").val(ui.value);
    }
  });
  $("#weight").val($("#slider-vertical").slider("value"));
});

$(window).on("load", function () {
  $("#exampleModal").modal({ "backdrop": "static", "keyboard": false, "show": true });
});