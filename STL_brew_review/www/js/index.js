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

var aBrewery = {
    name: "",
    address: "",
    image_url: "",
    email: "",
    phone: "",
    website_url: "",
    twitter_handle: "",
    facebook: "",
    description: "",
    short_name: ""
}

var aBeer = {
    name: "",
    adv: "",
    appearance: "",
    brewedBy: "",
    created_at: "",
    description: "",
    hops: "",
    ibu: "",
    image_url: "",
    in_production: "",
    malts: "",
    og: "",
    process: "",
    short_name: "",
    srm: "",
    updated_last: "",
    yeast: ""
};

var beers = [];

var storedTemplate = null;

document.addEventListener("DOMContentLoaded", function () {
    getXHR('http://stlbrewreview.com/breweries.json', getBreweries);
}, false);

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
    var i = 0;
    for (i; i < JSONobj.length; i++) {
        aBrewery[i] = JSONobj[i];
        addBreweryToList(aBrewery[i], i);
    }
    listenAfterContentLoaded();
}

function parseBeersAndGenerateBeerList(brewery) {
    var brewery = brewery.getAttribute("data-short-name");
    var beerURL = "http://stlbrewreview.com/saint_louis/breweries/" + brewery + ".json";
    getXHR(beerURL, getBeers);
}

function getBeers(JSONstring) {
    var JSONobj = JSONstring
    if (typeof JSONstring == "string")  JSONobj = JSON.parse(JSONstring);
    var i = 0;
    if (JSONobj.beers.length > 0) {
        for (i; i < JSONobj.beers.length; i++) {
            aBeer[i] = JSONobj.beers[i];
            console.log(aBeer[i].name);
            beers.push(aBeer[i]);
        }
        beginRender(beers, "beer_list.mustache", "beerListWrapper");
    } else {
        console.log("no beers");
    }
}

function addBreweryToList(brewery, key) {
    var list = document.getElementById('breweryList');
    var listItem = document.createElement('li');
    listItem.innerHTML = brewery.name;
    listItem.setAttribute("data-brewery-key", key);
    listItem.setAttribute("data-short-name", brewery.short_name)
    list.appendChild(listItem);
    x$('#breweryList li').addClass('breweryListItem');
}

function beginRender(brewery, mustache_template, destination) {
    renderOurTemplate(brewery, mustache_template, function (markup) {
        document.getElementById(destination).innerHTML = markup;
    });
}


function renderOurTemplate(view, mustache_template, callback) {
    storedTemplate = null;
    function doRender(template, view) {
        console.log("rendering now")
        callback(Mustache.to_html(template, view))
    }

    if (storedTemplate) {
        console.log("template is stored = we can render immediately")
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
        var templatePath = "templates/" + mustache_template;
        console.log(templatePath);
        req.open("get", templatePath, true);
        req.send();
    }
}

function listenAfterContentLoaded() {

    x$('.breweryListItem').click(function () {
        var breweryKey = this.getAttribute('data-brewery-key');
        beginRender(aBrewery[breweryKey], "brewery_details.mustache", "breweryDetailsLinksWrapper");
        x$('.page').removeClass('active');
        x$('#breweryDetailsLinksWrapper').addClass('active');
    })
}

function goURL(url) {
    window.open(url);
}