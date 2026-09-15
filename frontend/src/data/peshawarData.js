// src/data/peshawarData.js
// Static datasets for Peshawar-specific dropdowns across the app.
// Kept in one file so Phase 3 refinements (adding more areas/stations/hospitals)
// only need to happen here, not scattered across components.

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Must stay in sync with backend/models/User.js PESHAWAR_AREAS list
export const PESHAWAR_AREAS = [
  'Hayatabad',
  'University Road',
  'Saddar',
  'Gulberg',
  'Tehkal',
  'Chamkani',
  'Warsak Road',
  'Pajjagi Road',
  'Faqirabad',
  'Board Bazaar',
  'Regi Model Town',
  'Charsadda Road',
  'Ring Road',
  'Danishabad',
  'Karkhano Market'
];

// Zu Peshawar BRT stations - used for meetup point selection
export const BRT_STATIONS = [
  'Chamkani',
  'Karkhano Market',
  'Tehkal',
  'University of Peshawar',
  'Malik Saad Shaheed',
  'Bacha Khan Chowk',
  'Firdous',
  'Board Bazaar',
  'Hayatabad'
];

// Must stay in sync with backend/models/EmergencyRequest.js HOSPITALS list
export const HOSPITALS = [
  'Lady Reading Hospital (LRH)',
  'Khyber Teaching Hospital (KTH)',
  'Hayatabad Medical Complex (HMC)',
  'Rehman Medical Institute (RMI)',
  'Northwest General Hospital',
  'Other'
];

export const URGENCY_LEVELS = ['Critical', 'High', 'Moderate'];
