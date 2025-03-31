     // API credentials (replace with yours if needed)
        const APP_ID = "14b386ae";
        const APP_KEY = "b8e073a467549737d57b590cf9379c1b";
        const USER_ID = "YOUR_USER_ID"; // You need to create/set this
        
        async function getRecipes() {
            const input = document.getElementById("ingredients").value.trim();
            if (!input) {
                alert("Please enter some ingredients!");
                return;
            }

            const recipesDiv = document.getElementById("recipes");
            recipesDiv.innerHTML = '<div class="loading">Searching for recipes...</div>';

            try {
                const response = await fetch(
                    `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(input)}&app_id=${APP_ID}&app_key=${APP_KEY}`,
                    {
                        headers: {
                            'Edamam-Account-User': USER_ID,
                            'Accept': 'application/json'
                        }
                    }
                );
                
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} - ${await response.text()}`);
                }
                
                const data = await response.json();
                
                if (data.hits?.length > 0) {
                    displayRecipes(data.hits);
                } else {
                    recipesDiv.innerHTML = '<div class="error">No recipes found. Try different ingredients!</div>';
                }
                
            } catch (error) {
                recipesDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
                console.error("API Error:", error);
            }
        }

        function displayRecipes(recipes) {
            const recipesDiv = document.getElementById("recipes");
            
            let html = `<h2 style="text-align: center;">Found ${recipes.length} Recipes</h2>`;
            
            recipes.forEach(item => {
                const recipe = item.recipe;
                html += `
                    <div class="recipe-card">
                        <div class="recipe-title">${recipe.label}</div>
                        <img class="recipe-image" src="${recipe.image}" alt="${recipe.label}">
                        <div class="recipe-ingredients">
                            <strong>Ingredients:</strong>
                            <ul>${recipe.ingredientLines.map(ing => `<li>${ing}</li>`).join('')}</ul>
                        </div>
                        <a class="view-recipe" href="${recipe.url}" target="_blank">View Full Recipe →</a>
                    </div>
                `;
            });

            recipesDiv.innerHTML = html;
        }

        // Enter key support
        document.getElementById("ingredients").addEventListener("keypress", (e) => {
            if (e.key === "Enter") getRecipes();
        });
