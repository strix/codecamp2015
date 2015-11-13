function Controls(main) {
    this.a = false;
    this.d = false;
    this.w = false;
    this.s = false;
    this.mouseDown = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.main = main;
    this.canvas = main.canvas;
    window.addEventListener('keydown', this.keyDownEvent.bind(this));
    window.addEventListener('keyup', this.keyUpEvent.bind(this));
    this.canvas.addEventListener('mousedown', this.mouseDownEvent.bind(this));
    this.canvas.addEventListener('mouseup', this.mouseUpEvent.bind(this));
    window.addEventListener('mousemove', this.mouseMoveEvent.bind(this));
    this.canvas.addEventListener('contextmenu', this.contextMenuEvent.bind(this));
}
Controls.prototype.keyDownEvent = function(e) {
    if (e.keyCode == 87) {
        this.w = true;
    } else if (e.keyCode == 83) {
        this.s = true;
    } else if (e.keyCode == 65) {
        this.a = true;
    } else if (e.keyCode == 68) {
        this.d = true;
    }
};
Controls.prototype.keyUpEvent = function(e) {
    if (e.keyCode == 87) {
        this.w = false;
    } else if (e.keyCode == 83) {
        this.s = false;
    } else if (e.keyCode == 65) {
        this.a = false;
    } else if (e.keyCode == 68) {
        this.d = false;
    }
};
