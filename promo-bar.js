(function () {
    const userConfig = window.PromoBarConfig || {};

    const config = {
        text: userConfig.text || "Envío gratis a partir de $50.000",
        bg: userConfig.bg || "#111111",
        color: userConfig.color || "#ffffff",
        link: userConfig.link || "#",
        linkText: userConfig.linkText || "Ver más",
        showLink: userConfig.showLink !== false,
        closable: userConfig.closable !== false
    };

    const existingBar = document.getElementById("promo-bar-script");
    if (existingBar) {
        existingBar.remove();
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
    bar.style.gap = "15px";
    bar.style.padding = "12px 20px";
    bar.style.fontSize = "14px";
    bar.style.fontFamily = "Arial, sans-serif";
    bar.style.zIndex = "9999";
    bar.style.boxSizing = "border-box";

    const text = document.createElement("span");
    text.innerText = config.text;

    bar.appendChild(text);

    if (config.showLink) {
        const link = document.createElement("a");
        link.href = config.link;
        link.innerText = config.linkText;
        link.style.color = "#00e5ff";
        link.style.textDecoration = "none";
        link.style.fontWeight = "bold";
        link.target = "_blank";
        bar.appendChild(link);
    }

    if (config.closable) {
        const close = document.createElement("button");
        close.innerText = "✖";
        close.style.position = "absolute";
        close.style.right = "15px";
        close.style.background = "none";
        close.style.border = "none";
        close.style.color = config.color;
        close.style.cursor = "pointer";
        close.style.fontSize = "16px";

        close.onclick = () => {
            bar.style.display = "none";
        };

        bar.appendChild(close);
    }

    document.body.appendChild(bar);

    document.body.style.paddingTop = "48px";
})();


