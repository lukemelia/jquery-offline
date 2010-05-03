jQuery(document).ready(function($) {

  var setup = function(next) {
    if(localStorage) {
      delete localStorage["offline.jquery:/ajax/app:"];
      delete localStorage["offline.jquery:/ajax/app:hello=world"];
      delete localStorage["offline.jquery:/ajax/app:goodbye=world"];
    }

    $.get("/reset", function() { next(); });
  }

  var baseTest = function( next, data, obj ) {
    var cached = null;

    if(obj === true || obj === false) obj = { start: obj };
    else if(obj === undefined) obj = {};

    var count = obj.count || 1,
        toStart = obj.start,
        expectCached = obj.cached;

    var successCount = expectCached ? (count + 1) : count;

    $.retrieveJSON("/ajax/app", data, function( json, text ) {
      if(text == "success") {
        var countSucc = (count || 1) + 1;
        deepEqual( json, { count: successCount, qs: $.param(data || {}) },
          "retrieveJSON with '" + $.param( data ) + "' should get JSON" );

        if(expectCached) {
          equal("cached", cached, "retrieveJSON should hit the cache " +
            "before hitting the app")
        }

        if(toStart) start();
        else next();
      } else if(text == "cached") {
        cached = text;
        deepEqual( json, { count: count, qs: $.param(data || {}) },
          "retrieveJSON with '" + $.param( data ) + "' should get JSON" );
      }
    });
  }

  if( $.support.localStorage ) {
    asyncTest("the first time, it hits the server", 1, function() {
      $(document).dequeue().queue(function(next) {
        setup(next);
      }).queue(function(next) {
        baseTest(next, {}, { start: true, cached: false });
      });
    });

    asyncTest("the second time, it doesn't hit the server", function() {
      $(document).dequeue().queue(function(next) {
        setup(next);
      }).queue(function(next) {
        baseTest(next, {}, { cached: false });
      }).queue(function(next) {
        baseTest(next, {}, { start: true, cached: true });
      });
    });
  
    asyncTest("different data gets cached differently", function() {
      $(document).dequeue().queue(function(next) {
        setup(next);
      }).queue(function(next) {
        baseTest(next, {hello: "world"});
      }).queue(function(next) {
        baseTest(next, {goodbye: "world"});
      }).queue(function(next) {
        baseTest(next, {hello: "world"}, { cached: true });
      }).queue(function(next) {
        baseTest(next, {goodbye: "world"}, { cached: true, start: true });
      });
    });
  
    asyncTest("clearJSON clears the JSON cache for an URL", function() {
      $(document).dequeue().queue(function(next) {
        setup(next);
      }).queue(function(next) {
        baseTest(next, {});
      }).queue(function(next) {
        $.clearJSON("/ajax/app");
        next();
      }).queue(function(next) {
        baseTest(next, {}, { start: true, count: 2 });
      });
    });
  
    asyncTest("clearJSON clears the JSON cache for an URL and data", function() {
      $(document).dequeue().queue(function(next) {
        setup(next);
      }).queue(function(next) {
        baseTest(next, {hello: "world"});
        baseTest(next, {goodbye: "world"});
      }).queue(function(next) {
        $.clearJSON("/ajax/app", {hello: "world"});
        next();
      }).queue(function(next) {
        baseTest(next, {hello: "world"}, { count: 2, cached: false });
      }).queue(function(next) {
        baseTest(next, {goodbye: "world"}, { start: true, cached: true });
      });
    });
  } else {
    asyncTest("the first time, it hits the server", 1, function() {
      $(document).dequeue().queue(function(next) {
        setup(next);
      }).queue(function(next) {
        baseTest(next, {}, true);
      });
    });
  
    asyncTest("the second time, it still hits the server", function() {
      $(document).dequeue().queue(function(next) {
        setup(next);
      }).queue(function(next) {
        baseTest(next, {});
      }).queue(function(next) {
        baseTest(next, {}, { start: true, count: 2 })
      });
    });
  
    asyncTest("different query strings always hit the server", function() {
      $(document).dequeue().queue(function(next) {
        setup(next);
      }).queue(function(next) {
        baseTest(next, {hello: "world"});
      }).queue(function(next) {
        baseTest(next, {goodbye: "world"});
      }).queue(function(next) {
        baseTest(next, {hello: "world"}, { count: 2 });
      }).queue(function(next) {
        baseTest(next, {goodbye: "world"}, { start: true, count: 2 });
      });
    });
  
    asyncTest("clearJSON clears the JSON cache for an URL", function() {
      $(document).dequeue().queue(function(next) {
        setup(next);
      }).queue(function(next) {
        baseTest(next, {});
      }).queue(function(next) {
        $.clearJSON("/ajax/app");
        next();
      }).queue(function(next) {
        baseTest(next, {}, { start: true, count: 2 });
      });
    });
  
    asyncTest("clearJSON clears the JSON cache for an URL and data", function() {
      $(document).dequeue().queue(function(next) {
        setup(next);
      }).queue(function(next) {
        baseTest(next, {hello: "world"});
        baseTest(next, {goodbye: "world"});
      }).queue(function(next) {
        $.clearJSON("/ajax/app", {hello: "world"});
        next();
      }).queue(function(next) {
        baseTest(next, {hello: "world"}, { count: 2 });
      }).queue(function(next) {
        baseTest(next, {goodbye: "world"}, { start: true, count: 2 });
      });
    });
  }
});
