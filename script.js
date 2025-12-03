// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const textModel = document.getElementById('textModel');
    const textPrompt = document.getElementById('textPrompt');
    const generateTextBtn = document.getElementById('generateTextBtn');
    const textOutput = document.getElementById('textOutput');

    const videoModel = document.getElementById('videoModel');
    const videoPrompt = document.getElementById('videoPrompt');
    const generateVideoBtn = document.getElementById('generateVideoBtn');
    const videoOutput = document.getElementById('videoOutput');

    const musicModel = document.getElementById('musicModel');
    const musicPrompt = document.getElementById('musicPrompt');
    const generateMusicBtn = document.getElementById('generateMusicBtn');
    const musicOutput = document.getElementById('musicOutput');

    // --- gpt4free Provider Setup ---
    // We use the 'api.airforce' provider as requested.
    const provider = new G4F.Provider.ApiAirForce();

    // --- Event Listeners ---
    generateTextBtn.addEventListener('click', () => handleGenerate('text'));
    generateVideoBtn.addEventListener('click', () => handleGenerate('video'));
    generateMusicBtn.addEventListener('click', () => handleGenerate('music'));

    // --- Core Logic ---
    async function handleGenerate(type) {
        let prompt, model, outputElement, button;

        // Determine which elements to use based on the type
        switch (type) {
            case 'text':
                prompt = textPrompt.value;
                model = textModel.value; // Uses "claude-opus-4.5" or "gemini-3-pro"
                outputElement = textOutput;
                button = generateTextBtn;
                break;
            case 'video':
                prompt = videoPrompt.value;
                model = videoModel.value; // Uses "sora-2" or "veo-3.1"
                outputElement = videoOutput;
                button = generateVideoBtn;
                break;
            case 'music':
                prompt = musicPrompt.value;
                model = musicModel.value; // Uses "suno-v5"
                outputElement = musicOutput;
                button = generateMusicBtn;
                break;
        }

        if (!prompt) {
            alert('Please enter a prompt.');
            return;
        }

        // Update UI to show loading state
        button.disabled = true;
        button.textContent = `Generating ${type}...`;
        outputElement.innerHTML = `<p class="placeholder-text">Please wait, this can take a while and may fail...</p>`;

        try {
            const g4f = new G4F.G4F({ provider: provider });
            
            // Set options for the API call
            const options = {
                model: model, // Using the exact model names requested
                prompt: prompt,
                // For image/video/music, we expect a URL back
                outputFormat: type === 'text' ? 'text' : 'url'
            };

            const result = await g4f.generate(options);

            // Display the result based on the type
            if (type === 'text') {
                outputElement.textContent = result;
            } else if (type === 'video') {
                // The API might return a direct image URL instead of video.
                // We'll display it in an <img> tag as it's more likely.
                outputElement.innerHTML = `<h4>Generated Video/Image:</h4><img src="${result}" alt="Generated content">`;
            } else if (type === 'music') {
                outputElement.innerHTML = `<h4>Generated Music:</h4><audio controls src="${result}"></audio>`;
            }

        } catch (error) {
            console.error(`Error generating ${type}:`, error);
            // Provide a user-friendly error message
            outputElement.innerHTML = `<p style="color: red;">Failed to generate ${type}. The provider may be down or the model ("${model}") may not exist. This is an expected outcome for these placeholder models.</p>`;
        } finally {
            // Reset UI state
            button.disabled = false;
            button.textContent = `Generate ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        }
    }
});

// --- Tab Switching Function ---
function openTab(evt, tabName) {
    // Hide all tab content
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }

    // Remove the active class from all tab buttons
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }

    // Show the specific tab content and add the "active" class to the button that opened the tab
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}
