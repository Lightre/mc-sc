// script.js
window.addEventListener("beforeunload", () => {
    window.scrollTo(0, 0);
});

async function fetchServerData() {
    const address = document.getElementById("serverInput").value.trim();
    const errorMsg = document.getElementById("errorMsg");
    const grid = document.getElementById("infoGrid");
    const playerListEl = document.getElementById("playerList");

    // Clear
    errorMsg.textContent = "";
    errorMsg.classList.add("hidden");

    // Clear player list
    playerListEl.innerHTML = "";

    if (!address) {
        errorMsg.textContent = "Lütfen bir sunucu adresi gir.";
        errorMsg.classList.remove("hidden");
        grid.classList.add("hidden");
        return;
    }

    try {
        const response = await fetch(`https://api.mcsrvstat.us/2/${address}`);
        const data = await response.json();

        if (!data || !data.online) {
            errorMsg.textContent = "Sunucu çevrimdışı veya bulunamadı.";
            errorMsg.classList.remove("hidden");
            grid.classList.add("hidden");
            return;
        }

        document.getElementById("ip").innerText = data.ip || "Bilinmiyor";
        document.getElementById("port").innerText = data.port || "Varsayılan";
        document.getElementById("online").innerText = data.online ? "Çevrimiçi" : "Çevrimdışı";

        // Class for status
        const onlineSpan = document.getElementById("online");
        if (data.online) {
            onlineSpan.classList.add("online-status");
            onlineSpan.classList.remove("offline-status");
        } else {
            onlineSpan.classList.add("offline-status");
            onlineSpan.classList.remove("online-status");
        }

        document.getElementById("version").innerText = data.version || "Bilinmiyor";
        document.getElementById("players").innerText = `${data.players.online} / ${data.players.max}`;
        document.getElementById("motd").innerText = data.motd?.clean?.join("\n") || "Yok";
        document.getElementById("icon").src = data.icon || "";

        // New boxes
        document.getElementById("hostname").innerText = data.hostname || "Bilinmiyor";
        document.getElementById("software").innerText = data.software || "Bilinmiyor";
        document.getElementById("protocol").innerText = data.protocol || "Bilinmiyor";

        // Adding player list
        if (data.players?.list && Array.isArray(data.players.list)) {
            data.players.list.forEach((player) => {
                const li = document.createElement("li");
                li.style.display = "flex";
                li.style.alignItems = "center";
                li.style.gap = "8px";
                li.style.marginBottom = "6px";

                const avatar = document.createElement("img");
                avatar.src = `https://mc-heads.net/avatar/${player}/512`;
                avatar.alt = `${player} avatar`;
                avatar.classList.add("player-head"); // 💥

                const nameSpan = document.createElement("span");
                nameSpan.textContent = player;

                li.appendChild(avatar);
                li.appendChild(nameSpan);
                playerListEl.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = "Oyuncu listesi bulunamadı.";
            playerListEl.appendChild(li);
        }

        grid.classList.remove("hidden");
    } catch (error) {
        errorMsg.textContent = "Bilinmeyen bir hata oluştu.";
        errorMsg.classList.remove("hidden");
        grid.classList.add("hidden");
        console.error(error);
    }
}

// Lightre - Search by Enter
document.getElementById("serverInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        fetchServerData();
    }
});

// Event & localStorage management for theme switch
document.addEventListener("DOMContentLoaded", () => {
    const themeSwitch = document.getElementById("themeSwitch");
    if (!themeSwitch) return;

    // Apply saved theme
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-theme");
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener("change", () => {
        if (themeSwitch.checked) {
            document.body.classList.add("light-theme");
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.remove("light-theme");
            localStorage.setItem("theme", "dark");
        }
    });
});
