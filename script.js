// Selecting DOM elements and storing references to them in variables
const searchBarContainer = document.querySelector(".search-bar-container");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const recipesContainer = document.getElementById("recipesContainer");
const recipeDetailsModal = document.getElementById("recipeDetailsModal");
const recipeTitle = document.getElementById("recipeTitle");
const recipeImage = document.getElementById("recipeImage");
const recipeIngredients = document.getElementById("recipeIngredients");
const recipeInstructions = document.getElementById("recipeInstructions");
const closeButton = document.getElementById("closeButton");
const loader = document.getElementById("loader");
const notification = document.getElementById("notification");

// Initializes an empty array to store recipes
let recipes = [];

// Event listener for form submission
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const searchTerm = searchInput.value.trim();

  // If search term is not empty, call searchRecipes function
  if (searchTerm !== "") {
    await searchRecipes(searchTerm);
  }
});

//Function for recipe search through API
async function searchRecipes(searchTerm) {
  try {
    // Display loader while fetching data
    loader.classList.remove("hidden");

    // Fetch data from API based on search term
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
    );

    // Convert response to JSON format
    const data = await response.json();

    // Store fetched recipes in 'recipes' array or an empty array if no recipes found
    recipes = data.meals || [];
    renderRecipes(recipes);
  } catch (error) {
    console.warn("Error Occured", error);
  } finally {
    // Hide loader after fetching data
    loader.classList.add("hidden");
  }
}

//Function for rendering recipes
function renderRecipes(recipes) {
  // Clear recipes container
  recipesContainer.innerHTML = "";

  // If there are recipes available
  if (recipes.length > 0) {
    // Switch search bar layout to top
    searchBarContainer.classList.replace("search-bar-center", "search-bar-top");

    // Iterate through each recipe and create HTML cards to display them
    recipes.forEach((recipe) => {
      const recipeCard = `<div class = "recipe-card bg-gray-800 rounded shadow p-4 cursor-pointer" data-recipe-id="${recipe.idMeal}">
      <img
        src="${recipe.strMealThumb}"
        alt="${recipe.strMeal}"
        class="w-full h-48 object-cover mb-4 rounded"
      ></img>
      <h2 class="text-lg font-semibold">${recipe.strMeal}</h2>
      </div>`;

      // Append recipe cards to recipes container
      recipesContainer.innerHTML += recipeCard;
    });

    // Hide notification if recipes are found
    notification.classList.add("hidden");
  } else {
    // Switch search bar layout to center if no recipes found
    searchBarContainer.classList.replace("search-bar-top", "search-bar-center");

    // Show notification if no recipes found
    notification.classList.remove("hidden");
  }
}

// Event listener for clicking on recipe cards
recipesContainer.addEventListener("click", (event) => {
  // Find the closest ancestor with class 'recipe-card'
  const recipeCard = event.target.closest(".recipe-card");

  // If a recipe card is found
  if (recipeCard) {
    // Get the dataset recipe ID
    const recipeId = recipeCard.dataset.recipeId;

    // Find the corresponding recipe object from 'recipes' array
    const recipe = recipes.find((recipe) => recipe.idMeal === recipeId);

    // Open the recipe details modal with the selected recipe
    openRecipeDetailsModal(recipe);
  }
});

// Function to open the recipe details modal
function openRecipeDetailsModal(recipe) {
  // Populate modal with recipe details
  recipeTitle.textContent = recipe.strMeal;
  recipeImage.src = recipe.strMealThumb;
  recipeImage.alt = recipe.strMeal;

  recipeIngredients.innerHTML = "";
  recipeInstructions.textContent = "";

  //render Ingredients
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];

    // If both ingredient and measure exist, append to ingredient list
    if (ingredient && measure) {
      const listItem = document.createElement("li");
      listItem.textContent = `${ingredient} --------- ${measure}`;
      recipeIngredients.appendChild(listItem);
    }
  }
  // Render recipe instructions
  recipeInstructions.innerHTML = recipe.strInstructions.replace(
    /[\r\n]+/g,
    "<br><br>"
  );

  // Display the recipe details modal
  recipeDetailsModal.classList.remove("hidden");
}

// Event listener for closing the recipe details modal
closeButton.addEventListener("click", () => {
  // Hide the recipe details modal
  recipeDetailsModal.classList.add("hidden");
});
