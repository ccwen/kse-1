define(['backbone'], function(Backbone) {
  return {
    type: 'Backbone',
    dosearch:function(tofind,start) {
      var opts={db:this.db,showtext:true,hightlight:true};
      var yase=this.sandbox.yase;
      opts.tofind=tofind||this.model.get("tofind");
      this.model.set({tofind:opts.tofind});
      var that=this;
      yase.phraseSearch(opts,function(err,data) {
        that.sandbox.emit('searchresult',data);
      });
    },
    model:new Backbone.Model(),
    initialize: function() {
      this.db=this.options.db;
      this.sandbox.on("tofind.change",this.dosearch,this) ;
    }
  };
});
