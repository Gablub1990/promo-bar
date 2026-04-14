(function () {
    const userConfig = window.PromoBarConfig || {};

    const defaults = {
        mode: "announcement",
        text: "Envío gratis a partir de $50.000",
        bg: "#111111",
        color: "#ffffff",
        link: "#",
        linkText: "Ver más",
        showLink: true,
        closable: true,
        mobile: true,
        active: true,
        end: ""
    };

    const config = { ...defaults, ...userConfig };

    if (!config.active) return;
    if (!config.mobile && window.innerWidth <= 768) return;

    const existingBar = document.getElementById("promo-bar-script");
    if (existingBar) existingBar.remove();

    function formatCountdown(endValue) {
        if (!endValue) return "00:00:00";

        const end = new Date(endValue).getTime();
        const now = new Date().getTime();
        const distance = end - now;

        if (distance <= 0) return "Finalizada";

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);

        if (days > 0) {
            return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
        }

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    const bar = document.createElement("div");
    bar.id = "promo-bar-script";
    bar.style.position = "fixed";
    bar.style.top = "0";
    bar.style.left = "0";
    bar.style.width = "100%";
    bar.style.backgroundColor = config.bg;
    bar.style.color = config.color;
    bar.style.display = "flex";
    bar.style.justifyContent = "center";
    bar.style.alignItems = "center";
    bar.style.gap = "14px";
    bar.style.padding = "12px 48px 12px 16px";
    bar.style.fontSize = "14px";
    bar.style.fontFamily = "Arial, sans-serif";
    bar.style.fontWeight = "600";
    bar.style.lineHeight = "1.3";
    bar.style.zIndex = "9999";
    bar.style.boxSizing = "border-box";
    bar.style.textAlign = "center";
    bar.style.minHeight = "48px";
    bar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.12)";
    bar.style.flexWrap = "wrap";

    const text = document.createElement("span");
    text.id = "promo-bar-text";
    text.style.whiteSpace = "nowrap";

    if (config.mode === "countdown") {
        text.textContent = config.text || `Oferta termina en ${formatCountdown(config.end)}`;
    } else {
        text.textContent = config.text;
    }

    bar.appendChild(text);

    let link = null;
    if (config.showLink) {
        link = document.createElement("a");
        link.href = config.link || "#";
        link.innerText = config.linkText || "Ver más";
        link.style.color = "#00e5ff";
        link.style.textDecoration = "none";
        link.style.fontWeight = "700";
        link.style.whiteSpace = "nowrap";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        link.onmouseover = () => {
            link.style.textDecoration = "underline";
        };

        link.onmouseout = () => {
            link.style.textDecoration = "none";
        };

        bar.appendChild(link);
    }

    if (config.closable) {
        const close = document.createElement("button");
        close.innerText = "✕";
        close.setAttribute("aria-label", "Cerrar banner");
        close.style.position = "absolute";
        close.style.right = "12px";
        close.style.top = "50%";
        close.style.transform = "translateY(-50%)";
        close.style.width = "28px";
        close.style.height = "28px";
        close.style.display = "flex";
        close.style.alignItems = "center";
        close.style.justifyContent = "center";
        close.style.background = "transparent";
        close.style.border = "none";
        close.style.borderRadius = "999px";
        close.style.color = config.color;
        close.style.cursor = "pointer";
        close.style.fontSize = "16px";
        close.style.lineHeight = "1";
        close.style.opacity = "0.9";

        close.onmouseover = () => {
            close.style.background = "rgba(255,255,255,0.12)";
        };

        close.onmouseout = () => {
            close.style.background = "transparent";
        };

        close.onclick = () => {
            const barHeight = bar.offsetHeight;
            bar.remove();

            const currentPaddingTop =
                parseInt(window.getComputedStyle(document.body).paddingTop, 10) || 0;

            document.body.style.paddingTop = `${Math.max(currentPaddingTop - barHeight, 0)}px`;
        };

        bar.appendChild(close);
    }

    document.body.appendChild(bar);

    const barHeight = bar.offsetHeight;
    const currentPaddingTop = parseInt(window.getComputedStyle(document.body).paddingTop, 10) || 0;
    document.body.style.paddingTop = `${currentPaddingTop + barHeight}px`;

    if (window.innerWidth <= 768) {
        bar.style.fontSize = "13px";
        bar.style.padding = "10px 40px 10px 12px";
        bar.style.gap = "10px";
        text.style.whiteSpace = "normal";
        text.style.maxWidth = "70%";
    }

    if (config.mode === "countdown" && config.end) {
        const baseText = config.text || "Oferta termina en";

        const interval = setInterval(() => {
            if (!document.body.contains(bar)) {
                clearInterval(interval);
                return;
            }

            const countdownText = formatCountdown(config.end);

            if (countdownText === "Finalizada") {
                text.textContent = "Oferta finalizada";
                clearInterval(interval);
                return;
            }

            text.textContent = `${baseText} ${countdownText}`;
        }, 1000);
    }
})();
