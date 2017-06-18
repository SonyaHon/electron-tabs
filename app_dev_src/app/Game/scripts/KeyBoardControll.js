import EventEmitter from 'events';

let hash = {
    '81': 'q',
    '87': 'w',
    '69': 'e',
    '82': 'r',
    '84': 't',
    '89': 'y',
    '85': 'u',
    '73': 'i',
    '79': 'o',
    '80': 'p',
    '65': 'a',
    '83': 's',
    '68': 'd',
    '70': 'f',
    '71': 'g',
    '72': 'h',
    '74': 'j',
    '75': 'k',
    '90': 'z',
    '88': 'x',
    '67': 'c',
    '86': 'v',
    '66': 'b',
    '78': 'n',
    '77': 'm'
};

function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}

class KeyBoardControll extends EventEmitter {
    constructor() {
        super();
        let self = this;
        window.addEventListener('keydown', function (evt) {
            self.emit(hash[evt.keyCode]+'_pressed');
        });
        window.addEventListener('keyup', function (evt) {
            self.emit(hash[evt.keyCode]+'_released');
        });
    }
}

export default KeyBoardControll;