// Utility Functions
// Common helper functions used throughout the application

const Utils = (() => {
    // Validate email
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Validate phone number
    const validatePhone = (phone) => {
        const regex = /^[\d\s()+-]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
        return regex;
    };

    // Validate URL
    const validateURL = (url) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };

    // Sanitize input to prevent XSS
    const sanitizeInput = (input) => {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    };

    // Format date
    const formatDate = (date, format = 'MM/DD/YYYY') => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const formats = {
            'MM/DD/YYYY': `${month}/${day}/${year}`,
            'DD/MM/YYYY': `${day}/${month}/${year}`,
            'YYYY-MM-DD': `${year}-${month}-${day}`,
            'MMM DD, YYYY': `${new Date(year, date.getMonth()).toLocaleString('en', { month: 'short' })} ${day}, ${year}`,
            'DD MMM YYYY': `${day} ${new Date(year, date.getMonth()).toLocaleString('en', { month: 'short' })} ${year}`,
            'HH:MM': `${hours}:${minutes}`,
            'MM/DD/YYYY HH:MM': `${month}/${day}/${year} ${hours}:${minutes}`
        };

        return formats[format] || formats['MM/DD/YYYY'];
    };

    // Calculate days until date
    const daysUntil = (date) => {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Format countdown
    const formatCountdown = (date) => {
        const now = new Date();
        const eventDate = new Date(date);
        const diff = eventDate - now;

        if (diff < 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds, expired: false };
    };

    // Copy to clipboard
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Copy error:', error);
            return false;
        }
    };

    // Generate random ID
    const generateId = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    // Debounce function
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Throttle function
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    // Check if device is mobile
    const isMobileDevice = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // Get device info
    const getDeviceInfo = () => {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            isMobile: isMobileDevice()
        };
    };

    // Generate QR Code
    const generateQRCode = (text, elementId, size = 200) => {
        try {
            const QRCode = window.QRCode;
            if (!QRCode) throw new Error('QRCode library not loaded');
            
            const element = document.getElementById(elementId);
            if (!element) throw new Error(`Element with ID ${elementId} not found`);
            
            new QRCode(element, {
                text: text,
                width: size,
                height: size,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
            return true;
        } catch (error) {
            console.error('QR Code generation error:', error);
            return false;
        }
    };

    // Show notification
    const showNotification = (message, type = 'info', duration = 3000) => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            background: ${type === 'error' ? '#f8d7da' : type === 'success' ? '#d4edda' : '#d1ecf1'};
            color: ${type === 'error' ? '#721c24' : type === 'success' ? '#155724' : '#0c5460'};
            border: 1px solid ${type === 'error' ? '#f5c6cb' : type === 'success' ? '#c3e6cb' : '#bee5eb'};
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    };

    return {
        validateEmail,
        validatePhone,
        validateURL,
        sanitizeInput,
        formatDate,
        daysUntil,
        formatCountdown,
        copyToClipboard,
        generateId,
        debounce,
        throttle,
        formatFileSize,
        isMobileDevice,
        getDeviceInfo,
        generateQRCode,
        showNotification
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
