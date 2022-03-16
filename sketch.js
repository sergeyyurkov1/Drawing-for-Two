const appDimensions = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--app-height", `${window.innerHeight}px`);
    doc.style.setProperty("--app-width", `${window.innerWidth}px`);
}
window.addEventListener("resize", appDimensions);
appDimensions();

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
  var x = document.getElementById("canvasContainer");
  if (x.style.touchAction == "none") {
    x.style.touchAction = "auto";
    isPanning = true;
    ele.style.cursor = "grab";
    // Attach the handler
    ele.addEventListener("mousedown", mouseDownHandler);
  } else {
    x.style.touchAction = "none";
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
  canvas = createCanvas(1500, 1500).parent("canvasContainer").id("drawingCanvas");

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

function panPan() {
  const ele = document.getElementById("canvasContainer");
  ele.style.cursor = "grab";

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

  // Attach the handler
  ele.addEventListener("mousedown", mouseDownHandler);
}
