// Récupérer listes uniques 
// Ingrédients
let ingredients = [];
recipes.forEach(recipe => {
    recipe.ingredients.forEach(i => {
        ingredients.push(i.ingredient.toLowerCase());
    });
});
// Supprimer doublons avec Set
ingredients = [...new Set(ingredients)];

// Appareils
let appareils = [];
recipes.forEach(recipe => {
    appareils.push(recipe.appliance.toLowerCase());
});
appareils = [...new Set(appareils)];

// Ustensiles
let ustensiles = [];
recipes.forEach(recipe => {
    recipe.ustensils.forEach(u => {
        ustensiles.push(u.toLowerCase());
    });
});
ustensiles = [...new Set(ustensiles)];


// Fonction pour remplir une liste 
function remplirListe(listElement, items) {
    listElement.innerHTML = ""; items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        li.className = "dropdown-item";
        listElement.appendChild(li);
    });
}

// Remplissage initial 
remplirListe(document.getElementById("list-ingredients"), ingredients);
remplirListe(document.getElementById("list-appareils"), appareils);
remplirListe(document.getElementById("list-ustensiles"), ustensiles);

// Fonction de recherche interne 
function filtrerListe(inputId, listId, data) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    input.addEventListener("input", () => {
        const valeur = input.value.toLowerCase();
        const filtres = data.filter(item =>
            item.includes(valeur));
        remplirListe(list, filtres);
    });
}
// Activer la recherche dans chaque tri 
filtrerListe("search-ingredients", "list-ingredients", ingredients);
filtrerListe("search-appareils", "list-appareils", appareils);
filtrerListe("search-ustensiles", "list-ustensiles", ustensiles);

//Affichages des recettes