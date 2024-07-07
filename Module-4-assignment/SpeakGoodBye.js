(function (window) {
  var jamalGreeter = {};
 jamalGreeter.name = "jamal";
  jamalGreeter.sayGoodbye = function(name) {
      console.log("Goodbye " + name);
  };
  global.jamalGreeter = jamalGreeter;
})();
