require('./SpeakHello.js');
require('./SpeakGoodbye.js');

(function (window) {
    var names = ["Mohamed", "jamal", "Mustapha", "jaffar", "youssef", "Sarah", "Amine", "Jallal", "Farid"];

    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        
       
        if (name.charAt(0).toLowerCase() === 'j') {
            jamalGreeter.sayGoodbye(name);
        } else {
          youssefGreeter.sayHello(name);
        }
    }
})();
 