define(['jquery', 'underscore', 'Backbone', 'text!views/LocationView.html', 'views/AboutView'],
    function ($, _, Backbone, LocationViewTemplate, AboutView) {
        var LocationView = Backbone.View.extend({
            map : {},
            image : "",
            initialize: function (options) {
                        this.image = options.image;
                        this.render();
                        this.view = this.$el;
                        this.getLocation();
                    },
            events:{
                "click #back":"back",
                "click #send":"buttonClick",
                "click #publish_button": "publishStory",
                "click #about":"headerButtonClick",
                "click #changeLocation":"changeLocation"
            },
            render:function () {
                this.$el.html(_.template(LocationViewTemplate));
                $("#gmap").width( $("#gmap").parent().width() );
                $("#gmap").height( $(window).height() - 100 );
                return this;
            },
            back:function(event) {
                $.mobile.jqmNavigator.popView();
            },
            buttonClick: function () {
                navigator.notification.alert('Thank you for submitting this photo. Our expert identified the bee as a Red-tailed cuckoo rather than a Red-shanked carder bee. You correctly identified the abdomen (rear body), the face and the thorax (central body); however, the wings and the pollen basket are different. Although some of these features may not be visible in your photograph, the following advice might be helpful for next time you are in the field. The Red-tailed cuckoo does not have a pollen basket whereas the Red-shanked carder bee has a pollen basket. The Red-tailed cuckoo\'s wings are smokey dark whereas the Red-shanked carder bee\'s wings are clear. This feedback can also be viewed by logging into BeeWatch and clicking on the relevant photo.',null,'Feedback for submission');
            },

            getLocation: function () {
                var self = this;
                setTimeout( function() {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var lat = parseFloat(position.coords.latitude);
                        var lng = parseFloat(position.coords.longitude);
                        var latlng = new google.maps.LatLng(lat, lng);
                        var div = $("#gmap").get(0);

                        self.map  = new google.maps.Map(div, {
                                    	mapTypeId: google.maps.MapTypeId.ROADMAP,
                                    	center: latlng,
                                    	zoom: 15
                                        });
                        var marker = new google.maps.Marker({
                                    	    map: self.map,
                                    	    position: latlng
                                        });
                    }, function (error) {
                        alert(error.message);
                    });
                }, 100 );
            },
            changeLocation: function () {
                var self = this;
                setTimeout( function() {
                    var address = $("#address").val();
                    geocoder = new google.maps.Geocoder();
                    geocoder.geocode( { 'address': address}, function(results, status) {
                          if (status == google.maps.GeocoderStatus.OK) {
                            //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
                            self.map.setCenter(results[0].geometry.location);
                            var marker = new google.maps.Marker({
                                map: self.map,
                                position: results[0].geometry.location
                            });
                          } else {
                            alert("Geocode was not successful for the following reason: " + status);
                          }
                        });
                }, 100 );
            },
            //Publish a story to the user's own wall
            publishStory: function() {
                    $.mobile.loading( 'show', {
                        text: 'Loading',
                        textVisible: true,
                        theme: 'a',
                        html: ""
                    });
                window.resolveLocalFileSystemURI(this.image, function(fileEntry) {
                            fileEntry.file(function(fileObj) {

                                var fileName = fileObj.fullPath;
                                var options = new FileUploadOptions();
                                options.fileKey="file";
                                options.fileName=fileName.substr(fileName.lastIndexOf('/')+1);
                                options.mimeType="image/jpeg";
                                var ft = new FileTransfer();
                                ft.upload(fileName ,encodeURI('http://soil.pl/upload.php'), function(data) {
                                console.log(data);
                                $.mobile.loading('hide');
                                FB.login(function(response) {
                                                    console.log('logged in');
                                                    if (response.authResponse) {
                                                      FB.ui({
                                                        method: 'feed',
                                                        name: 'Identify the species of the bumblebee',
                                                        caption: 'BeeInvolved',
                                                        description: 'Check out BeeInvolved for Mobile Device to identify the species of the bumblebee.',
                                                        picture: 'http://soil.pl/uploads/' + options.fileName
                                                      },
                                                      function(response) {
                                                        console.log('publishStory UI response: ', response);
                                                      });
                                                    } else {
                                                        console.log('not logged in');
                                                    }
                                                },
                                                { scope: "email" }
                                                );
                                },
                                function(data) {
                                                        },options);

                            });
                        });
            },
            headerButtonClick: function (event) {

                var view = new AboutView();
                $.mobile.jqmNavigator.pushView(view);
            }

        });
        return LocationView;
    });