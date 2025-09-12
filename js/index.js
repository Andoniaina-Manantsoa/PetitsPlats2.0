const searchInput = document.getElementById("search-recipes");
const searchBtn = document.getElementById('search-btn');
const container = document.getElementById("recipes-container");
const tagWrapper = document.getElementById("tag-wrapper");

// --- Listes uniques ---
let ingredients = [];
let appareils = [];
let ustensiles = [];

recipes.forEach(recipe => {
    recipe.ingredients.forEach(i => ingredients.push(i.ingredient.toLowerCase()));
    appareils.push(recipe.appliance.toLowerCase());
    recipe.ustensils.forEach(u => ustensiles.push(u.toLowerCase()));
});

ingredients = [...new Set(ingredients)];
appareils = [...new Set(appareils)];
ustensiles = [...new Set(ustensiles)];

//Affichages des recettes
function displayRecipes(data) {
    container.innerHTML = ""; // On vide avant d'afficher

    data.forEach(recette => {
        // Colonne Bootstrap
        const col = document.createElement("div");
        col.className = "col-md-4";

        // Carte
        const card = document.createElement("div");
        card.className = "card shadow-sm h-100 rounded-3 my-5";

        // Conteneur pour image + badge temps
        const imgWrapper = document.createElement("div");
        imgWrapper.className = "position-relative";

        // Image
        const img = document.createElement("img");
        img.src = `./images/${recette.image}`;
        img.alt = recette.name;
        img.className = "card-img-top img-fluid";
        img.style = "height: 250px; object-fit: cover";

        // Temps
        const time = document.createElement("span");
        time.className = "badge bg-warning text-dark position-absolute top-0 end-0 m-2";
        time.innerHTML = `${recette.time} min`;

        // Corps de carte
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        // Titre
        const title = document.createElement("h5");
        title.className = "card-title py-3";
        title.textContent = recette.name;

        // Sous-titre Description
        const descTitle = document.createElement("h6");
        descTitle.className = "mt-3 text-secondary";
        descTitle.textContent = "RECETTE";

        // Description
        const desc = document.createElement("p");
        desc.className = "card-text";
        desc.textContent = recette.description;

        // Sous-titre Ingrédients
        const ingTitle = document.createElement("h6");
        ingTitle.className = "py-3 text-secondary";
        ingTitle.textContent = "INGREDIENTS";

        // Liste ingrédients
        const ul = document.createElement("ul");
        ul.className = "list-unstyled mb-3 row row-cols-2";

        recette.ingredients.forEach(ing => {
            const li = document.createElement("li");
            li.className = "my-2";

            // Nom de l'ingrédient
            const nom = document.createElement("div");
            nom.textContent = ing.ingredient;
            li.appendChild(nom);

            // Quantité et unité
            if (ing.quantity) {
                const quantite = document.createElement("small"); // petit texte en dessous
                quantite.textContent = ing.quantity + (ing.unit ? ` ${ing.unit}` : "");
                quantite.className = "text-muted d-block"; // d-block pour forcer sur une ligne
                li.appendChild(quantite);
            }

            ul.appendChild(li);
        });

        // Assemblage
        cardBody.appendChild(title);
        cardBody.appendChild(time);

        cardBody.appendChild(descTitle);
        cardBody.appendChild(desc);

        cardBody.appendChild(ingTitle);
        cardBody.appendChild(ul);

        card.appendChild(img);
        card.appendChild(cardBody);

        col.appendChild(card);
        container.appendChild(col);
    });
    // Mise à jour du compteur
    updateNbRecipes(data.length);
}

// Afficher toutes les recettes au chargement
displayRecipes(recipes);

//Fonction mise à jour nombre de recettes dans le résultat de la recherche ou du filtrage.
function updateNbRecipes(count) {
    const nbRecipes = document.getElementById("nbRecipes");
    if (count > 0) {
        nbRecipes.textContent = `${count} recette${count > 1 ? "s" : ""}`;
    } else {
        nbRecipes.textContent = "Aucune recette trouvée";
    }
}

// Fonction pour ajouter un tag visuel
function addTag(type, valeur) {
    // Vérifie si le tag existe déjà
    if ([...tagWrapper.children].some(tag => tag.dataset.value === valeur.toLowerCase())) {
        return;
    }

    const tag = document.createElement("span");
    tag.className = "badge bg-warning text-dark d-flex align-items-center gap-2 p-2";
    tag.dataset.type = type;
    tag.dataset.value = valeur.toLowerCase();
    tag.innerHTML = `
        ${valeur}
        <i class="bi bi-x-circle-fill" role="button" style="cursor:pointer;"></i>
    `;

    // Supprimer le tag au clic sur la croix
    tag.querySelector("i").addEventListener("click", () => {
        tag.remove();
        applyFilter(); // Recalcule les recettes sans ce tag
    });

    tagWrapper.appendChild(tag);
}

// Fonction pour remplir une liste des tris
function fillList(listElement, items) {
    listElement.innerHTML = ""; items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        li.className = "dropdown-item";
        listElement.appendChild(li);
    });
}

// Remplissage initial 
fillList(document.getElementById("list-ingredients"), ingredients);
fillList(document.getElementById("list-appareils"), appareils);
fillList(document.getElementById("list-ustensiles"), ustensiles);

//--------Filtrer les recettes----------//
// Gestion de filtre des recttes 
function filtrerRecettesPar(type, valeur) {
    valeur = valeur.toLowerCase();
    return recipes.filter(r => {
        if (type === "ingredients") {
            return r.ingredients.some(i => i.ingredient.toLowerCase() === valeur);
        } else if (type === "appareils") {
            return r.appliance.toLowerCase() === valeur;
        } else if (type === "ustensiles") {
            return r.ustensils.some(u => u.toLowerCase() === valeur);
        }
    });
}

//Evenement pour chaque listes
function activeFilter(listId, type) {
    const list = document.getElementById(listId);
    list.addEventListener("click", (e) => {
        if (e.target && e.target.nodeName === "LI") {
            const valeur = e.target.textContent;

            // Ajoute un tag visuel
            addTag(type, valeur);

            // Réapplique les filtres actifs
            applyFilter();
        }
    });
}

// Activer le filtrage pour chaque tri
activeFilter("list-ingredients", "ingredients");
activeFilter("list-appareils", "appareils");
activeFilter("list-ustensiles", "ustensiles");

function applyFilter() {
    let recettesFiltrees = recipes;

    // Pour chaque tag actif, on filtre
    [...tagWrapper.children].forEach(tag => {
        const type = tag.dataset.type;
        const valeur = tag.dataset.value;

        recettesFiltrees = recettesFiltrees.filter(r => {
            if (type === "ingredients") {
                return r.ingredients.some(i => i.ingredient.toLowerCase() === valeur);
            } else if (type === "appareils") {
                return r.appliance.toLowerCase() === valeur;
            } else if (type === "ustensiles") {
                return r.ustensils.some(u => u.toLowerCase() === valeur);
            }
        });
    });

    displayRecipes(recettesFiltrees);
}

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

// Réinitialiser quand on clique en dehors des dropdowns
document.addEventListener("click", (e) => {
    const dropdowns = document.querySelectorAll(".dropdown-menu, .dropdown button");

    // Vérifie si le clic est dans un dropdown
    let insideDropdown = false;
    dropdowns.forEach(d => {
        if (d.contains(e.target)) {
            insideDropdown = true;
        }
    });

    // Si on clique en dehors => réaffiche toutes les recettes
    if (!insideDropdown) {
        displayRecipes(recipes);
    }
});


