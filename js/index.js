// selected elements
const searchMealForm = document.getElementById('search-meal-form');
const searchMealInput = document.getElementById('search-meal-input');
const searchedResultsContainer = document.getElementById(
  'searched-results-container'
);
const selectedMealContainer = document.getElementById(
  'selected-meal-container'
);

// spinner
const spinner = `
<div class="text-center">
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>
`;

// api
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// fetch data
const loadMeals = async (mealName) => {
  searchedResultsContainer.innerHTML = spinner;
  const URL = `${BASE_URL}/search.php?s=${mealName}`;
  const res = await fetch(URL);
  const data = await res.json();
  return data.meals;
};

const loadMealById = async (idMeal) => {
  selectedMealContainer.innerHTML = spinner;
  const URL = `${BASE_URL}/lookup.php?i=${idMeal}`;
  const res = await fetch(URL);
  const data = await res.json();
  return data.meals[0];
};

// get ingredient
const getIngredient = (meal) => {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = `${meal['strIngredient' + i]}`;
    if (ingredient == '') {
      continue;
    }
    ingredients.push(ingredient);
  }

  return ingredients;
};

// display selected meal
const displaySelectedMeal = (meal) => {
  const ingredients = getIngredient(meal);
  const { strMealThumb, strMeal } = meal;
  selectedMealContainer.innerHTML = `
    <div class="col-md-8 col-lg-6">
        <div class="card h-100 border-0">
            <img class="card-img-top" src="${strMealThumb}" alt="${strMeal}" />
            <div class="card-body">
                <h4 class="text-center text-dark-purple fw-bold pb-2">${strMeal}</h4>
                <h5 class="fw-bold py-3 border-top">Meal Ingredients</h5>
                <ul class="ps-0">
                    ${ingredients
                      .map((ingredient) => {
                        return `
                        <li class="list-unstyled my-2">✔ ${ingredient}</li>
                        `;
                      })
                      .join('')}
                </ul>
            </div>
        </div>
    </div>`;
};

// clicked meal
const clickedMeal = (idMeal) => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  loadMealById(idMeal).then((meal) => displaySelectedMeal(meal));
};

// display meals
const displayMeals = (meals) => {
  if (meals.length == 0) {
    searchedResultsContainer.innerHTML = `
        <div class="text-center text-danger">
            Food Not Found!
        </div>
        `;
    return;
  }

  searchedResultsContainer.innerHTML = meals
    .map((meal) => {
      const { idMeal, strMealThumb, strMeal } = meal;
      return `
        <div onclick="clickedMeal('${idMeal}')" class="col-md-6 col-xl-3">
            <div class="card h-100 border-0">
                <img class="card-img-top" src="${strMealThumb}" alt="${strMeal}" />
                <div class="card-body">
                    <h5 class="text-center text-dark-purple fw-bold">${strMeal}</h5>
                </div>
            </div>
        </div>
    `;
    })
    .join('');
};

// handle search
const handleSearch = (event) => {
  event.preventDefault();
  selectedMealContainer.innerHTML = '';
  const searchValue = searchMealInput.value;

  if (searchValue.trim() == '') {
    return;
  }

  loadMeals(searchValue).then((meals) => displayMeals(meals || []));
  searchMealInput.value = '';
};

// event listener
searchMealForm.addEventListener('submit', handleSearch);
