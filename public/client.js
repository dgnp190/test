
const socket = io();

let username;
let updatedUserName;
let userRoomCode;

const messageContainer = document.getElementById('message_container');

const roomIdInput = document.getElementById("roomIdInput");
const joinRoomBtn = document.getElementById("joinRoomBtn");

const sendMessageBtn = document.getElementById("sendMessage");
const messageInput = document.getElementById("messageInput");

joinRoomBtn.addEventListener('click', () => {
    let inputCode = roomIdInput.value;
    socket.emit('join_room', inputCode);
});

sendMessageBtn.addEventListener('click', () => {
    let message = messageInput.value;
    if (message !== '') {
        let trimmed_msg = message.replace(/^\s+|\s+$/gm, '');
        trimmed_msg = message.trim();
        sendMsg(trimmed_msg);
    }
});

messageInput.addEventListener('keypress', e => {
    if (e.charCode == 13) {
        let message = messageInput.value;
        if (message !== '') {
            let trimmed_msg = message.replace(/^\s+|\s+$/gm, '');
            trimmed_msg = message.trim();
            sendMsg(trimmed_msg);
        }
    }
});

function sendMsg(msg) {
    const msgBox = document.createElement('div');
    msgBox.classList.add('message_box');
    msgBox.classList.add('right');

    const usernameSpan = document.createElement('span');
    usernameSpan.innerText = updatedUserName;

    const brk = document.createElement('br');

    const sms = document.createElement('p');
    sms.innerText = msg;

    msgBox.appendChild(usernameSpan);
    msgBox.appendChild(brk);
    msgBox.appendChild(sms);

    messageContainer.appendChild(msgBox);

    messageInput.value = '';

    socket.emit('send_msg', { sender: updatedUserName, roomId: userRoomCode, message: msg });
}

socket.on('room_joined', data => {
    alert("Room joined - " + data.roomcode);
    loadRoom(data.roomcode, data.size);
    userRoomCode = data.roomcode;
});

socket.on('no_room', msg => {
    alert(`There is no such room`);
});

socket.on('alert_username', name => {
    const alertBox = document.createElement('div');
    alertBox.classList.add("alert_box");

    const alertUsername = document.createElement('span');
    alertUsername.innerText = name;

    const alertLabel = document.createElement('p');
    alertLabel.innerHTML = "&nbsp;joined the room"

    alertBox.appendChild(alertUsername);
    alertBox.appendChild(alertLabel);

    messageContainer.appendChild(alertBox);
});

socket.on('recieve_msg', data => {
    if (data.sentBy == updatedUserName) {
        return;
    } else {
        const msgBox = document.createElement('div');
        msgBox.classList.add('message_box');

        const usernameSpan = document.createElement('span');
        usernameSpan.innerText = data.sentBy;

        const brk = document.createElement('br');

        const sms = document.createElement('p');
        sms.innerText = data.sms;

        msgBox.appendChild(usernameSpan);
        msgBox.appendChild(brk);
        msgBox.appendChild(sms);

        messageContainer.appendChild(msgBox);
    }
});

function loadRoom(code, size) {
    document.querySelector('.get_started_container').classList.add('hidden');
    document.querySelector('.room_container').classList.remove('hidden');
    getUsername();
    function getUsername() {
        username = prompt("Enter a username");
        username.trim();
        updatedUserName = username;
        alertRoomJoin(username, code);
    }
    updateUserDisplay(size);
}

function alertRoomJoin(username, roomcode) {
    socket.emit('alert_room_joined', { clientName: username, roomId: roomcode });
}

function updateUserDisplay(size) {
    console.log(size);
}
