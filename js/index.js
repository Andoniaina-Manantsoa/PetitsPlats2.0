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

//Affichages des recettes
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById("search-recipes");
    const searchBtn = document.getElementById('search-btn');

    function afficherRecettes(data) {
        const container = document.getElementById("recipes-container");
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
            title.className = "card-title fw-bold py-3";
            title.textContent = recette.name;

            // Sous-titre Description
            const descTitle = document.createElement("h6");
            descTitle.className = "fw-bold mt-3 text-secondary";
            descTitle.textContent = "RECETTE";

            // Description
            const desc = document.createElement("p");
            desc.className = "card-text";
            desc.textContent = recette.description;

            // Sous-titre Ingrédients
            const ingTitle = document.createElement("h6");
            ingTitle.className = "fw-bold py-3 text-secondary";
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
    }

    // Fonction qui effectue la rechercheprincipale
    function lancerRecherche() {
        const valeur = searchInput.value.toLowerCase().trim();

        if (valeur.length < 3) {
            // Si moins de 3 caractères => réaffiche toutes les recettes
            afficherRecettes(recipes);
            return;
        }

        const recettesFiltrees = recipes.filter(r =>
            r.name.toLowerCase().includes(valeur) || // titre
            r.description.toLowerCase().includes(valeur) || // description
            r.ingredients.some(i => i.ingredient.toLowerCase().includes(valeur)) // ingrédients
        );

        afficherRecettes(recettesFiltrees);
    }

    //Clique sur l’icône = lance recherche
    searchBtn.addEventListener("click", lancerRecherche);

    //Appuie sur Enter = lance recherche
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            lancerRecherche();
        }
    });

    // Afficher toutes les recettes au chargement
    afficherRecettes(recipes);
});

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
function activerFiltre(listId, type) {
    const list = document.getElementById(listId);
    list.addEventListener("click", (e) => {
        if (e.target && e.target.nodeName === "LI") {
            const valeur = e.target.textContent;
            const recettesFiltrees = filtrerRecettesPar(type, valeur);
            afficherRecettes(recettesFiltrees);
        }
    });
}

// Activer le filtrage pour chaque tri
activerFiltre("list-ingredients", "ingredients");
activerFiltre("list-appareils", "appareils");
activerFiltre("list-ustensiles", "ustensiles");

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
        afficherRecettes(recipes);
    }
});


