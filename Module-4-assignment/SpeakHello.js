(function (window) {
  var youssefGreeter = {};
  youssefGreeter.name = "youssef";
  youssefGreeter.sayHello = function(name) {
      console.log("Hello " + name);
  };
  global.youssefGreeter = youssefGreeter;
})();
