"""
Chat Service - LLM integration for text chat using Azure AI Agent
"""

import os
import traceback
import time
from typing import List, Dict, Any, Optional
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

# --- Configuration ---
azure_agent_id = os.environ.get("AZURE_ASSISTANT_ID")
project_endpoint = "https://safetalkfinal.services.ai.azure.com/api/projects/SafeTalkFinal"

if not azure_agent_id:
    raise ValueError("AZURE_ASSISTANT_ID environment variable is not set")

# Initialize Client
client = AIProjectClient(
    endpoint=project_endpoint,
    credential=DefaultAzureCredential()
)

AGENT_ID = azure_agent_id

def call_llm_with_history(messages: List[Dict[str, str]]) -> str:
    """
    Optimized: Reduced context window & Aggressive polling for lowest latency.
    """
    thread = None
    try:
        # 1. OPTIMIZATION: One Single API Call
        run = client.agents.create_thread_and_run(
            agent_id=AGENT_ID,
            thread={
                "messages": messages
            }
        )
        
        thread_id = run.thread_id
        
        # 2. OPTIMIZATION: Aggressive Polling for Speed
        # Poll very frequently to catch completion ASAP
        poll_count = 0
        while run.status in ["queued", "in_progress", "requires_action"]:
            # Ultra-fast polling: 0.05s for first 40 checks (2 seconds), then 0.2s
            # This gives us 20 checks per second initially
            sleep_time = 0.05 if poll_count < 40 else 0.2
            time.sleep(sleep_time)
            
            run = client.agents.runs.get(thread_id=thread_id, run_id=run.id)
            poll_count += 1
            
            # Safety: break after 2 minutes
            if poll_count > 600:
                raise Exception("Agent run timeout after 2 minutes")
            
        if run.status != "completed":
            raise Exception(f"Agent run failed with status: {run.status}")
        
        # 3. Retrieve Response
        response_pager = client.agents.messages.list(
            thread_id=thread_id,
            order="desc", 
            limit=1
        )
        
        messages_list = list(response_pager)
        response_text = ""
        
        if messages_list:
            last_msg = messages_list[0]
            if last_msg.role == "assistant":
                for content_part in last_msg.content:
                    if hasattr(content_part, 'text'):
                         response_text += content_part.text.value
                    elif isinstance(content_part, dict) and 'text' in content_part:
                         response_text += content_part['text']['value']

        if not response_text:
            raise Exception("Empty response from Agent")
            
        # Store thread object for cleanup
        thread = type('obj', (object,), {'id': thread_id})
            
        return response_text

    except Exception as e:
        print(f"❌ Azure Agent Error: {str(e)}")
        traceback.print_exc()
        raise e
    
    finally:
        # 4. Cleanup
        if thread:
            try:
                client.agents.threads.delete(thread.id)
            except Exception:
                pass

def process_text_message(
    message: str,
    session_id: str,
    conversation_history: Optional[List[Dict[str, Any]]] = None,
    preferred_model: Optional[str] = None,
) -> Dict[str, Any]:
    """Process message and return response dict."""
    try:
        formatted_messages = []
        
        # OPTIMIZATION: Limit history to last 4 messages (2 exchanges)
        # Fewer messages = faster processing by the agent
        if conversation_history:
            for msg in conversation_history[-4:]:
                role = msg.get("role")
                content = msg.get("content")
                if role in ["user", "assistant"] and content:
                    formatted_messages.append({"role": role, "content": content})
        
        formatted_messages.append({"role": "user", "content": message})

        # Call LLM
        response_text = call_llm_with_history(formatted_messages)
        
        # Suggestions (Local processing is instant)
        suggestions = generate_suggestions(message, response_text)

        return {
            "response": response_text,
            "suggestions": suggestions,
            "session_id": session_id,
            "model_used": "azure-agent",
        }

    except Exception as e:
        return {
            "response": "I apologize, but I'm having trouble connecting right now.",
            "suggestions": ["Try again"],
            "session_id": session_id,
            "error": str(e)
        }

def generate_suggestions(user_message: str, assistant_response: str) -> List[str]:
    """
    Generate intelligent, context-aware follow-up suggestions based on both
    the user's question and the agent's response.
    """
    user_lower = user_message.lower()
    response_lower = assistant_response.lower()
    
    # Combine both for better context
    combined_text = user_lower + " " + response_lower
    
    # Testing & Diagnosis
    if any(word in combined_text for word in ["test", "testing", "diagnosis", "hiv test", "window period"]):
        if "where" in user_lower or "location" in combined_text:
            return ["What types of tests exist?", "How accurate are tests?", "What if I test positive?"]
        elif "positive" in combined_text or "result" in combined_text:
            return ["What happens next?", "Treatment options?", "Who should I tell?"]
        elif "window" in combined_text or "when" in user_lower:
            return ["Where to get tested?", "What happens during testing?", "Cost of testing?"]
        else:
            return ["Where can I get tested?", "When should I test?", "Test accuracy rates?"]
    
    # Treatment & Medication
    elif any(word in combined_text for word in ["treatment", "medication", "art", "antiretroviral", "drugs", "pills", "medicine"]):
        if "side effect" in combined_text or "problem" in combined_text:
            return ["How to manage side effects?", "Alternative treatments?", "When to see a doctor?"]
        elif "start" in combined_text or "begin" in combined_text:
            return ["What to expect from treatment?", "Treatment side effects?", "Cost of medication?"]
        elif "stop" in combined_text or "miss" in combined_text or "adhere" in combined_text:
            return ["Importance of adherence?", "What if I miss doses?", "Reminder strategies?"]
        else:
            return ["How does treatment work?", "Treatment side effects?", "How long is treatment?"]
    
    # Prevention (PrEP/PEP)
    elif any(word in combined_text for word in ["prevent", "prevention", "prep", "pep", "prophylaxis", "protect"]):
        if "prep" in combined_text:
            return ["How to get PrEP?", "PrEP side effects?", "PrEP effectiveness?"]
        elif "pep" in combined_text:
            return ["Where to get PEP?", "PEP timeline?", "PEP vs PrEP?"]
        elif "condom" in combined_text:
            return ["Other prevention methods?", "What is PrEP?", "Risk reduction strategies?"]
        else:
            return ["What is PrEP?", "What is PEP?", "How to reduce risk?"]
    
    # Living with HIV
    elif any(word in combined_text for word in ["living with", "daily life", "lifestyle", "cope", "coping", "manage", "undetectable"]):
        if "work" in combined_text or "job" in combined_text:
            return ["Disclosure at work?", "Staying healthy?", "Support groups?"]
        elif "relation" in combined_text or "partner" in combined_text or "sex" in combined_text:
            return ["Telling partners?", "Safe sex practices?", "Undetectable = Untransmittable?"]
        elif "u=u" in combined_text or "undetectable" in combined_text:
            return ["How to become undetectable?", "What does U=U mean?", "Can I have children?"]
        else:
            return ["Staying healthy tips?", "Support resources?", "Emotional support?"]
    
    # Transmission & Risk
    elif any(word in combined_text for word in ["transmit", "transmission", "risk", "expose", "exposure", "infect", "catch", "spread"]):
        if "how" in user_lower:
            return ["Risk levels?", "Prevention methods?", "Getting tested?"]
        elif "partner" in combined_text:
            return ["How to tell partner?", "Protecting partners?", "U=U explained?"]
        else:
            return ["Transmission risks?", "Prevention strategies?", "PrEP for partners?"]
    
    # Symptoms & Health
    elif any(word in combined_text for word in ["symptom", "sick", "fever", "rash", "tired", "fatigue", "health"]):
        if "early" in combined_text or "first" in combined_text:
            return ["When to get tested?", "Acute HIV symptoms?", "Next steps?"]
        else:
            return ["When to see a doctor?", "Managing symptoms?", "Health monitoring?"]
    
    # Support & Resources
    elif any(word in combined_text for word in ["support", "help", "resource", "counsel", "talk", "alone", "scared", "anxiety"]):
        if "emotion" in combined_text or "mental" in combined_text or "depress" in combined_text:
            return ["Mental health resources?", "Support groups?", "Counseling services?"]
        elif "financial" in combined_text or "cost" in combined_text or "afford" in combined_text:
            return ["Financial assistance?", "Insurance coverage?", "Free services?"]
        else:
            return ["Support groups near me?", "Hotline numbers?", "Online communities?"]
    
    # Pregnancy & Family
    elif any(word in combined_text for word in ["pregnant", "pregnancy", "baby", "child", "mother", "breastfeed"]):
        return ["Prevention during pregnancy?", "Safe delivery options?", "Infant testing?"]
    
    # Stigma & Disclosure
    elif any(word in combined_text for word in ["stigma", "discriminat", "tell", "disclose", "secret", "shame"]):
        return ["Disclosure strategies?", "Legal protections?", "Finding support?"]
    
    # Response-based suggestions when agent mentions specific topics
    elif "doctor" in response_lower or "healthcare" in response_lower or "medical" in response_lower:
        return ["How to find a specialist?", "What to ask my doctor?", "Preparing for appointments?"]
    elif "immediately" in response_lower or "urgent" in response_lower or "soon" in response_lower:
        return ["Where to get immediate help?", "Emergency resources?", "What to do now?"]
    elif "more information" in response_lower or "learn more" in response_lower:
        return ["Tell me more", "Related topics?", "Where to read more?"]
    
    # Default contextual suggestions based on question type
    elif "?" in user_message:
        if "how" in user_lower:
            return ["Tell me more", "Next steps?", "Where to get help?"]
        elif "what" in user_lower:
            return ["How does it work?", "Why is this important?", "Related information?"]
        elif "where" in user_lower:
            return ["Other options?", "What to expect?", "Cost information?"]
        elif "when" in user_lower:
            return ["What happens next?", "How long does it take?", "Other timing questions?"]
        elif "why" in user_lower:
            return ["Tell me more", "What are alternatives?", "Related concerns?"]
        else:
            return ["Tell me more", "Related topics?", "Where to get help?"]
    
    # Final fallback
    return ["Tell me more", "What are my options?", "Where can I get help?"]