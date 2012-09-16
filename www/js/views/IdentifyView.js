define(['jquery', 'underscore', 'Backbone', 'views/DetailView', 'text!views/IdentifyView.html', 'views/SendSMSView', 'views/AboutView'],
    function ($, _, Backbone, DetailView, IdentifyViewTemplate, SendSMSView, AboutView) {
        var IdentifyView = Backbone.View.extend({

    type_filter: [
        "lapidarius, monticola, ruderarius, sylvarum, pratorum, hortorum, ruderatus, jonellus, lucorum, distinguendus, soroeensis, terrestris, hypnorum, pascuorum, muscorum, humilis",
        "rupestris, sylvestris, bohemicus, barbutellus, campestris, vestalis"
    ],

    thorax_filter: [
        "lapidarius, monticola, ruderarius, rupestris, sylvarum, pratorum, sylvestris, bohemicus, barbutellus, hortorum, ruderatus, jonellus, lucorum, subterraneus, distinguendus, campestris",
        "monticola, pratorum, ruderarius, soroeensis, terrestris, sylvestris, bohemicus, vestalis, lucorum, subterraneus, campestris",
        "lapidarius, ruderarius, rupestris, campestris",
        "hypnorum, pascuorum, muscorum, humilis"
    ],
    abdomen_filter: [
        "lapidarius, monticola, ruderarius, rupestris, pratorum",
        "lapidarius, sylvarum",
        "pratorum, ruderarius, soroeensis, terrestris",
        "sylvestris, bohemicus, barbutellus, vestalis, hypnorum",
        "hortorum, ruderatus, jonellus, lucorum, bartbutellus, sylvestris, bohemicus, subterraneus, vestalis",
        "terrestris, lucorum, soroeensis",
        "distinguendus, subterraneus, pascuorum, muscorum, humilis",
        "campestris, sylvestris, bohemicus"
    ],
    thorax_abdomen_filter: [
        ["lapidarius, monticola, ruderarius, rupestris", "lapidarius, sylvarum", "pratorum, ruderarius", "sylvestris, bohemicus, barbutellus", "hortorum, ruderatus, jonellus, lucorum, barbutellus, sylvestris, bohemicus, subterraneus", "", "distinguendus, subterraneus", "campestris, sylvestris, bohemicus"],
        ["monticola, pratorum", "", "pratorum, ruderarius, soroeensis, terrestris", "sylvestris, bohemicus, vestalis", "sylvestris, lucorum, bohemicus, vestalis, subterraneus", "terrestris, lucorum, soroeensis", "campestris, sylvestris"],
        ["lapidarius, ruderarius, rupestris", "", "", "", "", "", "", "campestris"],
        ["", "", "", "hypnorum", "", "", "pascuorum, muscorum, humilis", ""]
    ],
    face_filter: [
        "lapidarius, monticola, ruderarius, sylvarum, pratorum, jonellus, lucorum, subterraneus, soroeensis, terrestris, hypnorum, pascuorum, muscorum, humilis, rupestris, sylvestris, bohemicus, barbutellus, campestris, vestalis",
        "ruderatus, hortorum, distinguendus"
    ],
    tab_id: "",
    species: [],
    key: {},
    tracks: {},
    image: "",
    startDistance: 0,
    prev_zoom: 1,
    prev_rotate: 0,
    prev_pos: {top:0,left:0,start:0},

    initialize: function (options) {

        this.image = options.image;
        this.render();
        this.view = this.$el;
        this.getLocation();
        window.addEventListener("orientationchange", this.changeOrient, true);
    },

    events: {
        "click #back" : "back",
        "click #key li": "listItemClick",
        "expand #key div": "showTab",
        "click #species a.thumbnail": "showDetail",
        "touchmove #zoom": "zoom",
        "touchstart #zoom": "zoomStart",
        "touchend #zoom": "zoomEnd",
        "click #publish_button": "publishStory",
        "click #sendsms_button": "sendSMS",
        "touchstart #plus": "plus",
        "touchstart #minus": "minus",
        "touchstart #right": "right",
        "touchstart #left": "left",
        "click #about":"headerButtonClick"
    },
    render: function (eventName) {
        this.$el.html(_.template(IdentifyViewTemplate));
                console.log('Received Event: ' + this.image);
                this.$el.find("#cameraPic").attr('src', this.image);
                this.$el.find("#zoomwrapper").height($(window).height()/2);
                this.$el.find("#cameraPic").height($(window).height()/2);
                this.$el.find("#key").css('margin-top',this.$el.find("#cameraPic").height + 'px');

        return this;
    },
            back:function(event) {
                $.mobile.jqmNavigator.popView();
            },

    listItemClick: function (event) {
        event.preventDefault();
        this.$el.find("#" + this.tab_id + " li a").css("background","#ffffff");
        var target = $(event.target);
        while (target.get(0).nodeName.toUpperCase() != "LI") {
            target = target.parent();
        }

        target.children().css("background","#00cc00");
        var id = target.attr("id");
        // set selected tab to green
        $("#" + this.tab_id + " h3 a").css("background","#00d905");

        var parent_id = target.parent().parent().parent().attr("id");
        console.log(parent_id);
        switch (parent_id) {
            case "antenna":
                this.key.antenna = id;
                break;
            case "face":
                this.key.face = id;
                break;
            case "wings":
                this.key.wings = id;
                break;
            case "pollen":
                this.key.pollen_basket = id;
                break;
            case "thorax":
                this.key.thorax = id;
                break;
            case "abdomen":
                this.key.abdomen = id;
                break;
            case "tail":
                this.key.tail = id;
                break;
        }

        // get gender (male or female)
        var gender = this.getGender(this.key);
        console.log(gender);
        // get type (social or cuckoo)
        var type = this.getType(this.key);
        console.log(type);

        if (type == "") {
            this.species = (this.type_filter[0] + ", " + this.type_filter[1]).split(", ");
        }
        if (type == "social") {
            this.species = this.type_filter[0].split(", ");
        }
        if (type == "cuckoo") {
            this.species = this.type_filter[1].split(", ");
        }

        console.log(this.key.thorax);
        console.log(this.key.abdomen);
        console.log(this.key.face);
        // next, filter by thorax
        if (typeof this.key.thorax != 'undefined' && typeof this.key.abdomen == 'undefined') {
            this.species = this.species.intersect(this.thorax_filter[this.key.thorax.substring(6) - 1].split(", "));
        }
        console.log(this.species);
        // or by abdomen
        if (typeof this.key.thorax == 'undefined' && typeof this.key.abdomen != 'undefined') {
            this.species = this.species.intersect(this.abdomen_filter[this.key.abdomen.substring(7) - 1].split(", "));
        }
        console.log(this.species);
        // or by thorax and abdomen
        if (typeof this.key.thorax != 'undefined' && typeof this.key.abdomen != 'undefined') {
            this.species = this.species.intersect(this.thorax_abdomen_filter[this.key.thorax.substring(6) - 1][this.key.abdomen.substring(7) - 1].split(", "));
        }
        console.log(this.species);
        if (typeof this.key.face != 'undefined') {
            this.species = this.species.intersect(this.face_filter[this.key.face.substring(4) - 1].split(", "));
        }
        console.log(this.species);
        this.highlight(this.species);
    },

    showTab: function (event) {
        this.tab_id = $(event.target).attr("id");
        console.log(this.tab_id);
    },

    /**
     * Get bee's gender
     */
    getGender: function (key) {
        switch (key.antenna) {
            case "short_elbowed":
                gender1 = "female";
                break;
            case "long_curved":
                gender1 = "male";
                break;
            default:
                gender1 = "";
        }
        switch (key.tail) {
            case "pointed":
                gender2 = "female";
                break;
            case "rounded":
                gender2 = "male";
                break;
            default:
                gender2 = "";
        }
        if (gender1 == gender2) {
            return gender1;
        }
        else {
            if (gender1 != "" && gender2 == "") return gender1;
            if (gender1 == "" && gender2 != "") return gender2;
            if (gender1 != "" && gender2 != "") {
                navigator.notification.alert("A bumblebee cannot have " + key.antenna + " antenna and " + key.tail + " tail.");
                return "";
            }
        }
    },

    /**
     * Get bee's type
     */
    getType: function (key) {
        switch (key.pollen_basket) {
            case "present":
                social1 = "social";
                break;
            case "absent":
                social1 = "cuckoo";
                break;
            default:
                social1 = "";
        }
        switch (key.wings) {
            case "clear":
                social2 = "social";
                break;
            case "dark":
                social2 = "cuckoo";
                break;
            default:
                social2 = "";
        }
        if (social1 == social2) {
            return social1;
        }
        else {
            if (social1 != "" && social2 != "") {
                navigator.notification.alert("A bumblebee cannot have " + key.pollen_basket + " pollen basket and " + key.wings + " wings.");
                return "";
            }
            if (social1 != "") return social1;
            if (social2 != "") return social2;
        }
    },

    /**
     * Highlight a set of species
     */
    highlight: function (species) {
        $("#species .thumbnails a").each(function () {
            if ($.inArray($(this).attr('title').toLowerCase(), species) > -1) {
                console.log($(this).attr('title'));
                $(this).css('opacity', '1.0');
            }
            else {
                $(this).css('opacity', '0.2');
            }
            $("#selected").text("( " + species.length + " matches )");
        });
    },

    /**
     * Show detail of the specie
     */
    showDetail: function (event) {
        $.mobile.loading( 'show', {
            text: 'Loading',
            textVisible: true,
            theme: 'a',
            html: ""
        });
        var target = $(event.target);
        while (target.get(0).nodeName.toUpperCase() != "A") {
            target = target.parent();
        }
        var id = target.attr("title");
        var view = new DetailView({id:id,image:this.image});

        $.mobile.jqmNavigator.pushView(view);
    },

    zoom: function (event) {
        event.preventDefault();
        //only run code if the user has two fingers touching
        if (event.originalEvent.touches.length === 2) {
                    var X0 = event.originalEvent.touches[0].pageX;
                    var Y0 = event.originalEvent.touches[0].pageY;
                    var X1 = event.originalEvent.touches[1].pageX;
                    var Y1 = event.originalEvent.touches[1].pageY;

            //track the touches, I'm setting each touch as an array inside the tracks array
            //each touch array contains an X and Y coordinate
            var moveDistance = Math.sqrt( Math.pow( (X1 - X0), 2 ) + Math.pow( (Y1 - Y0), 2 ) );

            var zoom = moveDistance / this.startDistance;
            console.log(zoom);
            if (zoom <= 10 && zoom > 0) {
                this.$el.find("#cameraPic").css("-webkit-transform","scale("+(zoom)+")");
                this.prev_zoom = zoom;
            }
            //this.tracks.push([ [event.originalEvent.touches[0].pageX, event.originalEvent.touches[0].pageY], [event.originalEvent.touches[1].pageX, event.originalEvent.touches[1].pageY] ]);
        } else {
            var X0 = event.originalEvent.touches[0].pageX;
            var Y0 = event.originalEvent.touches[0].pageY;
            var offset_left = this.$el.find("#cameraPic").offset()['left'];
            var W = this.$el.find("#cameraPic").width();
            pos_left = this.prev_pos.left+X0-this.prev_pos.startX;
            var offset_top = this.$el.find("#cameraPic").offset()['top'];
            var H = this.$el.find("#cameraPic").height();
            pos_top = this.prev_pos.top+Y0-this.prev_pos.startY;
            this.$el.find("#cameraPic").css("left",pos_left + "px");
            this.$el.find("#cameraPic").css("top",pos_top + "px");
        }
    },

    zoomStart: function(event) {
        event.preventDefault();
        //start-over
        if (event.originalEvent.touches.length === 2) {
                    var X0 = event.originalEvent.touches[0].pageX;
                    var Y0 = event.originalEvent.touches[0].pageY;
                    var X1 = event.originalEvent.touches[1].pageX;
                    var Y1 = event.originalEvent.touches[1].pageY;

                    this.startDistance = Math.sqrt( Math.pow( (X1 - X0), 2 ) + Math.pow( (Y1 - Y0), 2 ) )/this.prev_zoom;
                    }
        this.prev_pos.startX = event.originalEvent.touches[0].pageX/this.prev_zoom;
        this.prev_pos.startY = event.originalEvent.touches[0].pageY/this.prev_zoom;
    },

    zoomEnd: function(event) {
        event.preventDefault();
        if (event.originalEvent.touches.length !== 2) {
            var offset_left = this.$el.find("#cameraPic").offset()['left'];
            var offset_top = this.$el.find("#cameraPic").offset()['top'];
            this.prev_pos.top = offset_top/this.prev_zoom;
            this.prev_pos.left = offset_left/this.prev_zoom;
        }

        //now you can decide the scale that the user chose
        //take the track points that are the closest and determine the difference between them and the points that are the farthest away from each other
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
                                                if (response.authResponse) {
                                                console.log('logged in');
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

    //Send SMS
    sendSMS: function() {
        var view = new SendSMSView();

        $.mobile.jqmNavigator.pushView(view);
    },

    changeOrient: function() {
        console.log("change orient");
        $("#zoomwrapper").height($(window).height()/2);
    },
    getLocation: function () {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = parseFloat(position.coords.latitude);
            var lng = parseFloat(position.coords.longitude);
            var latlng = new google.maps.LatLng(lat, lng);
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': latlng}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                      if (results[0]) {
                        //var arrAddress = results[0].address_components;
                        // iterate through address_component array
                        /*$.each(arrAddress, function (i, address_component) {
                          if (address_component.types[0] == "locality") {
                            console.log(address_component.long_name); // city
                            alert(address_component.long_name);
                            return false; // break
                          }
                        });*/
                        $("#location").html("<h4>" + results[0].formatted_address + "</h4>");
                      } else {
                        alert("No results found for your location");
                      }
                    } else {
                      alert("Geocoder failed due to: " + status);
                    }
                  });
        }, function (error) {
            alert(error.message);
        });
    },
    plus: function(e) {
        event.preventDefault();
        var zoom = this.prev_zoom + 0.1;
        if (zoom <= 10 && zoom > 0) {
            this.$el.find("#cameraPic").css("-webkit-transform","scale("+(zoom)+")");
            this.prev_zoom = zoom;
        }
    },
    minus: function(e) {
        event.preventDefault();
        var zoom = this.prev_zoom - 0.1;
        if (zoom <= 10 && zoom > 0) {
            this.$el.find("#cameraPic").css("-webkit-transform","scale("+(zoom)+")");
            this.prev_zoom = zoom;
        }
    },
    left: function(e) {
        event.preventDefault();
        var rotate = this.prev_rotate - 90;
        this.$el.find("#cameraPic").css("-webkit-transform","rotate("+(rotate)+"deg)");
        this.prev_rotate = rotate;
    },
    right: function(e) {
        event.preventDefault();
        var rotate = this.prev_rotate + 90;
        this.$el.find("#cameraPic").css("-webkit-transform","rotate("+(rotate)+"deg)");
        this.prev_rotate = rotate;
    },
    headerButtonClick: function (event) {

        var view = new AboutView();
        $.mobile.jqmNavigator.pushView(view);
    }
});
return IdentifyView;
});