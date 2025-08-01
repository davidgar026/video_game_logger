
//Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    // Select all buttons with the `data-modal-id` attribute
    const modalButtons = document.querySelectorAll('[data-modal-id]');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('span[data-close-modal]'); // Select all close spans

    // Function to close a modal
    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none'; // Hide the modal
        }
    };

    // Add click event listeners to open modals
    modalButtons.forEach(button => {
        button.addEventListener('click', () => {

            document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');

            const modalId = button.getAttribute('data-modal-id');
            openModal(modalId);
        });
    });

    // Add click event listeners to close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-close-modal'); // Get the modal ID to close
            console.log("modalId = ", modalId)
            closeModal(modalId);
        });
    });


    // Add click event listeners to close modals when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });

});

const cache = new Map();

//Debounce function to limit API calls
function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

//Fetch games from API
async function fetchGames(query) {
    if (cache.has(query)) return cache.get(query); // Use cached results if available

    try {
        const response = await fetch(`/api/games?search=${query}`);
        const data = await response.json();
        cache.set(query, data); // Store result in cache
        return data;
    } catch (error) {
        console.error("Error fetching games:", error);
        return [];
    }
}

//Function to handle user input (autocomplete) (step3)
async function handleInput(event) {
    const query = event.target.value.trim();
    if (!query) {
        document.getElementById("autocompleteResults").innerHTML = ""; // Clear results if input is empty
        return;
    }
    const results = await fetchGames(query.toLowerCase());
    //results[0].cover['url']
    console.log("before displayResults: results = ", results[0].cover['url'])
    console.log("results = ", results)
    displayResults(results);
    console.log("results = ", results)
}

///Wrap `handleInput` inside `debounce` (300ms delay) (step2)
const debouncedHandleInput = debounce(handleInput, 300);

//Add event listener to the input field (step1)
document.getElementById("gameInput").addEventListener("input", debouncedHandleInput);

//Function to display results (step4)
function displayResults(results) {
    console.log("results in displayResults = ", results[0].cover['url'])
    const resultsContainer = document.getElementById("autocompleteResults");
    resultsContainer.innerHTML = results
        .slice(0, 10) // Show only top 10
        .map(game => game.cover ? `
            <div class="autocomplete-item" data-name="${game.name}" data-url="${game.cover ? game.cover.url : ''}">
                <p class="autoComp-p">${game.name}</p>
                <img class="autoComp-img" src="${game.cover['url'].replace(/\/t_logo_med\//,"/t_cover_small/")}">
            </div>`
            :
            `<div class="autocomplete-item" data-name="${game.name}" data-url="${game.cover ? game.cover.url : ''}">
                <p class="autoComp-p">${game.name}</p>
             </div>`)
        .join("");




    // Event delegation: Listen for clicks inside resultsContainer
    resultsContainer.addEventListener("click", function (event) {
        const item = event.target.closest(".autocomplete-item"); // Ensure the click is on an autocomplete item

        if (item) {
            let selectedGame = item.getAttribute("data-name");
            let selectedUrl = item.getAttribute("data-url");

            document.getElementById("gameInput").value = selectedGame;
            document.getElementById("gameUrl").value = selectedUrl;
            console.log("games url = ", selectedUrl)


            // Display selected game in input field (optional)
            gameInput.value = selectedGame;

            resultsContainer.innerHTML = ""; // Hide dropdown after selection
        }
    });
}

function updateGame(event) {
    event.preventDefault();
    console.log("you clicked!")
}

const getGameView = document.getElementById("viewGameModal");


document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("viewGameModal");

    if (modal) {
        modal.addEventListener("show.bs.modal", (event) => {
            const btn = event.relatedTarget;
            const gameReviewDiv = modal.querySelector("#game-review");
            
            //get textarea input
            const editGameReviewInput = modal.querySelector("#edit-game-review");
            const editItemInput = modal.querySelector("#editItem");
            const editItemInput1 = modal.querySelector("#editItem1");
            const captureGameId = modal.querySelector("#gameId");
            const captureGameId1 = modal.querySelector("#gameId1");
            const gameRatingDiv = modal.querySelector("#game-rating");

            const editBtn = modal.querySelector("#editBtn");
            const saveBtn = modal.querySelector("#saveBtn");
            const cancelBtn = modal.querySelector("#cancelBtn");
            const delBtn = modal.querySelector("#deleteBtn")

            // Retrieve review from the clicked game card
            const gameReview = btn.getAttribute("data-bs-review");

            // Retrieve game id from the clicked game card
            const gameId = btn.getAttribute("data-bs-id");

            //Retrieve game rating from the clicked game card
            const gameRating = btn.getAttribute("data-bs-rating");

            //Retrieve game cover iamge URL from the clicked game card
            const gameCoverUrl = btn.getAttribute("data-bs-coverUrl");

            console.log("game cover URL = ", gameCoverUrl)
    

            // Populate modal fields
            gameReviewDiv.textContent = gameReview;
            editGameReviewInput.value = gameReview;
            captureGameId.value = gameId;
            gameRatingDiv.innerHTML = `${gameRating}/5`

            // Show edit button, hide save/cancel initially
            editBtn.style.display = "inline-block";
            saveBtn.style.display = "none";
            cancelBtn.style.display = "none";
            editGameReviewInput.style.display = "none";

            // Handle Edit Button Click
            editBtn.addEventListener("click", () => {
                gameReviewDiv.style.display = "none";
                editGameReviewInput.style.display = "block";
                editBtn.style.display = "none";
                saveBtn.style.display = "inline-block";
                cancelBtn.style.display = "inline-block";
                delBtn.style.display = "none";
            });

            // Handle Cancel Button Click
            cancelBtn.addEventListener("click", () => {
                gameReviewDiv.style.display = "block";
                editGameReviewInput.style.display = "none";
                editBtn.style.display = "inline-block";
                saveBtn.style.display = "none";
                cancelBtn.style.display = "none";
                delBtn.style.display = "inline-block";
            });

            // Handle Save Button Click
            saveBtn.addEventListener("click", () => {
                   
                const updatedReview = editGameReviewInput.value;
                editItemInput1.value = updatedReview; //#editItem
                captureGameId1.value = captureGameId.value; //#gameId

                // Submit form to the backend
                document.getElementById("editForm").submit();
            });

            //Handle Delete Button Click
            delBtn.addEventListener("click", () => {
                document.getElementById("deleteGameRevEntry").submit();
            })
        });
    }
});


// window.onbeforeunload = () => true;








