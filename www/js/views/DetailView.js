define(['jquery', 'underscore', 'Backbone', 'text!views/DetailView.html', 'views/LocationView', 'views/AboutView'],
    function ($, _, Backbone, DetailViewTemplate, LocationView, AboutView) {
    var DetailView = Backbone.View.extend({
        bee: "",
        image: "",

        initialize: function (options) {

            //this.model = options.result;
            this.bee = options.id;
            this.image = options.image;
            this.render();
            this.view = this.$el;
        },

        events: {
            "click #back": "back",
            "click #send": "buttonClick",
            "click #about":"headerButtonClick"
        },

        render: function (eventName) {
            this.$el.html(_.template(DetailViewTemplate));
            this.$el.find("#bee_image").attr('src', "img/references/bombus_"+this.bee+".jpg");
            this.$el.find("#" + this.bee).removeClass("hide");
            this.$el.find("#title").html("Step 4 - Bombus " + this.bee);
            return this;
        },
                    back:function(event) {
                        $.mobile.jqmNavigator.popView();
                    },
        buttonClick: function () {
            var view = new LocationView({image:this.image});

            $.mobile.jqmNavigator.pushView(view);
            //navigator.notification.alert('Thank you for submitting this photo. Our expert identified the bee as a Red-tailed cuckoo rather than a Red-shanked carder bee. You correctly identified the abdomen (rear body), the face and the thorax (central body); however, the wings and the pollen basket are different. Although some of these features may not be visible in your photograph, the following advice might be helpful for next time you are in the field. The Red-tailed cuckoo does not have a pollen basket whereas the Red-shanked carder bee has a pollen basket. The Red-tailed cuckoo\'s wings are smokey dark whereas the Red-shanked carder bee\'s wings are clear. This feedback can also be viewed by logging into BeeWatch and clicking on the relevant photo.',null,'Feedback for submission');
        },
        headerButtonClick: function (event) {

            var view = new AboutView();
            $.mobile.jqmNavigator.pushView(view);
        }
    });
    return DetailView;
});