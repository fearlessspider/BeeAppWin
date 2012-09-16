/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
require.config({
    paths:{
        // RequireJS plugin
        text:'libs/text',
        // RequireJS plugin
        domReady:'libs/domReady',
        // underscore library
        underscore:'libs/underscore',
        // Backbone.js library
        Backbone:'libs/backbone',
        // jQuery
        jquery:'libs/jquery',
        // jQuery Mobile framework
        jqm:'libs/jquery.mobile',
        // jQuery Mobile plugin for Backbone views navigation
        jqmNavigator:'libs/jqmNavigator',
        jquerySwipe:'libs/jquery.swipe.min',
        // RequireJS plugin
        //array:'libs/array',
    },
    shim:{
        Backbone:{
            deps:['underscore', 'jquery'],
            exports:'Backbone'
        },
        underscore:{
            exports:'_'
        },
        jqm:{
            deps:['jquery', 'jqmNavigator']
        }
    }
});

require(['domReady', 'views/HomeView', 'jqm'],
    function (domReady, HomeView) {

        // domReady is RequireJS plugin that triggers when DOM is ready
        domReady(function () {

            function onDeviceReady(desktop) {
                // Hiding splash screen when app is loaded
                //if (desktop !== true)
                    cordova.exec(null, null, 'SplashScreen', 'hide', []);



                // Setting jQM pageContainer to #container div, this solves some jQM flickers & jumps
                // I covered it here: http://outof.me/fixing-flickers-jumps-of-jquery-mobile-transitions-in-phonegap-apps/
                $.mobile.pageContainer = $('#container');
                $('#container').removeClass('app');
                // Setting default transition to slide
                $.mobile.defaultPageTransition = 'slide';

                // Pushing MainView
                $.mobile.jqmNavigator.pushView(new HomeView());
            }

                document.addEventListener('deviceready', onDeviceReady, false);

        });

    });
