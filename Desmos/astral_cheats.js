var cheatingWindowSize = {'x':500, 'y':100};
var cheatingWindow = {'x':(window.innerWidth / 2) - (cheatingWindowSize.x / 2), 'y':(window.innerHeight / 2) - (cheatingWindowSize.y / 2)};
var mouseWindow = {'x':0, 'y':0};
var cheatingWindowMouseOffset = {'x':0, 'y':0};
var mouse_on_window = false;
var resizing_cheating_window = false;

function GetSize(html) {
    var width = html.offsetWidth;//includes margin,border,padding
    var height = html.offsetHeight;//includes margin,border,padding

    return {
        'x':width,
        'y':height
    }
}

onmousemove = function(e){
    mouseWindow.x = e.clientX;
    mouseWindow.y = e.clientY;
}

function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
        result = xmlhttp.responseText;
    }
    return result.split('\n');
}
var cheats_string = "";
function Cheat() {
    this.name = "";
}
function load_cheat(cheat_data) {
    var html = "";
    var numbers = [];
    var currentNumber = "";
    for (var f = 0; f < cheat_data.length; f++) {
        if (cheat_data[f] == '|') {
            numbers[numbers.length] = currentNumber;
            currentNumber = "";
        } else {
            currentNumber += cheat_data[f];
        }
    } 
    for (var g = 0; g < numbers.length; g++) {
        var num = parseInt(numbers[g]);
        html += String.fromCharCode(num);
    }
    document.getElementById("cheats_data_html").innerHTML = html;

    document.getElementById("cheats_data").classList.remove("cheats_hidden");
    document.getElementById("cheats_data").classList.add("cheats_shown");

    document.getElementById("cheats_list").classList.add("cheats_hidden");
    document.getElementById("cheats_list").classList.remove("cheats_shown");
}
function close_cheat() {
    document.getElementById("cheats_data_html").innerHTML = "";

    document.getElementById("cheats_data").classList.add("cheats_hidden");
    document.getElementById("cheats_data").classList.remove("cheats_shown");

    document.getElementById("cheats_list").classList.remove("cheats_hidden");
    document.getElementById("cheats_list").classList.add("cheats_shown");
}
function load_cheats() {
    var cheats = loadFile("https://gregorywells2007.github.io/Cheat-Window/AstralCheats/cheats.data");
    for (var k = 0; k < cheats.length; k++) {
        var cheat_lines = loadFile("https://gregorywells2007.github.io/Cheat-Window/AstralCheats/Cheats/" + cheats[k] + ".widget");
        var newCheat = new Cheat();
        var loading_data = false;
        var loading_html = false;
        var data_lines = [];
        var html_data = "";
        for (var u = 0; u < cheat_lines.length; u++) {
            if (cheat_lines[u].includes("end") && loading_html) 
                loading_html = false;

            if (loading_html) {
                html_data += cheat_lines[u];
            }

            if (cheat_lines[u].includes("html"))
                loading_html = true;

            // load basic data

            if (cheat_lines[u].includes("end") && loading_data) 
                loading_data = false;

            if (loading_data) {
                data_lines[data_lines.length] = cheat_lines[u];
            }

            if (cheat_lines[u].includes("data"))
                loading_data = true;
        }

        newCheat.name = data_lines[0];
        newCheatDataInt = "";
        for (var h = 0; h < html_data.length; h++) {
            newCheatDataInt += html_data[h].charCodeAt() + "|";
        }

        cheats_string += `
            <div id="cheating_button" onclick="load_cheat('`+ newCheatDataInt + `')">
            ` + newCheat.name + `
            </div>
        `
    }
}
load_cheats();

function update_cheating_window() {
    if (mouse_on_window) {
        cheatingWindow.x = mouseWindow.x - cheatingWindowMouseOffset.x;
        cheatingWindow.y = mouseWindow.y - cheatingWindowMouseOffset.y;
    }

    if (resizing_cheating_window) {
        cheatingWindowSize.x = mouseWindow.x - cheatingWindow.x;
        cheatingWindowSize.y = mouseWindow.y - cheatingWindow.y;
    }

    document.getElementById("CheatingWindow").style.setProperty("--top-bar-height", GetSize(document.getElementById("TopBar")).y + "px");
    document.getElementById("CheatingWindow").style.setProperty("--cheating-back-button-size", GetSize(document.getElementById("cheating_back_button")).y + "px");

    document.getElementById("CheatingWindow").style.setProperty("--x", cheatingWindow.x + "px");
    document.getElementById("CheatingWindow").style.setProperty("--y", cheatingWindow.y + "px");

    document.getElementById("AstralCheats").style.setProperty("--window-size-x", cheatingWindowSize.x + "px");
    document.getElementById("AstralCheats").style.setProperty("--window-size-y", cheatingWindowSize.y + "px");

    requestAnimationFrame(update_cheating_window);
}
requestAnimationFrame(update_cheating_window);
function move_cheating_window() {
    cheatingWindowMouseOffset = {'x':mouseWindow.x - cheatingWindow.x, 'y':mouseWindow.y - cheatingWindow.y};
    mouse_on_window = true;
}
function stop_moving_cheating_window() {
    mouse_on_window = false;
}

function resize_cheating_window() {
    resizing_cheating_window = !resizing_cheating_window;
}
function stop_resizing_cheating_window() {
    resizing_cheating_window = false;
}

document.body.innerHTML += `
<div id="AstralCheats">
    <style>
        #cheating_button {
            width: 100%;
            height: fit-content;
            background-color: rgb(200, 200, 200);
            padding: 5px;
            padding-right: 0px;
        }

        #cheating_button:hover {
            background-color: rgb(190, 190, 190);
        }

        #CheatingWindow {
            position: fixed;
            --x: 0;
            --y: 0;
            left: var(--x);
            top: var(--y);

            width: var(--window-size-x);
            height: var(--window-size-y);
            z-index: 1000000;
        }

        #CheatingWindow:hover {
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        #TopBar {
            width: 100%;
            height: fit-content;
            background-color: rgb(219, 219, 219);
            padding-left: 5px;
            padding-top: 5px;
            padding-bottom: 5px;
            border-radius: 5px 5px 0px 0px;
        }

        #TopBar:hover {
            filter: rgb(210, 210, 210);
        }

        #CheatingContent {
            width: var(--window-size-x);
            height: calc(var(--window-size-y) - var(--top-bar-height));
            background-color: rgb(200, 200, 200);
            padding-right: 5px;
            border-radius: 0px 0px 5px 5px;
        }

        #cheating_resize_bar {
            width: 10px;
            height: 10px;
            position: relative;
            left: calc(var(--window-size-x) - 2.5px);
            bottom: 5px;
        }

        #cheating_resize_bar:hover {
            cursor: nw-resize;
        }

        .cheats_shown {

        }

        .cheats_hidden {
            display: none;
        }

        #cheating_back_button {
            position: absolute;
            top: calc(var(--window-size-y) - var(--cheating-back-button-size) - 5px);
            border-radius: 5px;
            left: 5px;
            padding: 5px;
            width: fit-content;
            height: fit-content;
            background-color: rgb(200, 200, 200);
        }

        #cheating_back_button:hover {
            background-color: rgb(190, 190, 190);
        }
        
        #cheats_data_html {
            width: var(--window-size-x);
            height: calc(var(--window-size-y) - var(--top-bar-height));
        }
    </style>

    <div id="CheatingWindow">
        <div id="TopBar" onmousedown="move_cheating_window();" onmouseup="stop_moving_cheating_window()">
            Cheating Window
        </div>
        <div id="CheatingContent">
            <div id="cheats_list" class="cheats_shown">` + 
                cheats_string
        + ` </div>
            <div id="cheats_data" class="cheats_hidden">
                <div id="cheats_data_html"> 
                
                </div>

                <div id="cheating_back_button" onclick="close_cheat()">
                    Back
                </div>
            </div>
        </div>
        <div id="cheating_resize_bar" onmousedown="resize_cheating_window();" onmouseup="stop_resizing_cheating_window()">

        </div>
    </div>
</div>
`;

//javascript: var cheat_window_script = document.createElement('script'); cheat_window_script.setAttribute('src','https://gregorywells2007.github.io/Cheat-Window/AstralCheats/astral_cheats.js'); document.head.appendChild(cheat_window_script);
