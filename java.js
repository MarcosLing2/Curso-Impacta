const heroVisual = document.querySelector('.hero-visual');

if (heroVisual) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const supportsFinePointer = window.matchMedia('(pointer: fine)');

    const revealHero = () => {
        requestAnimationFrame(() => {
            heroVisual.classList.add('is-visible');
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    revealHero();
                    observer.disconnect();
                }
            });
        },
        {
            threshold: 0.35
        }
    );

    observer.observe(heroVisual);

    if (!prefersReducedMotion.matches && supportsFinePointer.matches) {
        const maxOffset = 16;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        let rafId = null;

        const render = () => {
            currentX += (targetX - currentX) * 0.12;
            currentY += (targetY - currentY) * 0.12;

            heroVisual.style.setProperty('--pointer-x', `${currentX.toFixed(2)}px`);
            heroVisual.style.setProperty('--pointer-y', `${currentY.toFixed(2)}px`);

            const isMoving = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;
            rafId = isMoving ? requestAnimationFrame(render) : null;
        };

        const startRender = () => {
            if (!rafId) {
                rafId = requestAnimationFrame(render);
            }
        };

        heroVisual.addEventListener('pointermove', (event) => {
            const rect = heroVisual.getBoundingClientRect();
            const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
            const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

            targetX = offsetX * maxOffset;
            targetY = offsetY * maxOffset;
            startRender();
        });

        heroVisual.addEventListener('pointerleave', () => {
            targetX = 0;
            targetY = 0;
            startRender();
        });
    } else {
        heroVisual.classList.add('is-visible');
    }
}
