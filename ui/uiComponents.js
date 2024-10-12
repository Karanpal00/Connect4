export function createContainer() {
    const container = document.createElement('div');
    container.className = 'container';
    return container;
}

export function createInput(type, placeholder) {
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    return input;
}

export function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

export function createModal(title, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';  // This line is changed

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => modal.remove();

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = title;

    const input = createInput('text', 'Enter room ID');
    const confirmBtn = createButton('Join', () => {
        const roomId = input.value.trim();
        if (roomId) {
            onConfirm(roomId);
            modal.remove();
        } else {
            input.style.borderColor = 'red';
        }
    });

    modalContent.append(closeBtn, modalTitle, input, confirmBtn);
    modal.appendChild(modalContent);

    return modal;
}

export function addStyles() {
    const styles = `
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }
        .container {
            background-color: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }
        h1 {
            color: #333;
            margin-top: 0;
        }
        input, button {
            display: block;
            width: 100%;
            padding: 0.5rem;
            margin: 1rem 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #45a049;
        }
        button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
        #roomIdDisplay {
            display: none;
            background-color: #e9e9e9;
            padding: 0.5rem;
            border-radius: 4px;
            margin-top: 1rem;
            font-weight: bold;
        }
        .game-info {
            text-align: left;
            margin-top: 1rem;
        }
        .game-info p {
            margin: 0.5rem 0;
        }
        .modal {
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.4);
        }
        .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 400px;
            border-radius: 10px;
        }
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}