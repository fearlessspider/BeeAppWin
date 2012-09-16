define(['jquery', 'underscore', 'Backbone', 'text!views/AboutView.html'],
    function ($, _, Backbone, AboutViewTemplate) {
        var AboutView = Backbone.View.extend({
		    initialize: function (options) {
				this.render();
				this.view = this.$el;
		    },
            events:{
                "click #back":"back"
            },
            render:function () {
                this.$el.html(_.template(AboutViewTemplate));
                return this;
            },
            back:function(event) {
                $.mobile.jqmNavigator.popView();
            }
        });
        return AboutView;
    });