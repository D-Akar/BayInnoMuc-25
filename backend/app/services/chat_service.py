"""
Chat Service - LLM integration for text chat using Azure OpenAI
"""

import os
from typing import List, Dict, Any, Optional
from openai import OpenAI
import traceback

# Load Azure API key from environment
azure_api_key = os.environ.get("API_KEY")

if not azure_api_key:
    raise ValueError("API_KEY environment variable is not set")

# Initialize Azure OpenAI client
client = OpenAI(
    api_key=azure_api_key,
    base_url="https://SafeTalkFinal.openai.azure.com/openai/v1/"
)

# Available models configuration for Azure OpenAI
AVAILABLE_MODELS = [
    {
        "name": "gpt-4.1-nano",
        "description": "GPT-4.1 Nano on Azure - Fast and efficient",
        "max_tokens": 4096,
        "temperature": 1.0,  # GPT-4.1 Nano only supports temperature=1.0
    },
]

# Primary model to use
PRIMARY_MODEL = os.getenv("AZURE_MODEL", AVAILABLE_MODELS[0]["name"])

# System prompt for HIV care assistant
SYSTEM_PROMPT = """You are a compassionate and knowledgeable HIV care assistant. Your role is to:

1. Provide supportive, non-judgmental information about HIV testing, treatment, prevention, and living with HIV
2. Offer empathetic and understanding responses to users' concerns
3. Encourage users to seek professional medical advice when appropriate
4. Respect privacy and maintain confidentiality
5. Provide accurate, evidence-based information
6. Focus on emotional support and connecting users to resources

Important guidelines:
- Always remind users that this is not a substitute for professional medical advice
- Never diagnose conditions or prescribe treatments
- Be sensitive to the emotional aspects of HIV-related concerns
- Use inclusive, non-stigmatizing language
- Encourage regular medical check-ups and adherence to treatment plans
- Respect cultural and personal differences

Keep your repsonses brief. If you have a lot of information to pass on, do that over multiple messages"""


def get_model_config(model_name: str) -> Optional[Dict[str, Any]]:
    """Get configuration for a specific model"""
    for model in AVAILABLE_MODELS:
        if model["name"] == model_name:
            return model
    return None


def call_llm_with_fallback(
    messages: List[Dict[str, str]],
    preferred_model: Optional[str] = None
) -> tuple[str, str]:
    """
    Call Azure OpenAI API.
    
    Args:
        messages: List of conversation messages
        preferred_model: Optional specific model to try first
        
    Returns:
        Tuple of (response_text, model_used)
    """
    # Use preferred model or primary model
    model_name = preferred_model if preferred_model else PRIMARY_MODEL
    model_config = get_model_config(model_name)
    
    if not model_config:
        model_name = PRIMARY_MODEL
        model_config = AVAILABLE_MODELS[0]
    
    try:
        print(f"🔄 Using Azure OpenAI model: {model_name}")
        print(f"📤 Sending {len(messages)} messages to API")
        
        completion = client.chat.completions.create(
            model=model_name,
            messages=messages,
            temperature=model_config["temperature"],
            max_completion_tokens=min(800, model_config["max_tokens"]),
        )
        
        print(f"📥 Received completion object: {completion}")
        print(f"📊 Choices count: {len(completion.choices)}")
        
        if completion.choices and len(completion.choices) > 0:
            response_text = completion.choices[0].message.content
            print(f"📝 Response content length: {len(response_text) if response_text else 0}")
            print(f"📝 Response preview: {response_text[:200] if response_text else 'EMPTY OR NULL'}")
        else:
            print(f"⚠️ No choices returned from API")
            response_text = ""
        
        if not response_text:
            raise Exception("Empty response received from Azure OpenAI API")
        
        print(f"✅ Success with model: {model_name}")
        
        return response_text, model_name
        
    except Exception as e:
        print(f"❌ Failed with {model_name}: {str(e)}")
        traceback.print_exc()
        raise Exception(f"Azure OpenAI API call failed: {str(e)}")


def process_text_message(
    message: str,
    session_id: str,
    conversation_history: Optional[List[Dict[str, Any]]] = None,
    preferred_model: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Process a user message and generate a response using LLM with fallback support.
    
    Args:
        message: User's message
        session_id: Unique session identifier
        conversation_history: Previous conversation messages
        preferred_model: Optional specific model to use
        
    Returns:
        Dictionary containing response, suggestions, and metadata
    """
    
    try:
        print(f"\n{'='*50}")
        print(f"Processing message")
        print(f"Session ID: {session_id}")
        print(f"Message: {message}")
        print(f"History length: {len(conversation_history) if conversation_history else 0}")
        print(f"{'='*50}\n")
        
        # Build conversation context
        messages = [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            }
        ]
        
        # Add conversation history if available
        if conversation_history:
            for msg in conversation_history[-10:]:  # Keep last 10 messages for context
                if msg.get("role") in ["user", "assistant"]:
                    messages.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": message
        })

        # Call LLM with fallback support
        assistant_message, model_used = call_llm_with_fallback(
            messages=messages,
            preferred_model=preferred_model
        )

        print(f"\n📝 Response preview: {assistant_message[:100]}...\n")

        # Generate follow-up suggestions
        suggestions = generate_suggestions(message, assistant_message)

        return {
            "response": assistant_message,
            "suggestions": suggestions,
            "session_id": session_id,
            "model_used": model_used,  # Include which model was used
        }

    except Exception as e:
        print(f"\n{'!'*50}")
        print(f"LLM API ERROR")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print(f"{'!'*50}\n")
        traceback.print_exc()
        
        return {
            "response": "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or feel free to browse our FAQ section for immediate answers.",
            "suggestions": [
                "Browse FAQs",
                "Try asking again",
                "Contact support"
            ],
            "session_id": session_id,
            "error": str(e)
        }


def generate_suggestions(user_message: str, assistant_response: str) -> List[str]:
    """
    Generate contextual follow-up suggestions based on the conversation.
    
    Args:
        user_message: The user's original message
        assistant_response: The assistant's response
        
    Returns:
        List of suggestion strings
    """
    # Default suggestions
    default_suggestions = [
        "Tell me more",
        "What are my next steps?",
        "Where can I get help?",
    ]
    
    # Keyword-based contextual suggestions
    lower_message = user_message.lower()
    
    suggestions = []
    
    # Testing-related suggestions
    if any(word in lower_message for word in ["test", "testing", "tested"]):
        suggestions = [
            "Where can I get tested?",
            "How accurate are HIV tests?",
            "What happens after testing?",
        ]
    # Treatment-related suggestions
    elif any(word in lower_message for word in ["treatment", "medication", "drugs", "therapy"]):
        suggestions = [
            "What are the side effects?",
            "How long is treatment?",
            "Is treatment effective?",
        ]
    # Prevention-related suggestions
    elif any(word in lower_message for word in ["prevent", "prevention", "prep", "pep"]):
        suggestions = [
            "What is PrEP?",
            "What is PEP?",
            "How effective is prevention?",
        ]
    # Living with HIV suggestions
    elif any(word in lower_message for word in ["living", "life", "daily", "cope"]):
        suggestions = [
            "How can I stay healthy?",
            "Who should I tell?",
            "Where can I find support?",
        ]
    else:
        suggestions = default_suggestions
    
    return suggestions


def get_available_models() -> List[Dict[str, Any]]:
    """
    Get list of available models with their configurations.
    Useful for admin/debugging endpoints.
    """
    return AVAILABLE_MODELS


def get_primary_model() -> str:
    """Get the current primary model name"""
    return PRIMARY_MODEL