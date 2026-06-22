/**
 * Calculates discount amount based on discount string and original price.
 * Supports percentage discount (e.g. "10%") and flat discount (e.g. "500", "₹1000").
 * @param {string} discountStr 
 * @param {number} originalPrice 
 * @returns {number} The calculated discount amount.
 */
export const calculateDiscountAmount = (discountStr, originalPrice) => {
    if (!discountStr || !originalPrice) return 0;
    
    // Clean string to keep only digits, dots, and percent sign
    const cleanStr = discountStr.replace(/[^\d.%]/g, '').trim();
    
    if (cleanStr.includes('%')) {
        const percent = parseFloat(cleanStr.replace('%', ''));
        if (!isNaN(percent)) {
            const calculated = Math.round(originalPrice * (percent / 100));
            return Math.min(calculated, originalPrice);
        }
    } else {
        const amount = parseFloat(cleanStr);
        if (!isNaN(amount)) {
            return Math.min(amount, originalPrice);
        }
    }
    
    return 0;
};

/**
 * Validates whether a given promo code exists and is live in the list of offers.
 * @param {string} code 
 * @param {Array} offers 
 * @returns {Object|null} The matching offer object, or null.
 */
export const validatePromoCode = (code, offers) => {
    if (!code || !Array.isArray(offers)) return null;
    
    const cleanCode = code.trim().toLowerCase();
    
    // Find a live offer with a matching code
    const matchingOffer = offers.find(o => 
        o.code && 
        o.code.trim().toLowerCase() === cleanCode && 
        o.status === 'Live'
    );
    
    return matchingOffer || null;
};
