const typeInputs = document.querySelectorAll('input[name="bannerType"]');

const announcementFields = document.getElementById("announcement-fields");
const shippingFields = document.getElementById("shipping-fields");
const countdownFields = document.getElementById("countdown-fields");

const announcementText = document.getElementById("announcementText");
const announcementLink = document.getElementById("announcementLink");
const announcementButtonText = document.getElementById("announcementButtonText");

const shippingGoal = document.getElementById("shippingGoal");
const shippingCurrent = document.getElementById("shippingCurrent");
const shippingMessage = document.getElementById("shippingMessage");

const countdownMessage = document.getElementById("countdownMessage");
const countdownEnd = document.getElementById("countdownEnd");

const bgColor = document.getElementById("bgColor");
const textColor = document.getElementById("textColor");
const buttonColor = document.getElementById("buttonColor");

const showBanner = document.getElementById("showBanner");
const showClose = document.getElementById("showClose");
const showOnMobile = document.getElementById("showOnMobile");

const previewBar = document.getElementById("previewBar");
const previewText = document.getElementById("previewText");
const previewLink = document.getElementById("previewLink");
const previewClose = document.getElementById("previewClose");

const saveBtn = document.getElementById("saveBtn");
const saveStatus = document.getElementById("saveStatus");
const configOutput = document.getElementById("configOutput");
const copyCodeBtn = document.getElementById("copyCodeBtn");

const SCRIPT_URL = "https://promo-bar-935.vercel.app/promo-bar.js";

function getSelectedType() {
    return document.querySelector('input[name="bannerType"]:checked').value;
}

function updateModeFields() {
    const type = getSelectedType();

    announcementFields.classList.toggle("hidden", type !== "announcement");
    shippingFields.classList.toggle("hidden", type !== "shipping");
    countdownFields.classList.toggle("hidden", type !== "countdown");

    updatePreview();
}

function formatCurrency(value) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    }).format(value);
}

function getCountdownText(endValue) {
    if (!endValue) return "00:00:00";

    const end = new Date(endValue).getTime();
    const now = new Date().getTime();
    const distance = end - now;

    if (distance <= 0) return "Finalizada";

    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    if (days > 0) {
        return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function buildPanelConfig() {
    const type = getSelectedType();

    const baseConfig = {
        type,
        styles: {
            bg: bgColor.value,
            color: textColor.value,
            buttonColor: buttonColor.value
        },
        behavior: {
            active: showBanner.checked,
            closable: showClose.checked,
            mobile: showOnMobile.checked
        }
    };

    if (type === "announcement") {
        return {
            ...baseConfig,
            content: {
                text: announcementText.value.trim() || "20% OFF en toda la tienda",
                link: announcementLink.value.trim() || "#",
                buttonText: announcementButtonText.value.trim() || "Comprar ahora"
            }
        };
    }

    if (type === "shipping") {
        const goal = Number(shippingGoal.value) || 0;
        const current = Number(shippingCurrent.value) || 0;
        const remaining = Math.max(goal - current, 0);
        const template = shippingMessage.value.trim() || "Te faltan {amount} para envío gratis";

        return {
            ...baseConfig,
            content: {
                goal,
                current,
                remaining,
                template,
                message: template.replace("{amount}", formatCurrency(remaining))
            }
        };
    }

    return {
        ...baseConfig,
        content: {
            message: countdownMessage.value.trim() || "Oferta termina en",
            end: countdownEnd.value,
            countdownText: getCountdownText(countdownEnd.value)
        }
    };
}

function buildPluginConfig(panelConfig) {
    const common = {
        bg: panelConfig.styles.bg,
        color: panelConfig.styles.color,
        closable: panelConfig.behavior.closable,
        mobile: panelConfig.behavior.mobile,
        active: panelConfig.behavior.active
    };

    if (panelConfig.type === "announcement") {
        return {
            mode: "announcement",
            text: panelConfig.content.text,
            bg: common.bg,
            color: common.color,
            link: panelConfig.content.link,
            linkText: panelConfig.content.buttonText,
            showLink: true,
            closable: common.closable,
            mobile: common.mobile,
            active: common.active
        };
    }

    if (panelConfig.type === "shipping") {
        return {
            mode: "shipping",
            text: panelConfig.content.message,
            bg: common.bg,
            color: common.color,
            link: "#",
            linkText: "Ver promo",
            showLink: true,
            closable: common.closable,
            mobile: common.mobile,
            active: common.active,
            goal: panelConfig.content.goal,
            current: panelConfig.content.current
        };
    }

    return {
        mode: "countdown",
        text: `${panelConfig.content.message} ${panelConfig.content.countdownText}`,
        bg: common.bg,
        color: common.color,
        link: "#",
        linkText: "Aprovechar ahora",
        showLink: true,
        closable: common.closable,
        mobile: common.mobile,
        active: common.active,
        end: panelConfig.content.end
    };
}

function generateInstallCode(pluginConfig) {
    const configText = JSON.stringify(pluginConfig, null, 2);

    return `<script>
window.PromoBarConfig = ${configText};
</script>
<script src="${SCRIPT_URL}"></script>`;
}

function updatePreview() {
    const panelConfig = buildPanelConfig();

    previewBar.style.backgroundColor = panelConfig.styles.bg;
    previewBar.style.color = panelConfig.styles.color;
    previewBar.style.display = panelConfig.behavior.active ? "flex" : "none";

    previewLink.style.color = panelConfig.styles.buttonColor;
    previewClose.style.display = panelConfig.behavior.closable ? "block" : "none";

    if (panelConfig.type === "announcement") {
        previewText.textContent = panelConfig.content.text;
        previewLink.textContent = panelConfig.content.buttonText;
        previewLink.href = panelConfig.content.link;
        previewLink.style.display = "inline";
    }

    if (panelConfig.type === "shipping") {
        previewText.textContent = panelConfig.content.message;
        previewLink.textContent = "Ver promo";
        previewLink.href = "#";
        previewLink.style.display = "inline";
    }

    if (panelConfig.type === "countdown") {
        previewText.textContent = `${panelConfig.content.message} ${panelConfig.content.countdownText}`;
        previewLink.textContent = "Aprovechar ahora";
        previewLink.href = "#";
        previewLink.style.display = "inline";
    }

    const pluginConfig = buildPluginConfig(panelConfig);
    configOutput.textContent = generateInstallCode(pluginConfig);
}

function saveConfig() {
    const panelConfig = buildPanelConfig();
    const pluginConfig = buildPluginConfig(panelConfig);

    localStorage.setItem("conversionBarPanelConfig", JSON.stringify(panelConfig));
    localStorage.setItem("conversionBarPluginConfig", JSON.stringify(pluginConfig));

    configOutput.textContent = generateInstallCode(pluginConfig);
    saveStatus.textContent = "Guardado correctamente";

    setTimeout(() => {
        saveStatus.textContent = "";
    }, 2000);
}

function loadSavedConfig() {
    const saved = localStorage.getItem("conversionBarPanelConfig");

    if (!saved) {
        updatePreview();
        return;
    }

    const panelConfig = JSON.parse(saved);

    const selected = document.querySelector(`input[name="bannerType"][value="${panelConfig.type}"]`);
    if (selected) selected.checked = true;

    bgColor.value = panelConfig.styles.bg;
    textColor.value = panelConfig.styles.color;
    buttonColor.value = panelConfig.styles.buttonColor;

    showBanner.checked = panelConfig.behavior.active;
    showClose.checked = panelConfig.behavior.closable;
    showOnMobile.checked = panelConfig.behavior.mobile;

    if (panelConfig.type === "announcement") {
        announcementText.value = panelConfig.content.text;
        announcementLink.value = panelConfig.content.link;
        announcementButtonText.value = panelConfig.content.buttonText;
    }

    if (panelConfig.type === "shipping") {
        shippingGoal.value = panelConfig.content.goal;
        shippingCurrent.value = panelConfig.content.current;
        shippingMessage.value = panelConfig.content.template || "Te faltan {amount} para envío gratis";
    }

    if (panelConfig.type === "countdown") {
        countdownMessage.value = panelConfig.content.message;
        countdownEnd.value = panelConfig.content.end || "";
    }

    updateModeFields();
    updatePreview();
}

async function copyInstallCode() {
    try {
        await navigator.clipboard.writeText(configOutput.textContent);
        saveStatus.textContent = "Código copiado";
        setTimeout(() => {
            saveStatus.textContent = "";
        }, 2000);
    } catch (error) {
        saveStatus.textContent = "No se pudo copiar";
        setTimeout(() => {
            saveStatus.textContent = "";
        }, 2000);
    }
}

typeInputs.forEach(input => input.addEventListener("change", updateModeFields));

[
    announcementText,
    announcementLink,
    announcementButtonText,
    shippingGoal,
    shippingCurrent,
    shippingMessage,
    countdownMessage,
    countdownEnd,
    bgColor,
    textColor,
    buttonColor,
    showBanner,
    showClose,
    showOnMobile
].forEach(element => {
    element.addEventListener("input", updatePreview);
    element.addEventListener("change", updatePreview);
});

saveBtn.addEventListener("click", saveConfig);
copyCodeBtn.addEventListener("click", copyInstallCode);

setInterval(() => {
    if (getSelectedType() === "countdown") {
        updatePreview();
    }
}, 1000);

loadSavedConfig();