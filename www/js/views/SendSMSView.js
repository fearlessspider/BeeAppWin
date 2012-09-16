define(['jquery', 'underscore', 'Backbone', 'text!views/SendSMSView.html', 'views/AboutView'],
    function ($, _, Backbone, SendSMSViewTemplate, AboutView) {
var SendSMSView = Backbone.View.extend({
    bee: "",

    initialize: function (options) {

        this.render();
        this.view = this.$el;
    },

    events: {
        "click #back": "back",
        "click #send": "buttonClick",
        "click #about":"headerButtonClick"
    },

    render: function (eventName) {
        this.$el.html(_.template(SendSMSViewTemplate));
        this.getContactList();
        return this;
    },
                back:function(event) {
                    $.mobile.jqmNavigator.popView();
                },
    buttonClick: function () {
        window.sms.send($('#phone').val(),
                    $('#message').val(),
                    function () {
					   alert('Message sent successfully');
				    },
    				function (e) {
    					alert('Message Failed:' + e);
    				}
				);
    },
    getContactList: function () {
            var contactList = new ContactFindOptions();
            contactList.filter="";
            contactList.multiple=true;
            var fields = ["*"];  //"*" will return all contact fields
            navigator.contacts.find(fields,
                function(contacts) {
                    if (contacts.length > 0) {
                        for (var i=0; i<contacts.length; i++) {
                            if (contacts[i].phoneNumbers) {
                                for (var j=0; j<contacts[i].phoneNumbers.length; j++) {
                                    $("#phone").append('<option value="' + contacts[i].phoneNumbers[j].value + '">' + contacts[i].displayName + ' - ' + contacts[i].phoneNumbers[j].value + '</option>');
                                }
                            }
                            /*)
                            for (var j=0; j<contacts[i].emails.length; j++) {
                                $("#phone").append('<option value="' + contacts[i].emails[j].value + '">' + contacts[i].displayName + ' - ' + contacts[i].emails[j].value + '</option>');
                            }*/
                        }
                    } else {
                        $("#phone").remove();
                        $("#sms_content label").first().append('<div class="ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-c"><input type="tel" name="phone" id="phone" value="" class="ui-input-text ui-body-c"></div>');
                    }
                }, null, contactList );
        },
        headerButtonClick: function (event) {

            var view = new AboutView();
            $.mobile.jqmNavigator.pushView(view);
        }
});
return SendSMSView;
});