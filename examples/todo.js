var App = spine.Application.extend({
    
    someappprop: 'hello'
    ,initialize: function(options){
        var self = this;
        
        this.anotherappprop = 'world';
        this.todos = [];
        
        options.data.forEach(function(el){
            self.todos.push( new TodoItem({ text: el }) );
        });
        
        this.main = new MainView({ el: document.getElementById('mainView') });
        
        this.on('initialized', this.onStartComplete);
    }
    
    ,onStartComplete: function(){
        console.log('app started!', arguments, this);    
    }
    
});




var MainView = spine.View.extend({
    
    someprop: 'hello'
    ,template: _.template( $('#todoItem').html() )
    ,initialize: function(options){
        this.render();
    }
    
    ,render: function(){
        var i, sb = [];
        
        for(i = 0; i < 10; i++){
            sb.push( this.template( {liContent: 'this is item # ' + i} ) );
        }
        
        this.$el.html( sb.join('') );
    }
    
});


var TodoItem = spine.Model.extend({

    text: ''

    ,initialize: function(options){
        this.text = options.text;
    }
    
    ,validate: function(){
    
        if(this.text == '') return false;
        else return true;
    }

});


var app = new App({ appOpt: true, data: [
    'this is an item'
    ,'this is another item'
    ,'' // invalid item, technically
] });