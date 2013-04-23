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

/*var aBreweryDetail = {
    breweryName: "cereal",
    address: ""
}*/

/*
 var app = {
 // Application Constructor
 initialize: function () {
 this.bindEvents();
 },
 // Bind Event Listeners
 //
 // Bind any events that are required on startup. Common events are:
 // 'load', 'deviceready', 'offline', and 'online'.
 bindEvents: function () {
 document.addEventListener('deviceready', this.onDeviceReady, false);
 },
 // deviceready Event Handler
 //
 // The scope of 'this' is the event. In order to call the 'receivedEvent'
 // function, we must explicity call 'app.receivedEvent(...);'
 onDeviceReady: function () {
 app.receivedEvent('deviceready');
 },
 // Update DOM on a Received Event
 receivedEvent: function (id) {
 var parentElement = document.getElementById(id);
 var listeningElement = parentElement.querySelector('.listening');
 var receivedElement = parentElement.querySelector('.received');

 listeningElement.setAttribute('style', 'display:none;');
 receivedElement.setAttribute('style', 'display:block;');

 console.log('Received Event: ' + id);
 }
 };  */
var breweries;

function getXHR(url, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200 || this.status == 0) {
                callback(this.responseText);
            } else {
                console.log("something went wrong");
            }
        }
    }
    req.open('GET', url, true);
    req.send();
}

function getBreweries(JSONstring) {
    var JSONobj = JSONstring
    if (typeof JSONstring == "string")  JSONobj = JSON.parse(JSONstring);

    var i = 1;
    for (i; i < JSONobj.length; i++) {
        //breweries = window.localStorage.key(i);
        //window.localStorage.key(i)
        breweries = JSONobj[i];
        console.log(breweries.address);
    }
}



document.addEventListener("DOMContentLoaded", function () {
    getXHR('http://stlbrewreview.com/breweries.json', getBreweries);
    alert('you');
    
    test();
    var breweryList = document.getElementById('breweryList');
    //var foodField = document.getElementById('foodName');

    var length = window.localStorage.length;
    var i = 0;
    var storedBreweryName;
    for (i; i < length; i++) {
        console.log(window.localStorage.key(i));
        /*console.log(storedBreweryName = window.localStorage.key(i));
        if (storedBreweryName.match(/^food[.]/)) {
            addNewBrewery(window.localStorage.getItem(storedBreweryName), i)
        } */
    }


    /*function addNewBrewery(breweryName, foodID) {
        alert('you2');
        var newBreweryItem = document.createElement('li');
        newBreweryItem.innerHTML = breweryName + " (key: " + foodID + ")";
        breweryList.appendChild(newBreweryItem);

        aBreweryDetail.breweryName = breweryName;
        document.getElementById("breweryDescription").innerHTML = markup;

    }  */


    /*for (i; i < length; i++) {
        storedBreweryName = breweries.key(i);
        console.log(storedBreweryName.address);
    } */

}, false);

/*function renderOurTemplate(view, callback) {
    function doRender(template, view) {
        console.log("rending now")
        callback(Mustache.to_html(template, view))
    }

    if (storedTemplate) {
        console.log("template is stored - we can render immediately")
        doRender(storedTemplate, view);
    } else {
        console.log("template isn't stored - need to request it");
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200 || this.status == 0) {
                    storedTemplate = this.responseText;
                    doRender(storedTemplate, view);
                } else {
                    console.log("something went wrong");
                }
            }
        }
        req.open("GET", "brewery_detail.mustache", true);
        req.send();
    }
}  */

/*for (var propName in jsonObj) {
 if (jsonObj.hasOwnProperty(propName)) {
 return propName;    // or do something with it and break
 }
 }*/