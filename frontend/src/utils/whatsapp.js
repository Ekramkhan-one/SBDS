// src/utils/whatsapp.js
// Builds a pre-filled WhatsApp click-to-chat URL for contacting a donor.
// Format required by WhatsApp: https://wa.me/<countrycode+number>?text=<encoded message>

export function buildWhatsAppLink(phoneNumber, donorName) {
  // Pakistani numbers are stored as 03XXXXXXXXX; WhatsApp needs country code
  // without the leading 0, e.g. 03001234567 -> 923001234567
  const internationalNumber = '92' + phoneNumber.slice(1);

  const message = `Hello ${donorName}, I found your profile on the Smart Blood Donation System. Is blood available for donation?`;

  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(message)}`;
}
