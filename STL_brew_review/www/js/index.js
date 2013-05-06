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

var breweries = new Array(

);

var beers = new Array();

/* #1 */
document.addEventListener("DOMContentLoaded", function () {
    getXHR('http://stlbrewreview.com/breweries.json', getBreweries);
}, false);

/* #2 */
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
        breweries[i] = JSONobj[i];
        addBreweryToLocalStorage(breweries[i]);
        addBreweryToList(breweries[i]);
    }
    listenAfterContentLoaded();
}

function addBreweryToList(brewery) {
    var breweryList = document.getElementById('breweryList');
    var newBrewery = brewery;
    var newBreweryListItem = document.createElement('li');
    newBreweryListItem.setAttribute('data-id', brewery.id);
    newBreweryListItem.innerHTML = newBrewery.name;
    breweryList.appendChild(newBreweryListItem);
    x$('#breweryList li').addClass('item');
}

function listenAfterContentLoaded() {
    x$(".item").click(function () {
        var breweryID = this.getAttribute('data-id');
        var backButton = document.getElementById('backButton');
        var backButtonText = document.getElementById('backButtonText')
        populateDetailsPanel(breweryID);

        x$("#breweryListWrapper").removeClass('active');
        x$("#breweryDetailsLinksWrapper").addClass('active');
        x$("#backButton").addClass('active');

        backButton.setAttribute('data-previous-page', 'Breweries');
        backButtonText.innerHTML = backButton.getAttribute('data-previous-page');
    });
    x$("#backButton").click(function () {
        x$("#breweryListWrapper").addClass('active');
        x$("#breweryDetailsLinksWrapper").removeClass('active');
        x$("#backButton").removeClass('active');
        clearDetailsPanels();
    });

    x$('#beerLink').click(function () {
        var shortName;
        var beerLink = document.getElementById('beerLink');
        shortName = beerLink.getAttribute('data-shortname');

        x$('#breweryDetailsLinksWrapper').removeClass('active');
        x$('#beerListWrapper').addClass('active');
        var i = 0;

        parseBeers(shortName);
    });

    x$(".beer").click(function () {
        var beerId = this.getAttribute('data-beer-id');
        populateBeerDetailsPanel(beerId);
        x$('#beerListWrapper').removeClass('active');
        x$('#beerDetailsWrapper').addClass('active');
    });
}

function clearDetailsPanels() {
    x$('#breweryLinks li').remove();
    x$('#breweryDetails img').remove();
    x$('#breweryDetails p').remove();
}

function populateDetailsPanel(id) {

    x$('#beerLink').removeClass('item');

    var breweryName = getBreweryName(id);
    var breweryLocation = getBreweryAddress(id);

    var breweryEmail = getBreweryEmail(id);
    var phone = getBreweryPhone(id);
    var website = getBreweryWebsiteURL(id);
    var twitter_handle = getBreweryTwitterHandle(id);
    var facebook_url = getBreweryFacebookURL(id);
    var breweryShortName = getBreweryShortName(id);

    var breweryDetailPanel = document.getElementById('breweryDetails');
    var breweryLinkPanel = document.getElementById('breweryLinks');
    var logoWrapper = document.getElementById('logoWrapper');
    var beerLink = document.getElementById('beerLink');

    var newDetailTitle = document.createElement('h2');

    var facebookLink = document.createElement('a');
    var twitterLink = document.createElement('a');
    var websiteLink = document.createElement('a');
    var phoneLink = document.createElement('a');
    var emailLink = document.createElement('a');
    var viewLocationLink = document.createElement('a');

    facebookLink.setAttribute("href", facebook_url);
    twitterLink.setAttribute("href", twitter_handle);
    websiteLink.setAttribute("href", website);
    phoneLink.setAttribute("href", '#');
    emailLink.setAttribute("href", '#');
    viewLocationLink.setAttribute("href", '#');

    newDetailTitle.innerHTML = breweryName;

    viewLocationLink.innerHTML = "View Location";
    phoneLink.innerHTML = 'Call Phone';
    emailLink.innerHTML = 'Email';
    facebookLink.innerHTML = 'View Facebook';
    twitterLink.innerHTML = 'View Tweets';
    websiteLink.innerHTML = 'View Website';

    addLink(viewLocationLink);
    addLink(phoneLink);
    addLink(emailLink);
    addLink(facebookLink);
    addLink(twitterLink);
    addLink(websiteLink);

    function addLink(link) {
        var linkWrapper = document.createElement('li');
        linkWrapper.appendChild(link);
        breweryLinkPanel.appendChild(linkWrapper);
    }

    var descriptionText = getBreweryDescription(id);
    var description = document.createElement('p');
    var descriptionWrapper = document.getElementById('descriptionWrapper');
    x$(description).addClass("description");
    description.innerHTML = descriptionText;
    descriptionWrapper.appendChild(description);

    var breweryLogoURL = getBreweryLogo(id);
    var newLogo = document.createElement('img');
    newLogo.setAttribute("src", breweryLogoURL);
    x$(newLogo).addClass("breweryLogo");
    logoWrapper.appendChild(newLogo);
    beerLink.setAttribute('data-shortname', breweryShortName);

}

// Brewery Info Retrieval Functions //

function getBreweryName(id) {
    var breweryNameKey = "beer_name." + id;
    return window.localStorage.getItem(breweryNameKey);
}
function getBreweryAddress(id) {
    var addressKey = "address." + id;
    return window.localStorage.getItem(addressKey);
}
function getBreweryLogo(id) {
    var image_url_key = "image_url." + id;
    return window.localStorage.getItem(image_url_key);
}
function getBreweryEmail(id) {
    var email_key = "email." + id;
    return window.localStorage.getItem(email_key);
}
function getBreweryPhone(id) {
    var phone_key = "phone." + id;
    return window.localStorage.getItem(phone_key);
}
function getBreweryWebsiteURL(id) {
    var website_key = "website_url." + id;
    return window.localStorage.getItem(website_key);
}
function getBreweryTwitterHandle(id) {
    var twitter_handle_key = "twitter_handle." + id;
    return window.localStorage.getItem(twitter_handle_key);
}
function getBreweryFacebookURL(id) {
    var facebook_key = "facebook_url." + id;
    return window.localStorage.getItem(facebook_key);
}
function getBreweryDescription(id) {
    var description_key = "description." + id;
    return window.localStorage.getItem(description_key);
}

function getBreweryShortName(id) {
    var short_name_key = "short_name." + id;
    return window.localStorage.getItem(short_name_key);
}

// Beer Info Retrieval Functions //

function getBeerName(id) {
    var short_name_key = "beer_name." + id;
    return window.localStorage.getItem(short_name_key);
}

function getBeerADV(id) {
    var adv_key = "adv." + id;
    return window.localStorage.getItem(adv_key);
}

function getBeerAppearance(id) {
    var appearance_key = "appearance." + id;
    return window.localStorage.getItem(appearance_key);
}

function getBeerBreweryId(id) {
    var brewery_key = "brewery." + id;
    return window.localStorage.getItem(brewery_key);
}

function getBeerCreatedAt(id) {
    var created_at_key = "beer_created_at" + id;
    return window.localStorage.getItem(created_at_key);
}

function getBeerDescription(id) {
    var beer_description_key = "beer_description." + id;
    return window.localStorage.getItem(beer_description_key);
}

function getBeerHops(id) {
    var hops_key = "hops." + id;
    return window.localStorage.getItem(hops_key);
}

function getBeerIBU(id) {
    var ibu_key = "ibu." + id;
    return window.localStorage.getItem(ibu_key);
}

function getBeerImageUrl(id) {
    var beer_image_url_key = "beer_image_url." + id;
    return window.localStorage.getItem(beer_image_url_key);
}

function getBeerProductionStatus(id) {
    var in_production_key = "in_production." + id;
    return window.localStorage.getItem(in_production_key);
}

function getBeerMalts(id) {
    var malts_key = "matls." + id;
    return window.localStorage.getItem(malts_key);
}

function getBeerOg(id) {
    var og_key = "og." + id;
    return window.localStorage.getItem(og_key);
}

function getBeerProcess(id) {
    var process_key = "process." + id;
    return window.localStorage.getItem(process_key);
}

function getBeerShortName(id) {
    var beer_short_name_key = "beer_short_name." + id;
    return window.localStorage.getItem(beer_short_name_key);
}

function getBeerSrm(id) {
    var srm_key = "srm." + id;
    return window.localStorage.getItem(srm_key);
}

function getBeerUpdatedAt(id) {
    var beer_updated_at_key = "beer_updated_at." + id;
    return window.localStorage.getItem(beer_updated_at_key);
}

function getBeerYeast(id) {
    var yeast_key = "yeast." + id;
    return window.localStorage.getItem(yeast_key);
}


function addBreweryToLocalStorage(breweryArrayToStore) {
    var id = breweryArrayToStore.id;
    var id_key = "id." + id;
    var address_key = "address." + id;
    var created_at_key = "created." + id;
    var description_key = "description." + id;
    var email_key = "email." + id;
    var facebook_url_key = "facebook_url." + id;
    var image_left_key = "image_left." + id;
    var image_top_key = "image_top." + id;
    var image_url_key = "image_url." + id;
    var name_key = "name." + id;
    var phone_key = "phone." + id;
    var phone_number_key = "phone_number." + id;
    var rss_url_key = "rss_url." + id;
    var short_name_key = "short_name." + id;
    var twitter_handle_key = "twitter_handle." + id;
    var updated_at_key = "updated_at." + id;
    var website_url_key = "website_url." + id;

    window.localStorage.setItem(id_key, id);
    window.localStorage.setItem(address_key, breweryArrayToStore.address);
    window.localStorage.setItem(created_at_key, breweryArrayToStore.created_at);
    window.localStorage.setItem(description_key, breweryArrayToStore.description);
    window.localStorage.setItem(email_key, breweryArrayToStore.email);
    window.localStorage.setItem(facebook_url_key, breweryArrayToStore.facebook_url);
    window.localStorage.setItem(image_left_key, breweryArrayToStore.image_left);
    window.localStorage.setItem(image_top_key, breweryArrayToStore.image_top);
    window.localStorage.setItem(image_url_key, breweryArrayToStore.image_url);
    window.localStorage.setItem(name_key, breweryArrayToStore.name);
    window.localStorage.setItem(phone_key, breweryArrayToStore.phone);
    window.localStorage.setItem(phone_number_key, breweryArrayToStore.phone_number);
    window.localStorage.setItem(rss_url_key, breweryArrayToStore.rss_url);
    window.localStorage.setItem(short_name_key, breweryArrayToStore.short_name);
    window.localStorage.setItem(twitter_handle_key, breweryArrayToStore.twitter_handle);
    window.localStorage.setItem(updated_at_key, breweryArrayToStore.updated_at);
    window.localStorage.setItem(website_url_key, breweryArrayToStore.website_url);

    //parseBeers(beerURL);
}

function parseBeers(shortName) {
    var beerURL = "http://stlbrewreview.com/saint_louis/breweries/" + shortName + ".json"
    getXHR(beerURL, getBeers);
}

function getBeers(JSONstring) {
    var JSONobj = JSONstring
    if (typeof JSONstring == "string")  JSONobj = JSON.parse(JSONstring);
    var i = 1;
    for (i; i < JSONobj.beers.length; i++) {
        beers[i] = JSONobj.beers[i];
        addBeersToLocalStorage(beers[i]);
        addBeerToList(beers[i]);
    }
    listenAfterContentLoaded();
}

function addBeersToLocalStorage(beer) {
    var id = 'b' + beer.id;
    console.log(id);
    var id_key = "beer_id." + id;
    var abv_key = "abv." + id;
    var appearance_key = "appearance." + id;
    var brewery_id_key = "beer_brewery_id." + id;
    var created_at_key = "beer_created_at." + id;
    var description_key = "beer_description." + id;
    var hops_key = "hops." + id;
    var ibu_key = "ibu." + id;
    var image_url_key = "beer_image_url." + id;
    var in_production_key = "in_production." + id;
    var malts_key = "malts." + id;
    var name_key = "beer_name." + id;
    var og_key = "og." + id;
    var process_key = "process." + id;
    var short_name_key = "beer_short_name." + id;
    var srm_key = "srm." + id;
    var updated_at_key = "beer_last_updated." + id;
    var yeast_key = "yeast." + id;

    window.localStorage.setItem(id_key, id);
    window.localStorage.setItem(abv_key, beer.adv);
    window.localStorage.setItem(appearance_key, beer.appearance);
    window.localStorage.setItem(brewery_id_key, beer.brewery_id);
    window.localStorage.setItem(created_at_key, beer.created_at);
    window.localStorage.setItem(description_key, beer.descrption);
    window.localStorage.setItem(hops_key, beer.hops);
    window.localStorage.setItem(ibu_key, beer.ibu);
    window.localStorage.setItem(image_url_key, beer.image_url);
    window.localStorage.setItem(in_production_key, beer.in_production);
    window.localStorage.setItem(malts_key, beer.malts);
    window.localStorage.setItem(name_key, beer.name);
    window.localStorage.setItem(og_key, beer.og);
    window.localStorage.setItem(process_key, beer.process);
    window.localStorage.setItem(short_name_key, beer.short_name);
    window.localStorage.setItem(srm_key, beer.srm);
    window.localStorage.setItem(updated_at_key, beer.updated_at);
    window.localStorage.setItem(yeast_key, beer.yeast);

}

function addBeerToList(beer) {
    var list = document.getElementById('beerList');
    var listItem = document.createElement('li');
    var name = beer.name;
    var beerId = id;
    var id = 'b' + beer.id;
    listItem.innerHTML = name;
    listItem.setAttribute('data-beer-id', id);
    list.appendChild(listItem);
    // console.log(name);
    x$('#beerList li').addClass('beer');

}


function populateBeerDetailsPanel(beerId) {
    var beerDetailsPanel = document.getElementById('beerDetails');
    var detailsItem = document.createElement('li');
    detailsItem.innerHTML = getBeerName(beerId);
    beerDetailsPanel.appendChild(detailsItem);

}