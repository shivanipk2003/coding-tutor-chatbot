import os
import streamlit as st
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

st.set_page_config(
    page_title="CodeBuddy – AI Coding Tutor",
    page_icon="👨‍💻",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown("""
<style>
    .stButton > button {
        background-color: #21262d;
        color: #c9d1d9;
        border: 1px solid #30363d;
        border-radius: 8px;
        text-align: left;
        width: 100%;
    }
    .stButton > button:hover {
        background-color: #30363d;
        border-color: #8b5cf6;
        color: #a78bfa;
    }
    [data-testid="stChatMessage"] {
        border-radius: 12px;
        margin-bottom: 6px;
    }
    .stTabs [data-baseweb="tab"] { color: #8b949e; }
    .stTabs [aria-selected="true"] { color: #a78bfa; border-bottom: 2px solid #8b5cf6; }
</style>
""", unsafe_allow_html=True)

BASE_SYSTEM_PROMPT = """You are CodeBuddy, an expert coding tutor AI assistant. Your role is to:
- Explain programming concepts clearly with examples
- Help debug code by identifying errors and explaining fixes
- Suggest best practices and clean code patterns
- Support all major languages: Python, JavaScript, TypeScript, Java, C++, Go, Rust, etc.
- Be encouraging and patient — learning to code is a journey!

Always format code examples using markdown code blocks with the language specified (e.g. ```python).
Use inline code with backticks for short references."""

SKILL_INSTRUCTIONS = {
    "🟢 Beginner": "The user is a beginner. Use simple language, avoid jargon, give step-by-step explanations with relatable analogies and always include basic runnable examples. Encourage them frequently.",
    "🟡 Intermediate": "The user has intermediate knowledge. Use technical terms but briefly explain them. Focus on best practices, common pitfalls, and design patterns.",
    "🔴 Advanced": "The user is advanced. Be concise and use technical terminology freely. Focus on edge cases, performance trade-offs, and advanced patterns. Skip the basics.",
}

TOPICS = {
    "📚 Fundamentals": [
        ("Variables & Types", "Explain variables and data types with examples"),
        ("Functions", "Explain functions and how to write clean, reusable functions"),
        ("Loops", "Explain different types of loops and when to use each"),
        ("Recursion", "Explain recursion with a beginner-friendly example"),
    ],
    "🏗️ Data Structures": [
        ("Arrays & Lists", "Explain arrays and lists with practical examples"),
        ("Hash Maps", "Explain hash maps/dictionaries and when to use them"),
        ("Trees & Graphs", "Explain trees and graphs with visual examples"),
        ("Stacks & Queues", "Explain stacks and queues with real-world analogies"),
    ],
    "⚡ Algorithms": [
        ("Sorting Algorithms", "Explain the most common sorting algorithms and their complexities"),
        ("Big O Notation", "Explain Big O notation with simple practical examples"),
        ("Binary Search", "Explain binary search and implement it step by step"),
        ("Dynamic Programming", "Explain dynamic programming with a simple example"),
    ],
    "🐛 Debugging": [
        ("Common Errors", "What are the most common programming errors and how do I fix them?"),
        ("Debugging Tips", "What are the best debugging strategies for beginners?"),
        ("Code Review", "How do I review my own code effectively?"),
    ],
    "💼 Interview Prep": [
        ("Problem Solving", "How should I approach coding interview problems?"),
        ("System Design", "Explain the basics of system design for interviews"),
        ("SOLID Principles", "Explain SOLID principles with code examples"),
    ],
}

SUGGESTED_PROMPTS = {
    "📚 Concepts": [
        "Explain recursion with a simple example",
        "What is Big O notation?",
        "Explain the difference between stack and heap",
        "What are design patterns in software?",
    ],
    "💻 Languages": [
        "What is the difference between == and === in JavaScript?",
        "How do I reverse a string in Python?",
        "Explain Python list comprehensions",
        "What are TypeScript generics?",
    ],
    "🐛 Debug": [
        "Why might my for loop run infinitely?",
        "How do I fix a NullPointerException in Java?",
        "What causes a stack overflow error?",
        "How do I debug async/await issues?",
    ],
    "💼 Interview": [
        "Explain the difference between SQL and NoSQL",
        "What is the time complexity of quicksort?",
        "Explain microservices vs monolithic architecture",
        "What are the SOLID principles?",
    ],
}


@st.cache_resource
def get_groq_client():
    api_key = st.secrets.get("GROQ_API_KEY", os.getenv("GROQ_API_KEY"))
    return Groq(api_key=api_key)


def get_ai_response(messages_history: list, skill: str) -> str:
    client = get_groq_client()
    system_prompt = BASE_SYSTEM_PROMPT + "\n\n" + SKILL_INSTRUCTIONS[skill]
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            *[{"role": m["role"], "content": m["content"]} for m in messages_history],
        ],
        temperature=0.7,
        max_completion_tokens=2048,
    )
    return completion.choices[0].message.content or "Sorry, I couldn't generate a response."


# Session state
if "messages" not in st.session_state:
    st.session_state.messages = []
if "pending_prompt" not in st.session_state:
    st.session_state.pending_prompt = None

# ── Sidebar ──────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 👨‍💻 CodeBuddy")
    st.caption("AI Coding Tutor · Powered by Groq")
    st.divider()

    skill_level = st.radio(
        "**Skill Level**",
        options=list(SKILL_INSTRUCTIONS.keys()),
        index=0,
    )
    st.divider()

    st.markdown("**📖 Topics**")
    for section, items in TOPICS.items():
        with st.expander(section, expanded=False):
            for label, prompt in items:
                if st.button(label, key=f"topic_{label}"):
                    st.session_state.pending_prompt = prompt

    st.divider()
    if st.button("🗑️ Clear Chat", use_container_width=True):
        st.session_state.messages = []
        st.session_state.pending_prompt = None
        st.rerun()

# ── Main ─────────────────────────────────────────────────────────────────────
st.markdown("# 👨‍💻 CodeBuddy — AI Coding Tutor")
st.caption(f"LLaMA 3.3 70B via Groq · {skill_level} mode · 🟢 Online")

# Welcome + suggested prompts (shown only when chat is empty)
if not st.session_state.messages:
    st.markdown("---")
    st.markdown("#### 💡 Try asking...")
    tabs = st.tabs(list(SUGGESTED_PROMPTS.keys()))
    for tab, (_, prompts) in zip(tabs, SUGGESTED_PROMPTS.items()):
        with tab:
            cols = st.columns(2)
            for i, prompt in enumerate(prompts):
                if cols[i % 2].button(prompt, key=f"sugg_{prompt}"):
                    st.session_state.pending_prompt = prompt
    st.markdown("---")

# Display existing messages
for message in st.session_state.messages:
    avatar = "🧑‍💻" if message["role"] == "user" else "🤖"
    with st.chat_message(message["role"], avatar=avatar):
        st.markdown(message["content"])

# Handle pending prompt (sidebar topic or suggested prompt click)
if st.session_state.pending_prompt:
    prompt = st.session_state.pending_prompt
    st.session_state.pending_prompt = None
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.spinner("CodeBuddy is thinking..."):
        response = get_ai_response(st.session_state.messages, skill_level)
    st.session_state.messages.append({"role": "assistant", "content": response})
    st.rerun()

# Chat input
if prompt := st.chat_input("Ask me anything about coding..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user", avatar="🧑‍💻"):
        st.markdown(prompt)
    with st.chat_message("assistant", avatar="🤖"):
        with st.spinner("Thinking..."):
            response = get_ai_response(st.session_state.messages, skill_level)
        st.markdown(response)
    st.session_state.messages.append({"role": "assistant", "content": response})
