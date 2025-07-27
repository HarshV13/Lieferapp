async function loadMeals() {
  const response = await fetch('meals.json');
  const meals = await response.json();
}
loadMeals();