// ==================== GLOBAL STATE ====================
let selectedTemplate = "elegant";
let selectedCategory = "Wedding";
let selectedColor = "gold";

// ==================== TEMPLATE SELECTION ====================
document.querySelectorAll(".template-card").forEach((card) => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".template-card").forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        selectedTemplate = card.getAttribute("data-template");
    });
});

// ==================== CATEGORY SELECTION ====================
document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".category-card").forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        selectedCategory = card.getAttribute("data-category");
    });
});

// ==================== COLOR SELECTION ====================
document.getElementById("event-color").addEventListener("change", (e) => {
    selectedColor = e.target.value;
});

// ==================== FORM SUBMISSION ====================
document.getElementById("invite-form").addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect form data
    const title = encodeURIComponent(
        document.getElementById("event-title").value.trim()
    );
    const date = encodeURIComponent(
        document.getElementById("event-date").value.trim()
    );
    const venue = encodeURIComponent(
        document.getElementById("event-venue").value.trim()
    );
    const message = encodeURIComponent(
        document.getElementById("event-message").value.trim() ||
            "We joyfully invite you to celebrate this special occasion with us."
    );

    // Validate required fields
    if (!title || !date || !venue) {
        alert("Please fill in all required fields");
        return;
    }

    // Build the invitation URL
    const basePath = window.location.href.replace("index.html", "") + "invitation.html";
    const invitationUrl = `${basePath}?title=${title}&date=${date}&venue=${venue}&msg=${message}&cat=${selectedCategory}&template=${selectedTemplate}&color=${selectedColor}`;

    // Display result
    displayGeneratedLink(invitationUrl);
});

// ==================== DISPLAY GENERATED LINK ====================
function displayGeneratedLink(url) {
    const resultBox = document.getElementById("result-box");
    const generatedUrl = document.getElementById("generated-url");
    const previewBtn = document.getElementById("preview-btn");

    generatedUrl.value = url;
    previewBtn.href = url;
    resultBox.classList.remove("hidden");
    resultBox.scrollIntoView({ behavior: "smooth" });
}

// ==================== COPY TO CLIPBOARD ====================
document.getElementById("copy-btn").addEventListener("click", () => {
    const urlInput = document.getElementById("generated-url");
    urlInput.select();
    document.execCommand("copy");

    const btn = document.getElementById("copy-btn");
    const originalText = btn.textContent;
    btn.textContent = "✓ Copied!";
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
});

// ==================== CREATE NEW INVITATION ====================
document.getElementById("new-invite-btn").addEventListener("click", () => {
    document.getElementById("invite-form").reset();
    document.getElementById("result-box").classList.add("hidden");

    // Reset selections
    selectedTemplate = "elegant";
    selectedCategory = "Wedding";
    selectedColor = "gold";

    document.querySelector(".template-card.active").classList.remove("active");
    document.querySelector('.template-card[data-template="elegant"]').classList.add("active");

    document.querySelector(".category-card.active").classList.remove("active");
    document.querySelector('.category-card[data-category="Wedding"]').classList.add("active");

    document.getElementById("event-color").value = "gold";

    // Scroll to form
    document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
});

// ==================== SHARE FUNCTIONALITY ====================
document.querySelectorAll(".share-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const url = document.getElementById("generated-url").value;
        const title = document.getElementById("event-title").value;
        const btnClass = e.target.className;

        if (btnClass.includes("whatsapp-btn")) {
            const whatsappText = encodeURIComponent(
                `You're invited! 💌\n\n${title}\n\nClick here to view your invitation: ${url}`
            );
            window.open(`https://wa.me/?text=${whatsappText}`, "_blank");
        } else if (btnClass.includes("email-btn")) {
            const subject = encodeURIComponent(`Invitation: ${title}`);
            const body = encodeURIComponent(
                `You're invited!\n\n${title}\n\nClick here to view your invitation:\n${url}`
            );
            window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
        } else if (btnClass.includes("sms-btn")) {
            const smsText = encodeURIComponent(
                `You're invited! View: ${url}`
            );
            window.open(`sms:?body=${smsText}`, "_blank");
        }
    });
});

// ==================== SMOOTH SCROLL FOR NAV LINKS ====================
document.querySelectorAll("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href !== "#") {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        }
    });
});