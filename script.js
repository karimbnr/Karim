const socket = io();

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

async function register() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });

    const result = await response.text();
    alert(result);
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.text();
    if (response.status === 200) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('chat').style.display = 'block';
    }
    alert(result);
}

async function sendMessage() {
    const receiver = document.getElementById('receiver').value;
    const message = document.getElementById('message').value;
    const image = document.getElementById('image').files[0];

    const formData = new FormData();
    formData.append('sender', 'user1'); // يمكن تغيير هذا ليكون المستخدم الحالي
    formData.append('receiver', receiver);
    formData.append('message', message);
    if (image) formData.append('image', image);

    const response = await fetch('/send-message', {
        method: 'POST',
        body: formData,
    });

    const result = await response.text();
    alert(result);
}

socket.on('receive-message', (message) => {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.innerHTML = `
        <p><strong>${message.sender}:</strong> ${message.message}</p>
        ${message.image ? `<img src="${message.image}" alt="صورة">` : ''}
    `;
    messagesDiv.appendChild(messageElement);
});
