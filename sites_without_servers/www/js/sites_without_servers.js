
var aFoodDetail = {
    foodName: "cereal",
    timeOfDay: function () {
    return this.foodName.length > 7 ? "evening" : "morning";
    }
}

var storedTemplate = null;
function renderOurTemplate(view, callback) {
    function doRender(template, view) {
        console.log("rending now")
        callback(Mustache.to_html(template, view))
    }

    if (storedTemplate) {
        console.log("template is stored - we can render immediately")
        doRender(storedTemplate, view);
    } else {
        console.log("template isn't stored - need to request it");
        var reg = new XMLHttpRequest();
        reg.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200 || this.status == 0) {
                    storedTemplate = this.responseText;
                    doRender(storedTemplate, view);
                } else {
                    console.log("something went wrong");
                }
            }
        }
        reg.open("GET", "food_detail.mustache", true);
        reg.send();
    }
}
document.addEventListener("DOMContentLoaded", function () {
    var foodList = document.getElementById('foodList');
    var foodField = document.getElementById('foodName');

    var length = window.localStorage.length;
    var i = 0;
    var storedFoodName;

    function addNewFoodItem(foodName) {
        var newFoodItem = document.createElement('li');
        newFoodItem.innerHTML = foodName;
        foodList.appendChild(newFoodItem);

        aFoodDetail.foodName = foodName;
        renderOurTemplate(aFoodDetail, function (markup) {
            document.getElementById("foodDescription").innerHTML = markup;
        });
    }

    for (i; i < length; i++) {
        storedFoodName = window.localStorage.key(i);
        if (storedFoodName.match(/^food[.]/)) {
            addNewFoodItem(window.localStorage.getItem(storedFoodName))
        }
    }

    document.getElementById("foodForm").addEventListener("submit", function (evt) {
        evt.preventDefault();
        var newFood = foodField.value;
        var foodKey = "food." + (window.localStorage.length + 1);
        addNewFoodItem(newFood);
        window.localStorage.setItem(foodKey, newFood);
        foodField.value = "";
        return false;
    }, false);

    document.getElementById("clear").addEventListener("click", function(evt) {
        localStorage.clear();
    });
}, false);
