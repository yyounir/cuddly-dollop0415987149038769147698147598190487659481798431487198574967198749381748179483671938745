var el = document.querySelector('.more');
var btn = el.querySelector('.more-btn');
var menu = el.querySelector('.more-menu');
var visible = false;

function toggleDrawer() {
    const drawerNav = document.querySelector('.drawer-nav');
    if (drawerNav.style.left === '0px') {
        drawerNav.style.left = '-600px';
    } else {
        drawerNav.style.left = '0px';
    }
}

btn.addEventListener('click', showMenu, false);

// Pop-up

function openPopup() {
    document.getElementById('popup').style.display = 'flex';
}

function openPopup2() {
    document.getElementById('popup2').style.display = 'flex';
}

function openPopup3() {
    document.getElementById('popup3').style.display = 'flex';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

function closePopup2() {
    document.getElementById('popup2').style.display = 'none';
}
function closePopup3() {
    document.getElementById('popup3').style.display = 'none';
}

//API
// Get references to the DOM elements
        const searchInput = document.getElementById('searchInput');
        const suggestionsContainer = document.getElementById('suggestionsContainer');
        const geminiResponseContainer = document.getElementById('geminiResponseContainer');

        // Mock data for suggestions. In a real application, this would come from an API.
        const allSuggestions = [
            'What is the capital of France?',
            'Explain quantum physics simply.',
            'Tell me a fun fact about cats.',
            'How does photosynthesis work?',
            'Who wrote Romeo and Juliet?',
            'What is the highest mountain in the world?',
            'Define artificial intelligence.',
            'Suggest a recipe for pasta.',
            'What are the benefits of exercise?',
            'History of the internet.'
        ];

        /**
         * Filters suggestions based on the user's input.
         * @param {string} query The search query.
         * @returns {string[]} An array of matching suggestions.
         */
        function filterSuggestions(query) {
            if (!query) {
                return []; // Return empty array if query is empty
            }
            const lowerCaseQuery = query.toLowerCase();
            return allSuggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(lowerCaseQuery)
            ).slice(0, 8); // Limit to 8 suggestions for brevity
        }

        /**
         * Fetches a response from the Gemini API.
         * @param {string} prompt The prompt to send to Gemini.
         */
        async function getGeminiResponse(prompt) {
            if (prompt.trim() === '') {
                geminiResponseContainer.textContent = "Please enter a query to get an AI response.";
                return;
            }

            // Show loading spinner
            geminiResponseContainer.innerHTML = '<div class="loading-spinner"></div><p style="margin-top: 10px;">Generating response...</p>';

            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });

            const payload = { contents: chatHistory };
            const apiKey = "AIzaSyCbcWqrvkmlzvTDfbsaGto2I9hBmtIxzNU"; // Canvas will automatically provide the API key at runtime
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    geminiResponseContainer.textContent = text; // Display the response
                } else {
                    geminiResponseContainer.textContent = "Sorry, I couldn't get a response. Please try again.";
                    console.error("Gemini API response structure unexpected:", result);
                }
            } catch (error) {
                geminiResponseContainer.textContent = "An error occurred while fetching the response. Please check your network connection or try again later.";
                console.error("Error calling Gemini API:", error);
            }
        }

        /**
         * Displays the suggestions in the suggestions container.
         * @param {string[]} suggestions An array of suggestions to display.
         */
        function displaySuggestions(suggestions) {
            suggestionsContainer.innerHTML = ''; // Clear previous suggestions
            if (suggestions.length > 0) {
                suggestions.forEach(suggestion => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.classList.add('suggestion-item');
                    suggestionItem.textContent = suggestion;
                    // Add click listener to each suggestion item
                    suggestionItem.addEventListener('click', () => {
                        searchInput.value = suggestion; // Set search input value
                        suggestionsContainer.classList.remove('show'); // Hide suggestions
                        getGeminiResponse(suggestion); // Get Gemini response
                    });
                    suggestionsContainer.prepend(suggestionItem); // Prepend to display from bottom up
                });
                suggestionsContainer.classList.add('show'); // Show the container
            } else {
                suggestionsContainer.classList.remove('show'); // Hide if no suggestions
            }
        }

        // Event listener for input changes in the search bar
        searchInput.addEventListener('input', (event) => {
            const query = event.target.value.trim(); // Get current input value
            const filtered = filterSuggestions(query); // Filter suggestions
            displaySuggestions(filtered); // Display them
        });

        // Event listener for 'Enter' key press on the search input
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const query = searchInput.value.trim();
                getGeminiResponse(query); // Get Gemini response
                suggestionsContainer.classList.remove('show'); // Hide suggestions after search
            }
        });

        // Event listener to hide suggestions when clicking outside the search area
        document.addEventListener('click', (event) => {
            if (!searchInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
                suggestionsContainer.classList.remove('show');
            }
        });