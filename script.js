// Tab switching functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// Assistant functionality
const conversation = document.getElementById('conversation');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const thinkingIndicator = document.getElementById('thinking');
const decisionInfo = document.getElementById('decision-info');
const decisionText = document.getElementById('decision-text');
const scenarioSelect = document.getElementById('scenario-select');
const actorSelect = document.getElementById('actor-select');

// Helper function to add messages to the conversation
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'assistant-message');
    messageDiv.textContent = message;
    conversation.appendChild(messageDiv);
    conversation.scrollTop = conversation.scrollHeight;
}

// Show thinking process
function showThinking() {
    thinkingIndicator.style.display = 'block';
    conversation.scrollTop = conversation.scrollHeight;
}

// Hide thinking process
function hideThinking() {
    thinkingIndicator.style.display = 'none';
}

// Show decision info
function showDecision(decision) {
    decisionText.textContent = decision;
    decisionInfo.style.display = 'block';
    conversation.scrollTop = conversation.scrollHeight;
}

// Response scenarios based on user type and selected scenario
const responses = {
    individual: {
        'morning-routine': {
            queries: {
                'what\'s on my schedule': {
                    response: "Based on your calendar, you have a team meeting at 10 AM and a doctor's appointment at 3 PM. Since traffic looks heavy today, I recommend leaving 15 minutes earlier than usual for your appointment.",
                    decision: "Prioritized calendar events by importance and added traffic conditions to recommendation based on historical travel patterns and current traffic data."
                },
                'i need coffee': {
                    response: "I've started your smart coffee maker. Based on your past preferences at this time, I've selected your stronger morning brew. Would you like me to order more coffee beans? You're running low based on your usage patterns.",
                    decision: "Identified implicit task request, analyzed time of day and past preferences, checked inventory status, and suggested proactive purchase based on consumption rate."
                },
                'play some music': {
                    response: "Playing your morning playlist on Spotify. I've included some new releases from artists similar to those you've been listening to recently.",
                    decision: "Selected morning playlist based on time of day, added new music based on preference learning algorithm to introduce variety while maintaining preference alignment."
                },
                'what\'s the weather': {
                    response: "It's currently 58°F and partly cloudy. There's a 30% chance of rain this afternoon. Based on your usual routine on Wednesdays, I suggest taking an umbrella for your commute back home.",
                    decision: "Presented weather data with personalized recommendation based on day-of-week pattern analysis and scheduled activities."
                }
            }
        },
        'security-check': {
            queries: {
                'unlock my account': {
                    response: "I'll need to verify your identity before unlocking your account. Please complete the voice authentication process by repeating: 'My voice is my password.'",
                    decision: "Classified request as high-security, requiring explicit voice pattern authentication before proceeding with sensitive account action."
                },
                'send money to john': {
                    response: "I've detected that this is an unusual transaction pattern for you. Before proceeding, can you verify the last four digits of your phone number?",
                    decision: "Identified financial transaction request, compared to usual patterns, detected anomaly, and triggered additional security verification."
                },
                'open garage door': {
                    response: "I've verified your voice pattern. Opening the garage door now. I notice you're arriving earlier than usual today, would you like me to adjust the thermostat settings?",
                    decision: "Authenticated voice against stored pattern, executed home automation command, noted schedule deviation, and offered related contextual assistance."
                }
            }
        }
    },
    business: {
        'customer-support': {
            queries: {
                'i can\'t access my account': {
                    response: "I'm sorry to hear you're having trouble. Based on our recent system updates, this might be related to the security patch deployed yesterday. Let me guide you through the password reset process. Would you prefer email or SMS verification?",
                    decision: "Classified issue as account access problem, correlated with recent system changes, selected self-service resolution path with multiple options."
                },
                'my shipment is late': {
                    response: "I see your order #AC2984. According to our tracking system, there's a weather delay affecting several shipments in your region. The new estimated delivery is tomorrow before 5 PM. Would you like me to send you real-time updates or arrange priority delivery for an additional fee?",
                    decision: "Identified order from voice pattern and account history, detected shipping exception, offered both free information and premium resolution options."
                },
                'i want to speak to a human': {
                    response: "I understand you'd prefer to speak with a customer service representative. Based on your issue, I'll connect you with our technical support team. The current wait time is approximately 3 minutes. While you wait, would you like me to document the issue you've described so far?",
                    decision: "Recognized escalation request, selected appropriate human department based on conversation context, offered value during transition to maintain engagement."
                }
            }
        }
    },
    elderly: {
        'medication-reminder': {
            queries: {
                'did i take my medicine': {
                    response: "According to your medication schedule, you haven't taken your blood pressure medication this morning. It should be taken with food. Would you like me to remind you again after breakfast?",
                    decision: "Checked medication adherence records, provided context-sensitive information about proper administration, offered personalized reminder scheduling."
                },
                'when is my doctor appointment': {
                    response: "You have an appointment with Dr. Smith this Thursday at 2:30 PM. Based on your preference for earlier arrival, I suggest leaving home by 1:45 PM. Would you like me to arrange transportation?",
                    decision: "Retrieved calendar information, incorporated personal preference data, offered transportation assistance based on mobility profile."
                },
                'i\'m feeling dizzy': {
                    response: "I understand you're feeling dizzy. Based on your health profile, this could be related to your blood pressure. Would you like me to check your recent readings, call your emergency contact Mary, or connect you with the nurse hotline?",
                    decision: "Identified potential health concern, consulted health profile for relevant context, presented escalating assistance options from self-service to emergency help."
                }
            }
        }
    }
};

// Handle sending a message
function sendMessage() {
    const message = userInput.value.trim().toLowerCase();
    if (!message) return;
    
    addMessage(message, true);
    userInput.value = '';
    
    // Show thinking process
    showThinking();
    
    // Simulate decision-making process
    setTimeout(() => {
        hideThinking();
        
        // Get current scenario and actor
        const scenario = scenarioSelect.value;
        const actor = actorSelect.value;
        
        // Check if we have a specific response for this query
        let responded = false;
        
        if (responses[actor] && responses[actor][scenario] && responses[actor][scenario].queries) {
            const queries = responses[actor][scenario].queries;
            
            // Check for exact matches first
            if (queries[message]) {
                addMessage(queries[message].response);
                showDecision(queries[message].decision);
                responded = true;
            } else {
                // Check for partial matches
                for (const key in queries) {
                    if (message.includes(key) || key.includes(message)) {
                        addMessage(queries[key].response);
                        showDecision(queries[key].decision);
                        responded = true;
                        break;
                    }
                }
            }
        }
        
        // Default responses if no match found
        if (!responded) {
            if (actor === 'individual') {
                addMessage("I'll help you with that. Based on your past preferences and current time of day, I think this is a high-priority request for you.");
                showDecision("Analyzed query against user history, time context, and priority patterns to determine response importance level.");
            } else if (actor === 'business') {
                addMessage("I understand your business query. Let me check our knowledge base for the most relevant solution for your company size and industry.");
                showDecision("Classified query type, segmented by business profile attributes, and selected response template appropriate to user's expertise level.");
            } else if (actor === 'elderly') {
                addMessage("I've understood your request. I'll speak a bit more slowly and provide clear, step-by-step instructions to help you.");
                showDecision("Detected user type requires accessibility adaptations, adjusted response pace and complexity, prioritized clarity over brevity.");
            }
        }
    }, 1500);
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Update example phrases when scenario changes
function updateScenarioSuggestion() {
    const actor = actorSelect.value;
    const scenario = scenarioSelect.value;
    
    // Reset conversation
    conversation.innerHTML = '';
    decisionInfo.style.display = 'none';
    
    // Add welcome message based on scenario
    if (scenario === 'morning-routine') {
        addMessage("Good morning! I'm your personal voice assistant. How can I help with your morning routine today?");
    } else if (scenario === 'customer-support') {
        addMessage("Welcome to customer support. I'm your automated assistant with decision-making capabilities. How can I help you today?");
    } else if (scenario === 'medication-reminder') {
        addMessage("Hello! I'm your health assistant. I can help you with medications, appointments, and health concerns. What do you need today?");
    } else if (scenario === 'security-check') {
        addMessage("Welcome back. For your security, I'm ready to assist with secure access to your accounts and devices. How can I help?");
    }
    
    // Show some example phrases if available
    if (responses[actor] && responses[actor][scenario] && responses[actor][scenario].queries) {
        const queries = Object.keys(responses[actor][scenario].queries);
        if (queries.length > 0) {
            const exampleQuery = queries[0];
            userInput.placeholder = `Try: "${exampleQuery}"`;
        }
    }
}

scenarioSelect.addEventListener('change', updateScenarioSuggestion);
actorSelect.addEventListener('change', updateScenarioSuggestion);

// Initialize with default scenario suggestion
updateScenarioSuggestion();

// Optional: Voice recognition simulation - could be expanded with actual Web Speech API
let isListening = false;
function toggleVoiceRecognition() {
    if (!isListening) {
        // Simulate start listening
        isListening = true;
        showThinking();
        setTimeout(() => {
            hideThinking();
            // This is where you would process voice input in a real implementation
            // For the prototype, we'll just show a sample message
            addMessage("I need to know my schedule for today", true);
            setTimeout(() => {
                // Simulate response
                sendMessage();
            }, 500);
        }, 2000);
    } else {
        // Stop listening
        isListening = false;
        hideThinking();
    }
}

// Could add a voice input button to the UI that calls toggleVoiceRecognition()