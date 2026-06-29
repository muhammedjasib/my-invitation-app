// ==================== GLOBAL STATE ====================
let selectedTemplate = "elegant";
let selectedCategory = "Wedding";
let selectedColor = "gold";
let selectedMusicFile = null;
let musicBase64 = null;

// ==================== TEMPLATE SELECTION ====================
function initTemplateCards() {
    document.querySelectorAll(".template-card").forEach((card) => {
        card.addEventListener("click", () => {
            document.querySelectorAll(".template-card").forEach((c) => c.classList.remove("active"));
            card.classList.add("active");
            selectedTemplate = card.getAttribute("data-template");
        });
    });
}

// ==================== CATEGORY SELECTION ====================
function initCategoryCards() {
    document.querySelectorAll(".category-card").forEach((card) => {
        card.addEventListener("click", () => {
            document.querySelectorAll(".category-card").forEach((c) => c.classList.remove("active"));
            card.classList.add("active");
            selectedCategory = card.getAttribute("data-category");
        });
    });
}

// ==================== COLOR SELECTION ====================
function initColorSelection() {
    const colorSelect = document.getElementById("event-color");
    if (colorSelect) {
        colorSelect.addEventListener("change", (e) => {
            selectedColor = e.target.value;
        });
    }
}

// ==================== MUSIC FILE UPLOAD ====================
function initMusicUpload() {
    const musicInput = document.getElementById("event-music");
    if (musicInput) {
        musicInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                selectedMusicFile = file;
                const fileName = document.getElementById("music-file-name");
                const sizeMB = (file.size / 1024 / 1024).toFixed(2);
                fileName.textContent = `✓ Selected: ${file.name} (${sizeMB}MB)`;
                fileName.classList.remove("hidden");

                // Convert file to Base64
                const reader = new FileReader();
                reader.onload = (event) => {
                    musicBase64 = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// ==================== FORM SUBMISSION ====================
function initFormSubmission() {
    const form = document.getElementById("invite-form");
    if (form) {
        form.addEventListener("submit", (e) => {
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
            let invitationUrl = `${basePath}?title=${title}&date=${date}&venue=${venue}&msg=${message}&cat=${selectedCategory}&template=${selectedTemplate}&color=${selectedColor}`;

            // Add music if selected - Store in sessionStorage for long URLs
            if (musicBase64) {
                // Store music in sessionStorage with a unique key
                const musicKey = "music_" + Date.now();
                try {
                    sessionStorage.setItem(musicKey, musicBase64);
                    invitationUrl += `&musicKey=${musicKey}`;
                } catch (e) {
                    console.warn("SessionStorage full or unavailable", e);
                    alert("Music file is too large. Please try a smaller file (under 5MB).");
                    return;
                }
            }

            // Display result
            displayGeneratedLink(invitationUrl);
        });
    }
}

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
function initCopyButton() {
    const copyBtn = document.getElementById("copy-btn");
    if (copyBtn) {
        copyBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const urlInput = document.getElementById("generated-url");
            
            // Modern clipboard API
            if (navigator.clipboard) {
                navigator.clipboard.writeText(urlInput.value).then(() => {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = "✓ Copied!";
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                    }, 2000);
                    alert("Link copied to clipboard!");
                }).catch(() => {
                    // Fallback method
                    fallbackCopy(urlInput);
                });
            } else {
                // Fallback for older browsers
                fallbackCopy(urlInput);
            }
        });
    }
}

// Fallback copy function
function fallbackCopy(element) {
    element.select();
    try {
        document.execCommand("copy");
        const copyBtn = document.getElementById("copy-btn");
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "✓ Copied!";
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
        alert("Link copied to clipboard!");
    } catch (err) {
        alert("Failed to copy. Please copy manually.");
    }
}

// ==================== PREVIEW BUTTON ====================
function initPreviewButton() {
    const previewBtn = document.getElementById("preview-btn");
    if (previewBtn) {
        previewBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const url = document.getElementById("generated-url").value;
            if (url) {
                window.location.href = url;
            }
        });
    }
}

// ==================== CREATE NEW INVITATION ====================
function initNewInviteButton() {
    const newBtn = document.getElementById("new-invite-btn");
    if (newBtn) {
        newBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const form = document.getElementById("invite-form");
            if (form) form.reset();
            document.getElementById("result-box").classList.add("hidden");
            const musicFileName = document.getElementById("music-file-name");
            if (musicFileName) musicFileName.classList.add("hidden");

            // Reset selections
            selectedTemplate = "elegant";
            selectedCategory = "Wedding";
            selectedColor = "gold";
            selectedMusicFile = null;
            musicBase64 = null;

            const activeTemplate = document.querySelector(".template-card.active");
            if (activeTemplate) activeTemplate.classList.remove("active");
            const elegantTemplate = document.querySelector('.template-card[data-template="elegant"]');
            if (elegantTemplate) elegantTemplate.classList.add("active");

            const activeCategory = document.querySelector(".category-card.active");
            if (activeCategory) activeCategory.classList.remove("active");
            const weddingCategory = document.querySelector('.category-card[data-category="Wedding"]');
            if (weddingCategory) weddingCategory.classList.add("active");

            const colorSelect = document.getElementById("event-color");
            if (colorSelect) colorSelect.value = "gold";

            // Scroll to form
            const formSection = document.querySelector(".form-section");
            if (formSection) {
                formSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }
}

// ==================== SHARE FUNCTIONALITY ====================
function initShareButtons() {
    document.querySelectorAll(".share-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const url = document.getElementById("generated-url").value;
            const title = document.getElementById("event-title").value || "You're Invited!";
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
}

// ==================== SMOOTH SCROLL FOR NAV LINKS ====================
function initNavLinks() {
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
}

// ==================== INITIALIZE ALL ====================
document.addEventListener("DOMContentLoaded", () => {
    initTemplateCards();
    initCategoryCards();
    initColorSelection();
    initMusicUpload();
    initFormSubmission();
    initCopyButton();
    initPreviewButton();
    initNewInviteButton();
    initShareButtons();
    initNavLinks();
});