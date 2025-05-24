import { startYouTubeOAuth, extractAccessTokenFromUrl, sendAccessTokenToBackend } from './oauth.js';

document.addEventListener('DOMContentLoaded', () => {
// --- Chat User ID (hardcoded for now) ---
const userId = 'demo-user-1';

// Chat send animation and message handling
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatArea = document.getElementById('chatArea');
const attachBtn = document.getElementById('attachBtn');
const mediaInput = document.getElementById('mediaInput');

// --- Fetch and Render Chat History ---
async function loadChatHistory() {
    try {
        const res = await fetch(`http://localhost:3000/api/chat/history/${userId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.chats)) {
            chatArea.innerHTML = '';
            data.chats.forEach(msg => {
                if (msg.sender === 'user') {
                    addUserMessage(msg.message, new Date(msg.timestamp));
                } else {
                    addAIMessage(msg.message, new Date(msg.timestamp));
                }
            });
        }
    } catch (err) {
        console.error('Failed to load chat history:', err);
    }
}

// --- YouTube OAuth Integration ---
window.connectYouTube = function() {
    startYouTubeOAuth();
};

// On page load, fetch chat history and check for OAuth token
if (chatArea) {
    loadChatHistory();
}
const token = extractAccessTokenFromUrl();
if (token) {
    window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    showToast('Connecting to YouTube...', 'info');
    sendAccessTokenToBackend(token).then(ok => {
        if (ok) {
            showToast('Connected to YouTube successfully!', 'success');
        } else {
            showToast('Failed to connect to YouTube.', 'error');
        }
    });
}

if (chatForm) {
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        await sendChatMessage(text, 'user');
        chatInput.value = '';
        setTimeout(async () => {
            const aiMsg = `I'm here for you. Tell me more.`;
            await sendChatMessage(aiMsg, 'bot');
        }, 900);
    });
}

async function sendChatMessage(message, sender) {
    try {
        const res = await fetch('http://localhost:3000/api/chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, message, sender })
        });
        const data = await res.json();
        if (data.success && data.chat) {
            if (sender === 'user') {
                addUserMessage(data.chat.message, new Date(data.chat.timestamp));
            } else {
                addAIMessage(data.chat.message, new Date(data.chat.timestamp));
            }
        }
    } catch (err) {
        console.error('Failed to send chat message:', err);
    }
}

if (attachBtn && mediaInput) {
    attachBtn.addEventListener('click', () => {
        mediaInput.click();
    });
    mediaInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble user';
        let content = '';
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.style.maxWidth = '180px';
            img.style.maxHeight = '180px';
            img.style.borderRadius = '0.75rem';
            img.style.marginBottom = '0.25rem';
            const reader = new FileReader();
            reader.onload = function(evt) {
                img.src = evt.target.result;
                bubble.appendChild(img);
                bubble.innerHTML += `<div class='message-timestamp'>${getCurrentTime()}</div>`;
                chatArea.appendChild(bubble);
                chatArea.scrollTop = chatArea.scrollHeight;
            };
            reader.readAsDataURL(file);
            return;
        } else {
            const url = URL.createObjectURL(file);
            content = `<a href='${url}' target='_blank' style='color:#6366f1;font-weight:600;word-break:break-all;'>${file.name}</a>`;
        }
        bubble.innerHTML = `${content}<div class='message-timestamp'>${getCurrentTime()}</div>`;
        chatArea.appendChild(bubble);
        chatArea.scrollTop = chatArea.scrollHeight;
    });
}

function addUserMessage(text, time = new Date()) {
    const userMsg = document.createElement('div');
    userMsg.className = 'message-bubble user';
    userMsg.innerHTML = `${escapeHTML(text)}<div class="message-timestamp">${formatTime(time)}</div>`;
    chatArea.appendChild(userMsg);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function addAIMessage(text, time = new Date()) {
    const aiMsg = document.createElement('div');
    aiMsg.className = 'message-bubble ai';
    aiMsg.innerHTML = `${escapeHTML(text)}<div class="message-timestamp">${formatTime(time)}</div>`;
    chatArea.appendChild(aiMsg);
    chatArea.scrollTop = chatArea.scrollHeight;
}

const avatarInput = document.getElementById('avatarInput');
const sidebarAvatar = document.getElementById('sidebarAvatar');
if (avatarInput && sidebarAvatar) {
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                sidebarAvatar.src = evt.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const mins = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${mins} ${ampm}`;
}

function formatTime(date) {
    const d = new Date(date);
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const mins = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${mins} ${ampm}`;
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, function(tag) {
        const charsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        };
        return charsToReplace[tag] || tag;
    });
}

const connectBtn = document.getElementById('connectBtn');
const connectDropdown = document.getElementById('connectDropdown');
if (connectBtn && connectDropdown) {
    connectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        connectDropdown.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
        if (!connectDropdown.contains(e.target) && !connectBtn.contains(e.target)) {
            connectDropdown.classList.remove('show');
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') connectDropdown.classList.remove('show');
    });
}

function showToast(msg, type) {
    let color = '#6366f1';
    if (type === 'success') color = '#10b981';
    if (type === 'error') color = '#ef4444';
    let toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.position = 'fixed';
    toast.style.top = '24px';
    toast.style.right = '24px';
    toast.style.zIndex = 9999;
    toast.style.background = color;
    toast.style.color = '#fff';
    toast.style.padding = '14px 28px';
    toast.style.borderRadius = '1rem';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = '0 4px 24px 0 rgba(0,0,0,0.12)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '1'; }, 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

const loginToggle = document.getElementById('loginToggle');
const registerToggle = document.getElementById('registerToggle');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

function showLoginForm() {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginToggle.classList.add('active');
    registerToggle.classList.remove('active');
}

function showRegisterForm() {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    loginToggle.classList.remove('active');
    registerToggle.classList.add('active');
}

if (loginToggle && registerToggle && loginForm && registerForm) {
    loginToggle.addEventListener('click', showLoginForm);
    registerToggle.addEventListener('click', showRegisterForm);
}
if (showRegister) {
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        showRegisterForm();
    });
}
if (showLogin) {
    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        showLoginForm();
    });
}
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        window.location.href = 'dashboard.html';
    });
}
}); 