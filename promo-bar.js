(function () {

    // CONFIG (esto después lo vas a vender editable)
    const config = {
        text: "Envío gratis a partir de $50.000",
        bg: "#111111",
        color: "#ffffff",
        link: "#"
    };

    // CREAR BARRA
    const bar = document.createElement("div");
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
    bar.style.padding = "12px";
    bar.style.fontSize = "14px";
    bar.style.zIndex = "9999";

    // TEXTO
    const text = document.createElement("span");
    text.innerText = config.text;

    // LINK
    const link = document.createElement("a");
    link.href = config.link;
    link.innerText = "Ver más";
    link.style.color = "#00e5ff";
    link.style.textDecoration = "none";

    // BOTON CERRAR
    const close = document.createElement("button");
    close.innerText = "✖";
    close.style.position = "absolute";
    close.style.right = "15px";
    close.style.background = "none";
    close.style.border = "none";
    close.style.color = "white";
    close.style.cursor = "pointer";

    close.onclick = () => {
        bar.style.display = "none";
    };

    // ARMAR
    bar.appendChild(text);
    bar.appendChild(link);
    bar.appendChild(close);

    document.body.appendChild(bar);

})();
