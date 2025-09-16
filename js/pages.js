const searchInput = document.getElementById("search-recipes");
const searchBtn = document.getElementById('search-btn');
const container = document.getElementById("recipes-container");
const tagWrapper = document.getElementById("tag-wrapper");
const clearBtn = document.getElementById("clear-search");

// --- Listes uniques ---
let ingredients = [];
let appareils = [];
let ustensiles = [];

// Extraire ingrédients / appareils / ustensiles
for (let i = 0; i < recipes.length; i++) {
    let recipe = recipes[i];

    for (let j = 0; j < recipe.ingredients.length; j++) {
        ingredients.push(recipe.ingredients[j].ingredient.toLowerCase());
    }

    appareils.push(recipe.appliance.toLowerCase());

    for (let k = 0; k < recipe.ustensils.length; k++) {
        ustensiles.push(recipe.ustensils[k].toLowerCase());
    }
}

// Supprimer doublons
function removeDuplicates(array) {
    let unique = [];
    for (let i = 0; i < array.length; i++) {
        let exists = false;
        for (let j = 0; j < unique.length; j++) {
            if (unique[j] === array[i]) {
                exists = true;
                break;
            }
        }
        if (!exists) unique.push(array[i]);
    }
    return unique;
}

ingredients = removeDuplicates(ingredients);
appareils = removeDuplicates(appareils);
ustensiles = removeDuplicates(ustensiles);

// --- Affichage des recettes ---
function displayRecipes(data) {
    container.innerHTML = "";

    if (data.length === 0) {
        const recherche = searchInput.value.trim();
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3>Aucune recette ne contient "${recherche}". Essayez « tarte aux pommes », « poisson », etc.</h3>
            </div>`;
        updateNbRecipes(0);
        return;
    }

    for (let i = 0; i < data.length; i++) {
        let recette = data[i];

        const col = document.createElement("div");
        col.className = "col-md-4";

        const card = document.createElement("div");
        card.className = "card shadow-sm h-100 my-5";

        const img = document.createElement("img");
        img.src = `./images/${recette.image}`;
        img.alt = recette.name;
        img.className = "card-img-top img-fluid";
        img.style = "height: 250px; object-fit: cover; border-radius: 20px 20px 0 0";

        const time = document.createElement("span");
        time.className = "badge bg-warning text-dark position-absolute top-0 end-0 m-3 p-2 rounded-pill";
        time.innerHTML = `${recette.time} min`;

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const title = document.createElement("h5");
        title.className = "card-title py-3";
        title.textContent = recette.name;

        const descTitle = document.createElement("h6");
        descTitle.className = "mt-3 text-secondary";
        descTitle.textContent = "RECETTE";

        const desc = document.createElement("p");
        desc.className = "card-text";
        desc.textContent = recette.description;

        const ingTitle = document.createElement("h6");
        ingTitle.className = "py-3 text-secondary";
        ingTitle.textContent = "INGREDIENTS";

        const ul = document.createElement("ul");
        ul.className = "list-unstyled mb-3 row row-cols-2";

        for (let j = 0; j < recette.ingredients.length; j++) {
            let ing = recette.ingredients[j];
            const li = document.createElement("li");
            li.className = "my-2";

            const nom = document.createElement("div");
            nom.textContent = ing.ingredient;
            li.appendChild(nom);

            if (ing.quantity) {
                const quantite = document.createElement("small");
                quantite.textContent = ing.quantity + (ing.unit ? ` ${ing.unit}` : "");
                quantite.className = "text-muted d-block";
                li.appendChild(quantite);
            }

            ul.appendChild(li);
        }

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
    }
    updateNbRecipes(data.length);
}

// --- Compteur ---
function updateNbRecipes(count) {
    const nbRecipes = document.getElementById("nbRecipes");
    nbRecipes.textContent = count > 0 ? `${count} recette${count > 1 ? "s" : ""}` : "Aucune recette trouvée";
}

// --- Tags ---
function addTag(type, valeur) {
    let children = tagWrapper.children;
    for (let i = 0; i < children.length; i++) {
        if (children[i].dataset.value === valeur.toLowerCase()) {
            return;
        }
    }

    const tag = document.createElement("span");
    tag.className = "badge bg-warning text-dark d-flex align-items-center gap-4 my-3 p-3";
    tag.dataset.type = type;
    tag.dataset.value = valeur.toLowerCase();
    tag.innerHTML = `
        ${valeur}
        <i class="bi bi-x" role="button" style="cursor:pointer;"></i>
    `;

    tag.querySelector("i").addEventListener("click", () => {
        tag.remove();
        applyFilter();
    });

    tagWrapper.appendChild(tag);
}

// --- Remplir listes ---
function fillList(listElement, items) {
    listElement.innerHTML = "";
    for (let i = 0; i < items.length; i++) {
        const li = document.createElement("li");
        li.textContent = items[i];
        li.className = "dropdown-item";
        listElement.appendChild(li);
    }
}

fillList(document.getElementById("list-ingredients"), ingredients);
fillList(document.getElementById("list-appareils"), appareils);
fillList(document.getElementById("list-ustensiles"), ustensiles);

// --- Activer filtres ---
function activeFilter(listId, type) {
    const list = document.getElementById(listId);
    list.addEventListener("click", (e) => {
        if (e.target && e.target.nodeName === "LI") {
            const valeur = e.target.textContent;
            addTag(type, valeur);
            applyFilter();
        }
    });
}
activeFilter("list-ingredients", "ingredients");
activeFilter("list-appareils", "appareils");
activeFilter("list-ustensiles", "ustensiles");

// --- Appliquer filtres ---
function applyFilter() {
    let recettesFiltrees = [];

    const valeurRecherche = searchInput.value.trim().toLowerCase();
    if (valeurRecherche.length >= 3) {
        for (let i = 0; i < recipes.length; i++) {
            let r = recipes[i];
            let match = false;

            if (r.name.toLowerCase().indexOf(valeurRecherche) !== -1 ||
                r.description.toLowerCase().indexOf(valeurRecherche) !== -1) {
                match = true;
            } else {
                for (let j = 0; j < r.ingredients.length; j++) {
                    if (r.ingredients[j].ingredient.toLowerCase().indexOf(valeurRecherche) !== -1) {
                        match = true;
                        break;
                    }
                }
            }
            if (match) recettesFiltrees.push(r);
        }
    } else {
        recettesFiltrees = recipes.slice();
    }

    let tags = tagWrapper.children;
    for (let t = 0; t < tags.length; t++) {
        let type = tags[t].dataset.type;
        let valeur = tags[t].dataset.value;
        let temp = [];

        for (let i = 0; i < recettesFiltrees.length; i++) {
            let r = recettesFiltrees[i];
            let match = false;

            if (type === "ingredients") {
                for (let j = 0; j < r.ingredients.length; j++) {
                    if (r.ingredients[j].ingredient.toLowerCase() === valeur) {
                        match = true;
                        break;
                    }
                }
            } else if (type === "appareils") {
                if (r.appliance.toLowerCase() === valeur) match = true;
            } else if (type === "ustensiles") {
                for (let k = 0; k < r.ustensils.length; k++) {
                    if (r.ustensils[k].toLowerCase() === valeur) {
                        match = true;
                        break;
                    }
                }
            }
            if (match) temp.push(r);
        }
        recettesFiltrees = temp;
    }

    displayRecipes(recettesFiltrees);
}

// --- Recherche principale ---
searchInput.addEventListener("input", () => {
    clearBtn.style.display = searchInput.value.trim().length > 0 ? "inline-flex" : "none";
    applyFilter();
});
clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.style.display = "none";
    applyFilter();
});

// --- Recherche interne ---
function filtrerListe(inputId, listId, data) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    input.addEventListener("input", () => {
        const valeur = input.value.toLowerCase();
        let filtres = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].indexOf(valeur) !== -1) filtres.push(data[i]);
        }
        fillList(list, filtres);
    });
}
filtrerListe("search-ingredients", "list-ingredients", ingredients);
filtrerListe("search-appareils", "list-appareils", appareils);
filtrerListe("search-ustensiles", "list-ustensiles", ustensiles);

// --- Fermer dropdowns en dehors ---
document.addEventListener("click", (e) => {
    const dropdowns = document.querySelectorAll(".dropdown-menu, .dropdown button");
    let insideDropdown = false;

    for (let i = 0; i < dropdowns.length; i++) {
        if (dropdowns[i].contains(e.target)) {
            insideDropdown = true;
            break;
        }
    }

    if (!insideDropdown) applyFilter();
});

// --- Lancer ---
displayRecipes(recipes);
