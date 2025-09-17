// API Configuration
const API_BASE_URL = 'https://opendossier.pro/api';

// Step-by-step guide functionality
let currentStep = 1;
const totalSteps = 5;
let configData = ''; // Store the configuration data

// Add function to extract user ID from configData
function extractUserId(configData) {
    try {
        // Extract the data parameter from the obsidian:// URI
        const dataMatch = configData.match(/data=([^&]+)/);
        if (!dataMatch) return null;
        
        // URL decode the data
        const decodedData = decodeURIComponent(dataMatch[1]);
        
        // Parse the JSON
        const jsonData = JSON.parse(decodedData);
        
        // Extract full user ID from remotePrefix (with "user-" prefix)
        if (jsonData.s3 && jsonData.s3.remotePrefix) {
            const userMatch = jsonData.s3.remotePrefix.match(/user-[a-f0-9]+/);
            return userMatch ? userMatch[0] : null;
        }
        
        return null;
    } catch (error) {
        console.error('Error extracting user ID:', error);
        return null;
    }
}

// Add function to generate data.json with userId
function generateDataJson(userId) {
    const dataJson = {
        "userId": userId,
        "isPlusUser": false,
        "plusLicenseKey": "",
        "openAIApiKey": userId,
        "openAIOrgId": "",
        "huggingfaceApiKey": "",
        "cohereApiKey": "",
        "anthropicApiKey": "",
        "azureOpenAIApiKey": "",
        "azureOpenAIApiInstanceName": "",
        "azureOpenAIApiDeploymentName": "",
        "azureOpenAIApiVersion": "",
        "azureOpenAIApiEmbeddingDeploymentName": "",
        "googleApiKey": "",
        "openRouterAiApiKey": "",
        "xaiApiKey": "",
        "mistralApiKey": "",
        "deepseekApiKey": "",
        "defaultChainType": "llm_chain",
        "defaultModelKey": "gpt-4.1|openai",
        "embeddingModelKey": "text-embedding-3-small|openai",
        "temperature": 0.1,
        "maxTokens": 6000,
        "contextTurns": 15,
        "userSystemPrompt": "",
        "openAIProxyBaseUrl": "",
        "openAIEmbeddingProxyBaseUrl": "",
        "stream": true,
        "defaultSaveFolder": "copilot-conversations",
        "defaultConversationTag": "copilot-conversation",
        "autosaveChat": true,
        "includeActiveNoteAsContext": false,
        "defaultOpenArea": "view",
        "customPromptsFolder": "copilot-custom-prompts",
        "indexVaultToVectorStore": "ON MODE SWITCH",
        "qaExclusions": "copilot-conversations,copilot-custom-prompts",
        "qaInclusions": "",
        "chatNoteContextPath": "",
        "chatNoteContextTags": [],
        "enableIndexSync": true,
        "debug": false,
        "enableEncryption": false,
        "maxSourceChunks": 3,
        "groqApiKey": "",
        "activeModels": [
            {
                "name": "copilot-plus-flash",
                "provider": "copilot-plus",
                "enabled": false,
                "isBuiltIn": true,
                "core": true,
                "plusExclusive": true,
                "projectEnabled": false,
                "capabilities": [
                    "vision"
                ]
            },
            {
                "name": "google/gemini-2.5-flash-lite-preview-06-17",
                "provider": "openrouterai",
                "enabled": false,
                "isBuiltIn": true,
                "core": true,
                "projectEnabled": true,
                "capabilities": [
                    "vision"
                ]
            },
            {
                "name": "google/gemini-2.5-flash",
                "provider": "openrouterai",
                "enabled": false,
                "isBuiltIn": true,
                "core": true,
                "projectEnabled": true,
                "capabilities": [
                    "vision"
                ]
            },
            {
                "name": "google/gemini-2.5-pro",
                "provider": "openrouterai",
                "enabled": false,
                "isBuiltIn": true,
                "core": true,
                "projectEnabled": true,
                "capabilities": [
                    "vision"
                ]
            },
            {
                "name": "gpt-4.1",
                "provider": "openai",
                "enabled": true,
                "isBuiltIn": true,
                "core": true,
                "projectEnabled": true,
                "capabilities": [
                    "vision"
                ],
                "enableCors": true
            },
            {
                "name": "gpt-4.1-mini",
                "provider": "openai",
                "enabled": true,
                "isBuiltIn": true,
                "core": true,
                "projectEnabled": true,
                "capabilities": [
                    "vision"
                ],
                "enableCors": true
            },
            {
                "name": "gpt-4.1-nano",
                "provider": "openai",
                "enabled": true,
                "isBuiltIn": true,
                "core": true,
                "capabilities": [
                    "vision"
                ],
                "enableCors": true
            },
            {
                "name": "o4-mini",
                "provider": "openai",
                "enabled": true,
                "isBuiltIn": true,
                "core": true,
                "capabilities": [
                    "reasoning"
                ],
                "enableCors": true
            },
            {
                "name": "claude-3-5-sonnet-latest",
                "provider": "anthropic",
                "enabled": false,
                "isBuiltIn": true,
                "core": true,
                "capabilities": [
                    "vision"
                ]
            },
            {
                "name": "openDossier",
                "provider": "openai",
                "enabled": true,
                "isBuiltIn": false,
                "baseUrl": "https://n8n.opendossier.pro/webhook/ddc256e2-69f1-41ab-a369-b0d8ac6df098",
                "apiKey": userId,
                "isEmbeddingModel": false,
                "capabilities": [],
                "stream": true,
                "enableCors": true
            },
            {
                "name": "claude-sonnet-4-20250514",
                "provider": "anthropic",
                "enabled": false,
                "isBuiltIn": true,
                "capabilities": [
                    "reasoning",
                    "vision"
                ]
            },
            {
                "name": "claude-3-7-sonnet-latest",
                "provider": "anthropic",
                "enabled": false,
                "isBuiltIn": true,
                "capabilities": [
                    "reasoning",
                    "vision"
                ]
            },
            {
                "name": "claude-3-5-haiku-latest",
                "provider": "anthropic",
                "enabled": false,
                "isBuiltIn": true
            },
            {
                "name": "grok-3-beta",
                "provider": "xai",
                "enabled": false,
                "isBuiltIn": true
            },
            {
                "name": "grok-3-mini-beta",
                "provider": "xai",
                "enabled": false,
                "isBuiltIn": true
            },
            {
                "name": "gemini-2.5-flash",
                "provider": "google",
                "enabled": false,
                "isBuiltIn": true,
                "projectEnabled": true,
                "capabilities": [
                    "vision"
                ]
            },
            {
                "name": "gemini-2.5-pro",
                "provider": "google",
                "enabled": false,
                "isBuiltIn": true,
                "projectEnabled": true,
                "capabilities": [
                    "vision"
                ]
            },
            {
                "name": "command-r",
                "provider": "cohereai",
                "enabled": false,
                "isBuiltIn": true
            },
            {
                "name": "command-r-plus",
                "provider": "cohereai",
                "enabled": false,
                "isBuiltIn": true
            },
            {
                "name": "azure-openai",
                "provider": "azure openai",
                "enabled": false,
                "isBuiltIn": true
            },
            {
                "name": "deepseek-chat",
                "provider": "deepseek",
                "enabled": false,
                "isBuiltIn": true
            },
            {
                "name": "deepseek-reasoner",
                "provider": "deepseek",
                "enabled": false,
                "isBuiltIn": true,
                "capabilities": [
                    "reasoning"
                ]
            },
            {
                "name": "openDossier_context",
                "provider": "openai",
                "enabled": true,
                "baseUrl": "https://n8n.opendossier.pro/webhook/eb6dda28-2e38-4a27-8d2e-ed1d8a149da6",
                "apiKey": userId,
                "isEmbeddingModel": false,
                "stream": true,
                "enableCors": true
            }
        ],
        "activeEmbeddingModels": [
            {
                "name": "copilot-plus-small",
                "provider": "copilot-plus",
                "enabled": true,
                "isBuiltIn": true,
                "isEmbeddingModel": true,
                "core": true,
                "plusExclusive": true
            },
            {
                "name": "copilot-plus-large",
                "provider": "copilot-plus-jina",
                "enabled": true,
                "isBuiltIn": true,
                "isEmbeddingModel": true,
                "core": true,
                "plusExclusive": true,
                "believerExclusive": true,
                "dimensions": 1024
            },
            {
                "name": "copilot-plus-multilingual",
                "provider": "copilot-plus-jina",
                "enabled": true,
                "isBuiltIn": true,
                "isEmbeddingModel": true,
                "core": true,
                "plusExclusive": true,
                "dimensions": 512
            },
            {
                "name": "text-embedding-3-small",
                "provider": "openai",
                "enabled": true,
                "isBuiltIn": true,
                "isEmbeddingModel": true,
                "core": true
            },
            {
                "name": "text-embedding-3-large",
                "provider": "openai",
                "enabled": true,
                "isBuiltIn": true,
                "isEmbeddingModel": true
            },
            {
                "name": "embed-multilingual-light-v3.0",
                "provider": "cohereai",
                "enabled": true,
                "isBuiltIn": true,
                "isEmbeddingModel": true
            },
            {
                "name": "text-embedding-004",
                "provider": "google",
                "enabled": true,
                "isBuiltIn": true,
                "isEmbeddingModel": true
            },
            {
                "name": "azure-openai",
                "provider": "azure openai",
                "enabled": true,
                "isBuiltIn": true,
                "isEmbeddingModel": true
            }
        ],
        "embeddingRequestsPerMin": 90,
        "embeddingBatchSize": 16,
        "disableIndexOnMobile": true,
        "showSuggestedPrompts": false,
        "showRelevantNotes": false,
        "numPartitions": 1,
        "promptUsageTimestamps": {},
        "promptSortStrategy": "timestamp",
        "defaultConversationNoteName": "{$topic}@{$date}_{$time}",
        "inlineEditCommands": [],
        "projectList": [],
        "enableAutocomplete": false,
        "autocompleteAcceptKey": "Tab",
        "allowAdditionalContext": true,
        "enableWordCompletion": false,
        "lastDismissedVersion": "3.0.2",
        "passMarkdownImages": true,
        "enableCustomPromptTemplating": true,
        "suggestedDefaultCommands": true
    };
    
    return JSON.stringify(dataJson, null, 2);
}

// Add function to save data.json to server
async function saveDataJsonToServer() {
    if (!window.generatedDataJson) return;
    
    try {
        const response = await fetch('/api/save-data-json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                dataJson: window.generatedDataJson,
                userId: window.extractedUserId 
            })
        });
        
        if (response.ok) {
            console.log('data.json saved to server');
        } else {
            console.error('Failed to save data.json to server');
        }
    } catch (error) {
        console.error('Error saving data.json:', error);
    }
}

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
            
            // Extract and log user ID
            const userId = extractUserId(data.uri);
            if (userId) {
                console.log('Extracted User ID:', userId);
                window.extractedUserId = userId;
                
                // Generate data.json with userId
                const dataJsonContent = generateDataJson(userId);
                console.log('Generated data.json:', dataJsonContent);
                
                // Store for later use
                window.generatedDataJson = dataJsonContent;
                
                // Save data.json to server
                await saveDataJsonToServer();
            }
        } else if (data.snippet) {
            // Fallback to old format if needed
            const snippetJson = JSON.stringify(data.snippet);  // Stringify
            const encodedData = encodeURIComponent(snippetJson);  // URL-encode
            const vault = vaultName || 'dossier';  // Use provided name or default to 'dossier'
            const uri = `obsidian://remotely-save?func=settings&version=0.5.25&vault=${vault}&data=${encodedData}`;
            
            // Store the configuration data for display in the next step
            configData = uri;
            
            console.log('Generated URI:', uri);
            
            // Extract and log user ID
            const userId = extractUserId(uri);
            if (userId) {
                console.log('Extracted User ID:', userId);
                window.extractedUserId = userId;
                
                // Generate data.json with userId
                const dataJsonContent = generateDataJson(userId);
                console.log('Generated data.json:', dataJsonContent);
                
                // Store for later use
                window.generatedDataJson = dataJsonContent;
                
                // Save data.json to server
                await saveDataJsonToServer();
            }
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
                const obsidianBtn = document.getElementById('openObsidianBtn');
                if (configTextarea && configData) {
                    configTextarea.value = configData;
                    // Show the Open in Obsidian button
                    if (obsidianBtn) {
                        obsidianBtn.style.display = 'inline-block';
                    }
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
    
    // Add event listener for Open in Obsidian button
    const obsidianBtn = document.getElementById('openObsidianBtn');
    if (obsidianBtn) {
        obsidianBtn.addEventListener('click', function() {
            const configTextarea = document.getElementById('configData');
            if (configTextarea && configTextarea.value) {
                // Open the obsidian:// URI directly
                window.location.href = configTextarea.value;
                showSuccess('Opening Obsidian for automatic plugin setup...', 'Auto Setup');
            } else {
                showError('No configuration data available. Please complete the previous step first.', 'No Data');
            }
        });
    }
});