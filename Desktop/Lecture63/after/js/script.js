$(function () { 
  // Code pour gérer le DOM à l'aide de jQuery
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});

(function (global) {

  var dc = {};
  
  var homeHtml = "snippets/home-snippet.html";
  var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
  var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";
  
  // Fonction pour insérer du HTML
  var insertHtml = function (selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };
  
  // Afficher l'icône de chargement
  var showLoading = function (selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };
  
  // Remplacer les propriétés dans une chaîne
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string
      .replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }
  
  // Chargement initial de la page
  document.addEventListener("DOMContentLoaded", function (event) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      function (categories) {
        // Sélectionner une catégorie aléatoire
        var randomIndex = Math.floor(Math.random() * categories.length);
        var randomCategoryShortName = categories[randomIndex].short_name;
        
        // Charger la page d'accueil
        $ajaxUtils.sendGetRequest(
          homeHtml,
          function (responseText) {
            document.querySelector("#main-content").innerHTML = 
              insertProperty(responseText, "randomCategoryShortName", randomCategoryShortName);
          },
          false);
      },
      true);
  });
  
  // Charger les catégories du menu
  dc.loadMenuCategories = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowCategoriesHTML);
  };
  
  // Charger les éléments du menu pour une catégorie spécifique
  dc.loadMenuItems = function (categoryShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
      menuItemsUrl + categoryShort + ".json",
      buildAndShowMenuItemsHTML);
  };
  
  // Construire et afficher le HTML des catégories
  function buildAndShowCategoriesHTML (categories) {
    // Vérifier si categories est défini et est un tableau
    if (!Array.isArray(categories)) {
      console.error("Les catégories ne sont pas un tableau valide");
      return;
    }
  
    $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
        $ajaxUtils.sendGetRequest(
          categoryHtml,
          function (categoryHtml) {
            var categoriesViewHtml =
              buildCategoriesViewHtml(categories,
                                      categoriesTitleHtml,
                                      categoryHtml);
            insertHtml("#main-content", categoriesViewHtml);
          },
          false);
      },
      false);
  }
  
  // Construire le HTML pour la vue des catégories
  function buildCategoriesViewHtml(categories,
                                   categoriesTitleHtml,
                                   categoryHtml) {
    var finalHtml = categoriesTitleHtml;
    finalHtml += "<section class='row'>";
  
    for (var i = 0; i < categories.length; i++) {
      var html = categoryHtml;
      var name = "" + categories[i].name;
      var short_name = categories[i].short_name;
      html = insertProperty(html, "name", name);
      html = insertProperty(html, "short_name", short_name);
      finalHtml += html;
    }
  
    finalHtml += "</section>";
    return finalHtml;
  }
  
  // Construire et afficher le HTML des éléments du menu
  function buildAndShowMenuItemsHTML (categoryMenuItems) {
    $ajaxUtils.sendGetRequest(
      menuItemsTitleHtml,
      function (menuItemsTitleHtml) {
        $ajaxUtils.sendGetRequest(
          menuItemHtml,
          function (menuItemHtml) {
            var menuItemsViewHtml = 
              buildMenuItemsViewHtml(categoryMenuItems,
                                     menuItemsTitleHtml,
                                     menuItemHtml);
            insertHtml("#main-content", menuItemsViewHtml);
          },
          false);
      },
      false);
  }
  
  // Construire le HTML pour la vue des éléments du menu
  function buildMenuItemsViewHtml(categoryMenuItems,
                                  menuItemsTitleHtml,
                                  menuItemHtml) {
    menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
                                        "name",
                                        categoryMenuItems.category.name);
    menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,
                                        "special_instructions",
                                        categoryMenuItems.category.special_instructions);
  
    var finalHtml = menuItemsTitleHtml;
    finalHtml += "<section class='row'>";
  
    var menuItems = categoryMenuItems.menu_items;
    var catShortName = categoryMenuItems.category.short_name;
    for (var i = 0; i < menuItems.length; i++) {
      var html = menuItemHtml;
      html = insertProperty(html, "short_name", menuItems[i].short_name);
      html = insertProperty(html, "catShortName", catShortName);
      html = insertItemPrice(html, "price_small", menuItems[i].price_small);
      html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
      html = insertItemPrice(html, "price_large", menuItems[i].price_large);
      html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
      html = insertProperty(html, "name", menuItems[i].name);
      html = insertProperty(html, "description", menuItems[i].description);
  
      finalHtml += html;
    }
  
    finalHtml += "</section>";
    return finalHtml;
  }
  
  // Fonction auxiliaire pour insérer le prix des éléments du menu
  function insertItemPrice(html, pricePropName, priceValue) {
    if (!priceValue) {
      return insertProperty(html, pricePropName, "");
    }
    priceValue = "$" + priceValue.toFixed(2);
    html = insertProperty(html, pricePropName, priceValue);
    return html;
  }
  
  // Fonction auxiliaire pour insérer le nom de la portion des éléments du menu
  function insertItemPortionName(html, portionPropName, portionValue) {
    if (!portionValue) {
      return insertProperty(html, portionPropName, "");
    }
    portionValue = "(" + portionValue + ")";
    html = insertProperty(html, portionPropName, portionValue);
    return html;
  }
  
  global.$dc = dc;
  
  })(window);