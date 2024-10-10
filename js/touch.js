function handleTouchStart(e) {
    var target = e.target || e.srcElement;
    if (target.tagName === "A") {
        target.classList.add('active-state');
    } else if (target.parentElement.tagName === "A") {
        target.parentElement.classList.add('active-state');
    }
    
}
    
function handleTouchEnd(e) {
    var target = e.target || e.srcElement;
    if (target.tagName === "A") {
        target.classList.remove('active-state');
    } else if (target.parentElement.tagName === "A") {
        target.parentElement.classList.remove('active-state');
    }
}

const app = document.body;
app.addEventListener("touchstart", handleTouchStart);
app.addEventListener("touchend", handleTouchEnd);