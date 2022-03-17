(function () {
    var defaultOnTouchStartHandler = fabric.Canvas.prototype._onTouchStart;
    fabric.util.object.extend(fabric.Canvas.prototype, {
        _onTouchStart: function (e) {
            var target = this.findTarget(e);
            if (this.allowTouchScrolling && !target && !this.isDrawingMode) {
                return;
            }

            defaultOnTouchStartHandler.call(this, e);
        }
    });
})();























const appDimensions = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--app-height", `${window.innerHeight}px`);
    doc.style.setProperty("--app-width", `${window.innerWidth}px`);
}
window.addEventListener("resize", appDimensions);
appDimensions();

let weight = document.getElementById("weight");

let c = document.getElementById("c");

var canvas = new fabric.Canvas("c", { isDrawingMode: true, width: 1000, height: 1000, allowTouchScrolling: true });

fabric.Object.prototype.transparentCorners = false;
canvas.selection = false;

canvas.freeDrawingBrush.width = parseInt(document.getElementById("weight").value, 10) || 0;
canvas.freeDrawingBrush.color = document.getElementById("color").value;

document.getElementById("color").onchange = function () {
    canvas.freeDrawingBrush.color = this.value;
};
document.getElementById("weight").onchange = function () {
    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 0;
};
document.getElementById("clearButton").onclick = function () {
    canvas.clear();
};

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
    canvas.isDrawingMode = !canvas.isDrawingMode;

    // if drawing
    if (ele.style.touchAction == "none") {
        ele.style.touchAction = "auto";
        c.style.touchAction = "manipulation !important";
        // c.style.pointerEvents = "none !important";
        // c.style.userSelect = "none !important";
        isPanning = true;
        ele.style.cursor = "grab !important";
        // Attach the handler
        ele.addEventListener("mousedown", mouseDownHandler);
    } else { // if panning
        ele.style.touchAction = "none";
        // c.style.touchAction = "auto !important";
        // c.style.pointerEvents = "auto !important";
        // c.style.userSelect = "auto !important";
        isPanning = false;
        ele.removeEventListener("mousedown", mouseDownHandler);
        ele.style.cursor = "auto !important"
    }
}

// canvas.getObjects(); // get all objects on canvas (rect will be first and only)

// canvas.remove(rect); // remove previously-added fabric.Rect

// $(function () {
//     $("#slider-vertical").slider({
//         orientation: "vertical",
//         range: "min",
//         min: 2,
//         max: 42,
//         value: 10,
//         slide: function (event, ui) {
//             $("#weight").val(ui.value);
//         }
//     });
//     $("#weight").val($("#slider-vertical").slider("value"));
// });

