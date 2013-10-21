define(['underscore','backbone','text!./template.tmpl',
  'text!../config.json'], 
  function(_,Backbone,template,config) {
  return {
    type: 'Backbone', 
    events: {
    	"input #tofind":"dosearch",
      "click #cleartofind":"cleartofind",
      "click input[name='vriset']":"selectset",
    },
    cleartofind:function() {
      this.$el.find("#tofind").val("").focus();
      this.dosearch();
    },
    selectdb:function(db) {
      this.model.set('db',db);
    },
    enumdb:function(dbs) {
      this.model.set('dbs',dbs);
    },
    gotosource:function(opts) {
      //unlimitted scroll
      //show -5 lines
      /*
      var texts=[{db:opts.db,start:readunitprefix+'='+start+']'}];
      var opts3={texts:texts,scrollto:scrollto,name:start,tofind:opts.tofind}
      that.sandbox.emit("newtab",opts3);
      */
    },         
    listresult:function(start) {
      var that=this;
      var db=this.model.get('db');
      var dbs=this.model.get('dbs');
      var tofind=this.model.get('tofind');
      if (!db || !tofind) return;
      var opts={db:db,tofind:tofind,highlight:true,maxcount:20,start:start||0
        ,sourceinfo:true};
      this.sandbox.yase.phraseSearch(opts,function(err,data) {
        if (opts.start==0) {
          var count=dbs[db].count;
          that.sandbox.emit('newresult',data,db,tofind);
          that.sandbox.emit('totalslot',count.count,count.hitcount);
        }
        else that.sandbox.emit('moreresult',data);
        
      });

    },
    dosearch:function() {
        if (this.timer) clearTimeout(this.timer);
        var that=this;
        var tofind=that.$("#tofind").val().trim();
        if (!tofind) {
          this.$el.find("#searchhelp").show();
        } else {
          this.$el.find("#searchhelp").hide();
        }
        this.timer=setTimeout(function(){
          localStorage.setItem("tofind.kse",tofind);
          that.model.set('tofind',tofind);
          that.gethitcount(tofind);
        },300);
        this.listresult();
    },
    showhitcount:function(count,db) {
      this.sandbox.emit('setdbhit',db,count);
    },
    gethitcount:function(tofind) {
      var that=this;
      var opts={tofind:tofind,countonly:true};
      var dbs=this.model.get('dbs');
      for (var i in dbs) {
        opts.db=dbs[i].name;
        this.sandbox.yase.phraseSearch(opts,
          (function(db) {
            return function(err,data){
             that.showhitcount(data.hitcount,db);
             dbs[db].count=data;
            }
          })(i)
        );
      }
    },
    render:function() {
      this.html(_.template(template,{ value:this.options.value||""}) );
      this.$el.find("#tofind").focus();
    },
    initialize: function() {
     	this.render();
      var that=this;
      this.model=new Backbone.Model();
      this.config=JSON.parse(config);
      this.sandbox.on('selectdb',this.selectdb,this);
      this.sandbox.on('enumdb',this.enumdb,this);
      this.model.on('change:db',function(){that.listresult()},this);
      this.sandbox.on('more',this.listresult ,this);
      this.sandbox.on("gotosource",this.gotosource,this);
      setTimeout(function(){
        that.$("#tofind").val(localStorage.getItem("tofind.kse"));
        that.dosearch();
      },100)
    }
  };
});