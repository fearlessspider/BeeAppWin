define(['jquery', 'underscore', 'Backbone', 'views/IdentifyView', 'views/AboutView', 'text!views/HomeView.html'],
    function ($, _, Backbone, IdentifyView, AboutView, HomeViewTemplate) {
        var HomeView = Backbone.View.extend({

            events:{
                "click #takeAPhoto":"takeAPhoto",
                "click #chooseAPhoto":"chooseAPhoto",
                "click #about":"headerButtonClick"
            },
            render:function () {
                this.$el.html(_.template(HomeViewTemplate));
                return this;
            },
            takeAPhoto:function (e) {
                $(this).attr("disabled", "disabled");
                $(this).unbind('click');
                $.mobile.loading( 'show', {
                    text: 'Loading',
                    textVisible: true,
                    theme: 'a',
                    html: ""
                });
                //sourceType: 0 - photo album
                //sourceType: 1 - camera
                navigator.camera.getPicture(function(data) {
                    var view = new IdentifyView({image:data});
                    // this is where you would send the image file to server
                    //output image to screen
                    $.mobile.jqmNavigator.pushView(view);
                },
                function(data){
                    $.mobile.loading('hide');
                },
                {
                    sourceType:1,
                    quality:50,
                    destinationType : Camera.DestinationType.FILE_URI,
                    saveToPhotoAlbum: true
                });
            },

            chooseAPhoto:function (e) {
                $(this).attr("disabled", "disabled");
                $(this).unbind('click');
                $.mobile.loading( 'show', {
                    text: 'Loading',
                    textVisible: true,
                    theme: 'a',
                    html: ""
                });
                //sourceType: 0 - photo album
                //sourceType: 1 - camera
                navigator.camera.getPicture(function(data) {
                    var view = new IdentifyView({image:data});
                    // this is where you would send the image file to server
                    //output image to screen
                    $.mobile.jqmNavigator.pushView(view);
                },
                function(data){
                    $.mobile.loading('hide');
                },
                {
                    sourceType:0,
                    quality:50,
                    destinationType : Camera.DestinationType.FILE_URI
                });
            },
            headerButtonClick: function (event) {

                var view = new AboutView();
                $.mobile.jqmNavigator.pushView(view);
            }
        });
        return HomeView;
    });