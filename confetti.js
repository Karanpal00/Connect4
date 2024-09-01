export const confettistart = {
    colors: ['#FF5733', '#FFDD57', '#33FF57', '#3357FF', '#FF33A1', '#A133FF'],

    createConfettiPiece() {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * window.innerWidth}px`;
        confetti.style.top = `-${Math.random() * 20}px`;
        confetti.style.backgroundColor = this.getRandomColor();
        document.body.appendChild(confetti);

        gsap.to(confetti, {
            y: window.innerHeight + 100,
            x: `random(-200, 200)`,
            rotation: `random(0, 360)`,
            duration: `random(2, 4)`,
            ease: "power1.out",
            onComplete: () => confetti.remove()
        });
    },

    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    },

    startConfetti() {
        this.confettiInterval = setInterval(() => this.createConfettiPiece(), 75);
    },

    stopConfetti() {
        clearInterval(this.confettiInterval);
        document.querySelectorAll('.confetti').forEach(el => el.remove());
    }
};
