// ============================================================
// KEC CAMPUS DATA — Based on real 167-acre Kongu Engineering
// College campus, Perundurai, Erode, Tamil Nadu
// ============================================================

export const BUILDINGS = [
  // ── MAIN ENTRANCE ZONE ──────────────────────────────────
  {
    id: 'adminblock',
    name: 'Admin Block',
    position: [0, 0, -10],
    size: [30, 13, 20],
    color: '#d8e8f0',
    accentColor: '#f5d55a',
    roofColor: '#b8ccd8',
    emoji: '🏛️',
    zone: 'administration',
    info: {
      description: 'The Administrative Block of Kongu Engineering College — central hub for principal\'s office, HR, admissions, and all administrative services.',
      highlights: ['Principal\'s Office', 'Admissions & Registration', 'HR & Payroll Dept', 'Finance & Accounts Office', '"ADMINISTRATIVE BLOCK" Gold Lettering Facade', 'Wi-Fi Enabled Zones'],
      timing: '9:00 AM – 5:00 PM (Mon–Sat)',
      contact: 'admin@kec.ac.in',
    },
  },

  // ── IT PARK ──────────────────────────────────────────────
  {
    id: 'itpark',
    name: 'IT Park',
    position: [-55, 0, -25],
    size: [30, 13, 22],
    color: '#edf2f7',
    accentColor: '#4a9edd',
    roofColor: '#c8d8e8',
    emoji: '💻',
    zone: 'tech',
    info: {
      description: 'The KEC IT Park is a state-of-the-art 3-storey facility housing 50+ computer labs, the AI & ML Centre, and the Software Development Hub. Features an iconic glass pyramid on the roof.',
      highlights: ['50+ High-end Computer Labs', 'AI & Machine Learning Centre', 'Software Development Hub', 'Technology Business Incubator (TBI)', 'Glass Pyramid Rooftop', 'Research Innovation Zone'],
      timing: '8:00 AM – 6:00 PM',
      contact: 'itpark@kec.ac.in',
    },
  },

  // ── AUDITORIUM / CONVENTION CENTRE ───────────────────────
  {
    id: 'auditorium',
    name: 'Auditorium',
    position: [0, 0, -110],
    size: [60, 16, 38],
    color: '#8B7355',
    accentColor: '#c8a96e',
    roofColor: '#6b5740',
    emoji: '🎭',
    zone: 'events',
    info: {
      description: 'Kongu Convention Centre — one of the largest auditoriums in India with 4,500 seating capacity, AC halls, hosting convocations, KONGU NITE cultural festivals and national conferences.',
      highlights: ['4500 Seating Capacity', 'Air-Conditioned Hall (2,00,000 sq ft)', 'National-Level Conferences', 'Annual Convocation Ceremony', 'KONGU NITE Cultural Festival', 'Indoor Sports Zone'],
      timing: 'Event Based',
      contact: 'events@kec.ac.in',
    },
  },

  // ── LIBRARY ──────────────────────────────────────────────
  {
    id: 'library',
    name: 'C.D. Memorial Library',
    position: [55, 0, -40],
    size: [25, 10, 20],
    color: '#f0e8d8',
    accentColor: '#c8a96e',
    roofColor: '#d4c4a8',
    emoji: '📚',
    zone: 'academic',
    info: {
      description: 'C.D. Memorial Library — established 1984. A classical-style library with iconic columns, fountain courtyard, and over 1 lakh books plus extensive e-resources (IEEE, Springer, Elsevier).',
      highlights: ['1,00,000+ Physical Books', 'IEEE & Springer Digital Access', 'WebOPAC Digital Search Portal', 'Air-Conditioned Reading Hall', 'Fountain Courtyard', 'High-Security CCTV Surveillance', 'Open All 7 Days'],
      timing: '8:00 AM – 8:00 PM',
      contact: 'library@kec.ac.in',
    },
  },

  // ── BUS STAND ─────────────────────────────────────────────
  {
    id: 'busstand',
    name: 'Bus Stand',
    position: [70, 0, 60],
    size: [40, 7, 30],
    color: '#f5f0e8',
    accentColor: '#f5a623',
    roofColor: '#e8d4a0',
    emoji: '🚌',
    zone: 'transport',
    info: {
      description: 'KEC Bus Stand — home to the famous fleet of yellow Kongu buses serving 80+ routes across Erode, Coimbatore, Salem and nearby districts. GPS-tracked fleet.',
      highlights: ['80+ Bus Routes', 'Iconic Yellow Kongu Fleet', 'Connects Erode, Coimbatore, Salem', 'Morning 6:00 AM & Evening 5:30 PM', 'GPS Tracked Vehicles', 'Dedicated Women\'s Safety Bus'],
      timing: '6:00 AM – 8:00 PM',
      contact: 'transport@kec.ac.in',
    },
  },

  // ── FOOD COURT ────────────────────────────────────────────
  {
    id: 'foodcourt',
    name: 'Food Court',
    position: [30, 0, 30],
    size: [26, 11, 20],
    color: '#f0f0f5',
    accentColor: '#888aaa',
    roofColor: '#d0d0e0',
    emoji: '🍽️',
    zone: 'amenities',
    info: {
      description: 'KEC Food Court — a modern dining facility with signature curved circular entrance. Serves hot South Indian meals, snacks and refreshments for 1500+ students per session.',
      highlights: ['South Indian Meals (Veg & Non-Veg)', 'Hot Snacks & Tea/Coffee Stalls', 'Fresh Juice & Beverage Corner', 'Air-Conditioned Seating', '1500+ Capacity Dining Hall', 'Affordable Student Pricing'],
      timing: '7:30 AM – 8:30 PM',
      contact: 'foodcourt@kec.ac.in',
    },
  },

  // ── DEPARTMENT BLOCKS ─────────────────────────────────────
  {
    id: 'cse',
    name: 'CSE Block',
    position: [-55, 0, -70],
    size: [28, 12, 20],
    color: '#e8f4fd',
    accentColor: '#2980b9',
    roofColor: '#c0d8f0',
    emoji: '🖥️',
    zone: 'academic',
    info: {
      description: 'Computer Science & Engineering Department — the largest dept at KEC. Houses advanced computing labs, AI research centre and project rooms.',
      highlights: ['CSE, AI-ML, AI-DS, CS-Design Courses', 'NVIDIA GPU Research Lab', 'Coding Contest Arena', 'Software Project Lab', 'IBM Centre of Excellence'],
      timing: '8:00 AM – 5:30 PM',
      contact: 'cse@kec.ac.in',
    },
  },
  {
    id: 'ece',
    name: 'ECE Block',
    position: [-25, 0, -70],
    size: [25, 12, 20],
    color: '#fef9e7',
    accentColor: '#f39c12',
    roofColor: '#f0e0a0',
    emoji: '📡',
    zone: 'academic',
    info: {
      description: 'Electronics & Communication Engineering — cutting-edge labs for signal processing, VLSI design, embedded systems and wireless communication.',
      highlights: ['VLSI Design Lab', 'Embedded Systems Lab', 'Signal Processing Lab', 'Wireless Communication Lab', 'Antenna & RF Lab'],
      timing: '8:00 AM – 5:30 PM',
      contact: 'ece@kec.ac.in',
    },
  },
  {
    id: 'mech',
    name: 'Mechanical Block',
    position: [25, 0, -70],
    size: [25, 12, 20],
    color: '#fdfefe',
    accentColor: '#7f8c8d',
    roofColor: '#d0d8e0',
    emoji: '⚙️',
    zone: 'academic',
    info: {
      description: 'Mechanical Engineering — home to state-of-the-art workshops, CNC machines, CAD/CAM labs and the automobile engineering research area.',
      highlights: ['CNC Machining Centre', 'CAD/CAM Lab', 'Thermal & Fluid Lab', 'Automobile Workshop', '3D Printing Lab', 'Robotics & Mechatronics Lab'],
      timing: '8:00 AM – 5:30 PM',
      contact: 'mech@kec.ac.in',
    },
  },
  {
    id: 'eee',
    name: 'EEE Block',
    position: [55, 0, -70],
    size: [22, 12, 18],
    color: '#fdedec',
    accentColor: '#e74c3c',
    roofColor: '#f0c0b8',
    emoji: '⚡',
    zone: 'academic',
    info: {
      description: 'Electrical & Electronics Engineering — power systems, renewable energy labs, smart grid research and high voltage testing facilities.',
      highlights: ['Power Systems Lab', 'High Voltage Testing Lab', 'Solar Energy Research Centre', 'PLC/SCADA Lab', 'Smart Grid Lab'],
      timing: '8:00 AM – 5:30 PM',
      contact: 'eee@kec.ac.in',
    },
  },

  // ── HOSTELS ───────────────────────────────────────────────
  {
    id: 'boyshostel',
    name: "Men's Hostels",
    position: [-75, 0, 30],
    size: [35, 15, 25],
    color: '#eafaf1',
    accentColor: '#27ae60',
    roofColor: '#a8d8b8',
    emoji: '🏠',
    zone: 'residential',
    info: {
      description: 'Seven dedicated men\'s hostels on campus: Dheeran, Valluvar, Ilango, Bharathi, Kamban, Ponnar & Sankar. Fully residential facilities with Wi-Fi and mess.',
      highlights: ['7 Boys Hostels', 'Dheeran, Valluvar, Ilango, Bharathi', 'Kamban, Ponnar, Sankar Blocks', 'Wi-Fi Enabled Rooms', 'In-Campus Mess', '24/7 Security'],
      timing: 'Residential (24/7)',
      contact: 'hostel@kec.ac.in',
    },
  },
  {
    id: 'girlshostel',
    name: "Ladies' Hostels",
    position: [-75, 0, -30],
    size: [30, 13, 22],
    color: '#fdf2f8',
    accentColor: '#8e44ad',
    roofColor: '#d0a8e0',
    emoji: '🏡',
    zone: 'residential',
    info: {
      description: 'Three dedicated ladies\' hostels: Kaveri, Amaravathi and Bhavani. Secure and comfortable residential blocks with all modern amenities.',
      highlights: ['3 Ladies Hostels', 'Kaveri Ladies Hostel', 'Amaravathi Ladies Hostel', 'Bhavani Ladies Hostel', 'Women\'s Safety & Security', '24/7 Warden & CCTV'],
      timing: 'Residential (24/7)',
      contact: 'hostel@kec.ac.in',
    },
  },

  // ── SPORTS & FACILITIES ───────────────────────────────────
  {
    id: 'sportsground',
    name: 'Sports Ground',
    position: [0, 0, 75],
    size: [70, 1, 50],
    color: '#2d6a2d',
    accentColor: '#27ae60',
    roofColor: '#2d6a2d',
    emoji: '🏟️',
    zone: 'sports',
    info: {
      description: 'KEC Sports Ground — a massive open ground for cricket, football, athletics and outdoor sports. Adjacent to the indoor stadium with badminton, basketball courts.',
      highlights: ['Cricket Ground', 'Football & Athletics Field', 'Indoor Stadium (Badminton & Basketball)', 'Volleyball Court', 'KVB Bank & ATM on campus', 'Gymnasium & Fitness Centre'],
      timing: '5:30 AM – 8:00 PM',
      contact: 'sports@kec.ac.in',
    },
  },

  // ── DISPENSARY / BANK / POST OFFICE ──────────────────────
  {
    id: 'amenities',
    name: 'Amenities Block',
    position: [30, 0, -40],
    size: [18, 7, 14],
    color: '#fef9e7',
    accentColor: '#d4ac0d',
    roofColor: '#e8d4a0',
    emoji: '🏪',
    zone: 'amenities',
    info: {
      description: 'Central Amenities Block — houses the Dispensary (24/7 medical aid), KVB Bank & ATM, Post Office, and the campus stationery store.',
      highlights: ['Dispensary (24/7 Medical Aid)', 'KVB Bank & ATM', 'Post Office', 'Stationery & Xerox Shop', 'Student Help Desk'],
      timing: '8:00 AM – 6:00 PM',
      contact: 'admin@kec.ac.in',
    },
  },
];

// Campus zone colors for minimap
export const ZONE_COLORS = {
  administration: '#f5d55a',
  tech: '#4a9edd',
  events: '#8B7355',
  academic: '#3498db',
  amenities: '#f39c12',
  transport: '#F5C518',
  residential: '#27ae60',
  sports: '#2ecc71',
};

// NPC student data
export const NPC_CONFIGS = [
  { id: 'n1', name: 'Rahul', position: [-10, 0, 5], color: '#f0c8a0', shirt: '#3498db' },
  { id: 'n2', name: 'Priya', position: [12, 0, 12], color: '#d4a574', shirt: '#e74c3c' },
  { id: 'n3', name: 'Arun', position: [22, 0, -15], color: '#e8b896', shirt: '#2ecc71' },
  { id: 'n4', name: 'Kavya', position: [-18, 0, -8], color: '#c8a080', shirt: '#f39c12' },
  { id: 'n5', name: 'Vijay', position: [5, 0, -25], color: '#e0b090', shirt: '#9b59b6' },
  { id: 'n6', name: 'Deepa', position: [-28, 0, 18], color: '#d0a878', shirt: '#e67e22' },
  { id: 'n7', name: 'Karthik', position: [35, 0, 5], color: '#f0c8a0', shirt: '#e74c3c' },
  { id: 'n8', name: 'Meena', position: [-8, 0, 28], color: '#c8a080', shirt: '#2ecc71' },
  { id: 'n9', name: 'Surya', position: [18, 0, -40], color: '#e8b896', shirt: '#1abc9c' },
  { id: 'n10', name: 'Ananya', position: [-40, 0, -50], color: '#d4a574', shirt: '#e74c3c' },
];
