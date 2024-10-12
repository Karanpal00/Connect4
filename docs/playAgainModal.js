// playAgainModal.js

class PlayAgainModal {
    constructor() {
      this.modal = null;
      this.yesButton = null;
      this.noButton = null;
      this.timerDisplay = null;
      this.timeLeft = 15; // 15 seconds timer
      this.timerInterval = null;
      this.styleElement = null;
    }
  
    createModal() {
      const modalHTML = `
        <div id="playAgainModal" class="modal">
          <div class="modal-content">
            <h2>Play Again?</h2>
            <p>Do you want to play another game?</p>
            <p id="timerDisplay">Time left: 15 seconds</p>
            <div class="button-container">
              <button id="yesButton" class="active-button">Yes</button>
              <button id="noButton" class="active-button">No</button>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
  
      this.modal = document.getElementById('playAgainModal');
      this.yesButton = document.getElementById('yesButton');
      this.noButton = document.getElementById('noButton');
      this.timerDisplay = document.getElementById('timerDisplay');
    }
  
    addStyles() {
      const styles = `
        .modal {
          display: none;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          justify-content: center;
          align-items: center;
        }
  
        .modal-content {
          background-color: #f4f4f4;
          padding: 20px;
          border-radius: 5px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
  
        .button-container {
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
        }
  
        .active-button {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
  
        .active-button:hover {
          background-color: #45a049;
        }
  
        #timerDisplay {
          font-weight: bold;
          margin-top: 10px;
          color: #ff4500;
        }
      `;
  
      this.styleElement = document.createElement('style');
      this.styleElement.textContent = styles;
      document.head.appendChild(this.styleElement);
    }
  
    handleResize() {
      const modalContent = this.modal.querySelector('.modal-content');
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
  
      modalContent.style.width = `${Math.min(400, windowWidth * 0.8)}px`;
      modalContent.style.height = `${Math.min(250, windowHeight * 0.8)}px`;
    }
  
    startTimer(resolve) {
      this.timerInterval = setInterval(() => {
        this.timeLeft--;
        this.timerDisplay.textContent = `Time left: ${this.timeLeft} seconds`;
        
        if (this.timeLeft <= 0) {
          clearInterval(this.timerInterval);
          this.cleanup();
          resolve(false); // Player didn't respond in time, treat as "No"
        }
      }, 1000);
    }
  
    cleanup() {
      clearInterval(this.timerInterval);
      this.timeLeft = 15; // Reset timer for next use
      window.removeEventListener('resize', this.boundHandleResize);
      
      // Remove the modal from the DOM
      if (this.modal) {
        this.modal.remove();
        this.modal = null;
      }
      
      // Remove the style element from the DOM
      if (this.styleElement) {
        this.styleElement.remove();
        this.styleElement = null;
      }
    }
  
    show() {
      return new Promise((resolve) => {
        this.createModal();
        this.addStyles();
        
        this.modal.style.display = 'flex';
        this.timerDisplay.textContent = `Time left: ${this.timeLeft} seconds`;
  
        // Initial resize
        this.handleResize();
  
        // Add event listener for window resize
        this.boundHandleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.boundHandleResize);
  
        this.yesButton.onclick = () => {
          this.cleanup();
          resolve(true);
        };
  
        this.noButton.onclick = () => {
          this.cleanup();
          resolve(false);
        };
  
        this.startTimer(resolve);
      });
    }
  }
  
  export default PlayAgainModal;