define(['underscore','backbone','text!./text.tmpl','text!../config.json'], 
  function(_,Backbone,template,config) {
  return {
    type: 'Backbone',
    newreader:function(texts,name,scrollto) {
      var opts={widget:"paralleltext-widget@kse",
      name:name,focus:true,cols:texts,extra:{scrollto:scrollto}};
      this.sandbox.emit("newtab",opts);
    },
    initialize: function() {
      this.config=JSON.parse(config);
      this.sandbox.on('newreader',this.newreader,this);
    }
  };
});