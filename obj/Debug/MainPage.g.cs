﻿#pragma checksum "E:\BlackBerry\phonegap-2.6.0\phonegap-2.6.0\lib\windows-phone-7\BeeApp\MainPage.xaml" "{406ea660-64cf-4c82-b6f0-42d48172a799}" "62EE8092B0806AEB7D227D181990A4A6"
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.296
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using Microsoft.Phone.Controls;
using System;
using System.Windows;
using System.Windows.Automation;
using System.Windows.Automation.Peers;
using System.Windows.Automation.Provider;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Interop;
using System.Windows.Markup;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Resources;
using System.Windows.Shapes;
using System.Windows.Threading;
using WPCordovaClassLib;


namespace CordovaExample {
    
    
    public partial class MainPage : Microsoft.Phone.Controls.PhoneApplicationPage {
        
        internal System.Windows.Controls.Grid LayoutRoot;
        
        internal WPCordovaClassLib.CordovaView PGView;
        
        internal System.Windows.Controls.Image SplashImage;
        
        internal System.Windows.Media.PlaneProjection SplashProjector;
        
        private bool _contentLoaded;
        
        /// <summary>
        /// InitializeComponent
        /// </summary>
        [System.Diagnostics.DebuggerNonUserCodeAttribute()]
        public void InitializeComponent() {
            if (_contentLoaded) {
                return;
            }
            _contentLoaded = true;
            System.Windows.Application.LoadComponent(this, new System.Uri("/CordovaExample;component/MainPage.xaml", System.UriKind.Relative));
            this.LayoutRoot = ((System.Windows.Controls.Grid)(this.FindName("LayoutRoot")));
            this.PGView = ((WPCordovaClassLib.CordovaView)(this.FindName("PGView")));
            this.SplashImage = ((System.Windows.Controls.Image)(this.FindName("SplashImage")));
            this.SplashProjector = ((System.Windows.Media.PlaneProjection)(this.FindName("SplashProjector")));
        }
    }
}

