// API Configuration
const API_BASE_URL = 'https://opendossier.pro/api';

// Step-by-step guide functionality
let currentStep = 1;
const totalSteps = 5;
let configData = ''; // Store the configuration data

async function fetchSnippet(vaultName) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    // Check if code parameter exists
    if (!code) {
        configData = 'Error: No invite code found in URL. Please access this page with a valid invite code.';
        return;
    }
    
    try {
        const response = await fetch(`/aws-api/invite?code=${code}`);
        const data = await response.json();
        if (data.uri) {
            // Extract just the URI from the response
            configData = data.uri;
            console.log('Generated URI:', data.uri);
        } else if (data.snippet) {
            // Fallback to old format if needed
            const snippetJson = JSON.stringify(data.snippet);  // Stringify
            const encodedData = encodeURIComponent(snippetJson);  // URL-encode
            const vault = vaultName || 'dossier';  // Use provided name or default to 'dossier'
            const uri = `obsidian://remotely-save?func=settings&version=0.5.25&vault=${vault}&data=${encodedData}`;
            
            // Store the configuration data for display in the next step
            configData = uri;
            
            console.log('Generated URI:', uri);
        } else {
            throw new Error('Error? please try later');
        }
    } catch (err) {
        console.log(err);
        configData = 'Error: Failed to fetch configuration data. Please try again later.';
    }
}

function showNextStep() {
    // Special handling for step 2 (vault setup)
    if (currentStep === 1) {
        const vaultName = document.getElementById('vaultName').value.trim();
        fetchSnippet(vaultName);
    }
    
    // Show next step (don't hide current)
    currentStep++;
    if (currentStep <= totalSteps) {
        const nextStepElement = document.getElementById(`step${currentStep}`);
        if (nextStepElement) {
            nextStepElement.classList.add('active');
            
            // If showing step 3, populate the config data
            if (currentStep === 3) {
                const configTextarea = document.getElementById('configData');
                if (configTextarea && configData) {
                    configTextarea.value = configData;
                }
            }
            
            // Smooth scroll to the new step
            setTimeout(() => {
                nextStepElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    } else {
        // If we've reached the end (step 5), redirect to contact page
        window.open('https://www.probepointanalytics.com/contact', '_blank');
    }
}

// Initialize the guide
document.addEventListener('DOMContentLoaded', function() {
    // Show only the first step initially
    for (let i = 2; i <= totalSteps; i++) {
        const stepElement = document.getElementById(`step${i}`);
        if (stepElement) {
            stepElement.classList.remove('active');
        }
    }
    
    // Add event listeners to all next buttons
    for (let i = 1; i <= 5; i++) {
        const nextBtn = document.getElementById(`nextBtn${i}`);
        if (nextBtn) {
            nextBtn.addEventListener('click', showNextStep);
        }
    }
    
    // Add event listener for copy button
    const copyBtn = document.getElementById('copyConfigBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const configTextarea = document.getElementById('configData');
            if (configTextarea && configTextarea.value) {
                configTextarea.select();
                document.execCommand('copy');
                showSuccess('Configuration data copied to clipboard!', 'Copied');
            } else {
                showError('No configuration data to copy. Please complete the previous step first.', 'No Data');
            }
        });
    }
});
