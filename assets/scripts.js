document.getElementById('getCocktail').addEventListener('click', () => {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
      .then(response => {
        if (!response.ok) {
          throw new Error('Verkkovirhe');
        }
        return response.json();
      })
      .then(data => {
        const cocktail = data.drinks[0];
        document.getElementById('cocktailDisplay').innerHTML = `
          <h2>${cocktail.strDrink}</h2>
          <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" width="200">
          <p><strong>Category:</strong> ${cocktail.strCategory}</p>
          <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>
          <h3>Ingredients:</h3>
          <ul>
            ${Object.keys(cocktail)
              .filter(key => key.startsWith('strIngredient') && cocktail[key])
              .map(ingredient => `<li>${cocktail[ingredient]}</li>`)
              .join('')}
          </ul>
        `;
      })
      .catch(error => console.error('Error:', error));
  });

  document.getElementById('searchByIngredient').addEventListener('click', () => {
    const ingredient = document.getElementById('ingredientInput').value;
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`)
      .then(response => response.json())
      .then(data => {
        const drinks = data.drinks;
        const resultsDiv = document.getElementById('ingredientResults');  
        resultsDiv.innerHTML = ''; // Tyhjennetään edellinen sisältö
        if (drinks) {
          drinks.forEach(drink => {
            resultsDiv.innerHTML += `
              <h3>${drink.strDrink}</h3>
              <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" width="100">
              <button onclick="getDrinkDetails(${drink.idDrink})">View Details</button>
            `;
          });
        } else {
          resultsDiv.innerHTML = '<p>No drinks found with that ingredient.</p>';
        }
      })
      .catch(error => console.error('Error:', error));
  });
  


  function getDrinkDetails(drinkId) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
      .then(response => response.json())
      .then(data => {
        const drink = data.drinks[0];
        const modalBody = document.getElementById('modalBody');
  
        modalBody.innerHTML = `
          <h2>${drink.strDrink}</h2>
          <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" width="200">
          <p><strong>Category:</strong> ${drink.strCategory}</p>
          <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
          <h3>Ingredients:</h3>
          <ul>
            ${Object.keys(drink)
              .filter(key => key.startsWith('strIngredient') && drink[key])
              .map(ingredient => `<li>${drink[ingredient]}</li>`)
              .join('')}
          </ul>
        `;
  
        // Näytetään modaalinen ikkuna
        const myModal = new bootstrap.Modal(document.getElementById('myModal1'));
        myModal.show();
      })
      .catch(error => console.error('Error:', error));
  }
  
  function getDrinksByIngredient(ingredient) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`)
      .then(response => response.json())
      .then(data => {
        const drinkList = document.getElementById('drinkList');
        drinkList.innerHTML = ''; // Tyhjennetään lista ennen uusien tulosten näyttämistä
        data.drinks.forEach(drink => {
          drinkList.innerHTML += `
            <div>
              <h3>${drink.strDrink}</h3>
              <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" width="100">
              <button onclick="getDrinkDetails(${drink.idDrink})">Näytä ainesosat</button>
             
            </div>
          `;
        });
      })
      .catch(error => console.error('Error fetching drinks:', error));
  }

  document.addEventListener("DOMContentLoaded", function() {
    // Kutsu funktio aloituksen jälkeen (voit myös kutsua käyttäjän syötteen perusteella)
    getDrinksByIngredient(); // tai joku muu ainesosa
  });

  class Theme {
    constructor() {
        this.isDark = false; // Aloita vaalealla teemalla
        this.applyTheme(); // Käytä oletusteemaa
    }

    toggleTheme() {
        this.isDark = !this.isDark; // Vaihda teema
        this.applyTheme(); // Käytä uutta teemaa
    }

    applyTheme() {
        if (this.isDark) {
            document.body.classList.add('dark-theme');
            document.body.style.backgroundImage = "url('assets/image2.jpg')";
        } else {
            document.body.classList.remove('dark-theme');
            document.body.style.backgroundImage = "url('assets/image.jpg')";
        }
    }
}

const theme = new Theme(); // Luo uusi Theme-instanssi

document.getElementById('toggleTheme').addEventListener('click', () => {
    theme.toggleTheme(); // Kutsu toggleTheme-metodia
});