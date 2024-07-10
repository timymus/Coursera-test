(function (window) {
  var byeSpeaker = {};
  var speakWord = "Goodbye ";
  byeSpeaker.speak = function (name) {
      console.log(speakWord + "J" + name);
  };
  window.byeSpeaker = byeSpeaker;
})(window);