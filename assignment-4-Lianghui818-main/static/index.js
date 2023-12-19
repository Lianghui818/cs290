/*
 * Add the contents of your index.js file from Assignment 3 here to see the
 * interactions you implemented.  This is not required for your grade on this
 * assignment, but it'll allow you to have the full experience of the site
 * as we've implemented it so far.
 */

/*
 * Write your client-side JS code in this file.  Don't forget to include your
 * name and @oregonstate.edu email address below.
 *
 * Name: Lianghui Wang
 * Email: wangl9@oregonstate.edu
 */

document.getElementById("filter-update-button").addEventListener("click", update);
document.getElementById("sell-something-button").addEventListener("click", modal_hidden);
document.getElementById("modal-close").addEventListener("click", modal_hidden);
document.getElementById("modal-cancel").addEventListener("click", modal_hidden);
document.getElementById("modal-accept").addEventListener("click", accept);

//posts:
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
    var min_price_input = document.getElementById("filter-min-price").value;
    var max_price_input = document.getElementById("filter-max-price").value;
    var city = "";
    var city_list = document.getElementById("filter-city");
    var city_list_size = city_list.childElementCount;
    var condition = [];
    var condition_list = document.getElementById("filter-condition")

    var min_price = min_price_input ? parseFloat(min_price_input):null;
    var max_price = max_price_input ? parseFloat(max_price_input):null;
    

    for (var i = 0; i < city_list_size; i++){
        if (city_list.children[i].selected){
            city = city_list.children[i].text.toLowerCase();
            break;
        }
    }

    for (var i = 1; i <= 5; i++){
        if (condition_list.children[i].firstElementChild.checked) {
            condition.push(condition_list.children[i].lastElementChild.textContent.toLowerCase());
        }
    }

    var posts_all = document.getElementById("posts");
    var num = posts_all.children.length;

    for (var i = 0; i < num; i++){ 
        posts_all.removeChild(posts_all.firstElementChild);
    }

    for (var i = 0; i < posts.length; i++){
        var post_things = posts[i];
        var price_pass = false;
        var condition_pass = false;
        var post_title = post_things.firstElementChild.lastElementChild.firstElementChild.text.toLowerCase();
        // var post_price = post_things.getAttribute("data-price");
        var post_price_value = parseFloat(post_things.getAttribute("data-price"));
        var post_city = post_things.getAttribute("data-city").toLowerCase();
        var post_condition = post_things.getAttribute("data-condition");

        if (post_title.search(text) != -1){
            if ((post_city == city) || (city == "any") || (city == "")){
                for (var j = 0; j < condition.length; j++){
                    if (post_condition == condition[j]){
                        condition_pass = true;
                        break;
                    }
                }
                if ((condition_pass) || (condition.length == 0)){
                    if ((min_price === null || post_price_value >= min_price) && 
                    (max_price === null || post_price_value <= max_price)){
                        price_pass = true;
                    }
                }
            }
        }

        if (price_pass){
            posts_all.appendChild(post_things);
        }
    }
}

// the modal hidden/cancle hidden function
function modal_hidden(){ 
    document.getElementById("modal-backdrop").classList.toggle('hidden');
    document.getElementById("sell-something-modal").classList.toggle('hidden');

    document.getElementById("post-text-input").value = "";
    document.getElementById("post-photo-input").value = "";
    document.getElementById("post-price-input").value = "";
    document.getElementById("post-city-input").value = "";
    document.getElementById("post-condition-new").checked = true;

}

//add new post
function accept(){ 
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
    modal_hidden();
}

function modal_check_inputs() {
    if (document.getElementById("post-text-input").value == "" || document.getElementById("post-photo-input").value == "" || document.getElementById("post-price-input").value == "" || document.getElementById("post-city-input").value == ""){
        return false;
    }
    return true;
}

alert('JS successfully loaded.');
