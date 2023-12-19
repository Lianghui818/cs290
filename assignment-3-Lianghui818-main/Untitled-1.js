/*
 * Write your client-side JS code in this file.  Don't forget to include your
 * name and @oregonstate.edu email address below.
 *
 * Name: Lianghui Wang
 * Email: wangl9@oregonstate.edu
 */

document.getElementById("filter-update-button").addEventListener("click", update);
document.getElementById("sell-something-button").addEventListener("click", modal_toggle);
document.getElementById("modal-close").addEventListener("click", modal_toggle);
document.getElementById("modal-cancel").addEventListener("click", modal_toggle);
document.getElementById("modal-accept").addEventListener("click", modal_accept);

//for the posts things:
var posts = [];
var curr_post = document.getElementById("posts").firstElementChild;
var size = document.getElementById("posts").childElementCount;
posts.push(curr_post);

for (var i = 1; i < size; i++){
    posts.push(curr_post.nextElementSibling);
    curr_post = curr_post.nextElementSibling;
}

//the update function:
function update(){
    var text = document.getElementById("filter-text").value.toLowerCase();
    var minprice = document.getElementById("filter-min-price").value;
    var maxprice = document.getElementById("filter-max-price").value;
    var city = "";
    var city_list = document.getElementById("filter-city");
    var list_size = city_list.childElementCount;
    var condition = [];

    for (var i = 0; i < list_size; i++){
        if (city_list.children[i].selected){
            city = city_list.children[i].text.toLowerCase();
            break;
        }
    }

    var condition_list = document.getElementById("filter-condition");
    var contains = false;

    for (var i = 1; i <= 5; i++){
        if (condition_list.children[i].firstElementChild.checked) {
            condition.push(condition_list.children[i].lastElementChild.textContent.toLowerCase());
        }
    }

    var posts_elem = document.getElementById("posts");
    var size = posts_elem.children.length;

    for (var i = 0; i < size; i++){ 
        posts_elem.removeChild(posts_elem.firstElementChild);
    }

    for (var i = 0; i < posts.length; i++){
        var element = posts[i];
        var price_pass = false;
        var condition_pass = false;
        var ele_title = element.firstElementChild.lastElementChild.firstElementChild.text.toLowerCase();
        var ele_price = element.getAttribute("data-price");
        var ele_city = element.getAttribute("data-city").toLowerCase();
        var ele_condition = element.getAttribute("data-condition");

        if (ele_title.search(text) != -1){
            if ((ele_city == city) || (city == "any") || (city == "")){
                for (var j = 0; j < condition.length; j++){
                    if (ele_condition == condition[j]){
                        condition_pass = true;
                        break;
                    }
                }
                if ((condition_pass) || (condition.length == 0)){
                    if ((minprice == "") && (maxprice == ""))   {  price_pass = true; }
                    else if ((minprice != "") && (maxprice == "") && (ele_price >= minprice)) {    price_pass = true; }
                    else if ((minprice == "") && (maxprice != "") && (ele_price <= maxprice)) {   price_pass = true; }
                    else if ((ele_price >= minprice) && (ele_price <= maxprice) && (maxprice != "") && (minprice != ""))  {  price_pass = true;  }
                }
            }
        }

        if (price_pass){
            posts_elem.appendChild(element);
        }
    }
}


function modal_toggle(){
    document.getElementById("post-text-input").value = "";
    document.getElementById("post-photo-input").value = "";
    document.getElementById("post-price-input").value = "";
    document.getElementById("post-city-input").value = "";
    document.getElementById("post-condition-new").checked = true;

    document.getElementById("modal-backdrop").classList.toggle('hidden');
    document.getElementById("sell-something-modal").classList.toggle('hidden');
}

//add new modal
function modal_accept(){ 
    if (!modal_check_inputs()){
        alert("Please fill in all entries.");
        return;
    }

    var last_post = document.getElementById("posts").lastElementChild;
    var new_ele = last_post.cloneNode(true);
    var condition = "";

    if (document.getElementById("post-condition-new").checked)      condition = "new"; 
    if (document.getElementById("post-condition-excellent").checked)   condition = "excellent"; 
    if (document.getElementById("post-condition-good").checked)    condition = "good";
    if (document.getElementById("post-condition-fair").checked)    condition = "fair";
    if (document.getElementById("post-condition-poor").checked)    condition = "poor";

    new_ele.setAttribute("data-price", document.getElementById("post-price-input").value);
    new_ele.setAttribute("data-city", document.getElementById("post-city-input").value);
    new_ele.setAttribute("data-condition", condition);
    new_ele.firstElementChild.firstElementChild.firstElementChild.setAttribute("src", document.getElementById("post-photo-input").value);
    new_ele.firstElementChild.firstElementChild.firstElementChild.removeAttribute("alt");
    new_ele.firstElementChild.lastElementChild.firstElementChild.textContent = document.getElementById("post-text-input").value;
    new_ele.firstElementChild.lastElementChild.firstElementChild.nextElementSibling.textContent = "$" + document.getElementById("post-price-input").value;
    new_ele.firstElementChild.lastElementChild.lastElementChild.textContent = "(" + document.getElementById("post-city-input").value + ")";

    var list = document.getElementById("filter-city");
    var cities = list.childElementCount - 1;
    var city_entered = document.getElementById("post-city-input").value
    var exists = false;

    for (var i = 1; i < cities; i++){
        var node_text = document.getElementById("filter-city").children[i].text.toLowerCase();
        var city_entered_lowc = city_entered.toLowerCase();
        if (node_text == city_entered_lowc){
            exists = true;
            break;
        }
    }
    if (!exists){
        var elem = document.createElement("option");
        var city = city_entered[0].toUpperCase();
        for(var i = 1; i < city_entered.length; i++){
            city += city_entered[i].toLowerCase();
        }
        elem.text = city;
        list.appendChild(elem);
    }
    posts.push(new_ele);
    document.getElementById("posts").appendChild(new_ele);
    modal_toggle();
}

function modal_check_inputs() {
    if (document.getElementById("post-text-input").value == "" || document.getElementById("post-photo-input").value == "" || document.getElementById("post-price-input").value == "" || document.getElementById("post-city-input").value == "")
        return false;
    return true;
}

