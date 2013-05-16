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
    key: "",
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
    key: "",
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

var breweries = [];
var beers = [];

var storedTemplate = null;

document.addEventListener("DOMContentLoaded", function () {
    getXHR('http://stlbrewreview.com/breweries.json', getBreweries);
    x$('html').scroll(function(){

    });
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
        aBrewery[i].key = i;
        breweries.push(aBrewery[i]);
    }
    beginRender({"breweries":breweries}, "brewery_list.mustache", "breweryListScreen");
    /*x$('#breweryListScreen').addClass('active');*/
}

function parseBeersAndGenerateBeerList(brewery) {
    var brewery = brewery.getAttribute("data-short-name");
    var beerURL = "http://stlbrewreview.com/saint_louis/breweries/" + brewery + ".json";

    x$('.screen').removeClass('active');
    x$('.screen').removeClass('previousScreen');
    x$('.screen').removeClass('nextScreen');

    x$('#breweryDetailsScreen').addClass('previousScreen');
    x$('#beerListScreen').addClass('active');
    x$('#beerDetailsScreen').addClass('nextScreen');
    getXHR(beerURL, getBeers);
}

function getAndRenderBreweryDetails(breweryKey) {
    beginRender(aBrewery[breweryKey], "brewery_details.mustache", "breweryDetailsScreen");
    x$('.screen').removeClass('active');
    x$('.screen').removeClass('previousScreen');
    x$('.screen').removeClass('nextScreen');

    x$('#breweryListScreen').addClass('previousScreen');
    x$('#breweryDetailsScreen').addClass('active');
    x$('#beerListScreen').addClass('nextScreen');
}

function getAndRenderBeerDetails(beerKey) {
    beginRender(aBeer[beerKey], "beer_details.mustache", "beerDetailsScreen");
    x$('.screen').removeClass('previousScreen');
    x$('.screen').removeClass('active');
    x$('.screen').removeClass('nextScreen');

    x$('#beerListScreen').addClass('previousScreen');
    x$('#beerDetailsScreen').addClass('active');

}

function getBeers(JSONstring) {
    var JSONobj = JSONstring
    if (typeof JSONstring == "string")  JSONobj = JSON.parse(JSONstring);
    var i = 0;
    beers = [];
    if (JSONobj.beers.length > 0) {
        for (i; i < JSONobj.beers.length; i++) {
            aBeer[i] = JSONobj.beers[i];
            aBeer[i].key = i;
            beers.push(aBeer[i]);
            console.log("beer key " + [i] +": "+ aBeer[i].key);
        }
        beginRender({"beers":beers}, "beer_list.mustache", "beerListScreen");
    } else {
        console.log("no beers");
        beginRender({"beers":beers}, "no_beer.mustache", "beerListScreen");
    }
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

function backButtonClicked (buttonNumber) {
    var backButtonToSearchFor = "backButton" + buttonNumber;
    var backButton = document.getElementById(backButtonToSearchFor);
    var previousPage = backButton.getAttribute("data-previous-page");
    x$('.screen').removeClass('previousScreen');
    x$('.screen').removeClass('active');
    document.getElementById(previousPage).className += " active";
}



function goURL(url) {
    window.open(url);
}