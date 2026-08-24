export const ROLES = {
  DIRECTOR: {
    id: 'director',
    name: 'Executive Board',
    subtitle: 'Group Oversight & Financial Governance',
    badge: 'Board of Directors',
    avatar: 'BD',
    color: 'from-amber-600 to-gold-500'
  },
  MANAGER: {
    id: 'manager',
    name: 'Rajiv Kapoor',
    subtitle: 'VP Sales & Branch Operations',
    badge: 'Branch Manager',
    avatar: 'RK',
    color: 'from-sky-600 to-blue-700'
  },
  AGENT: {
    id: 'agent',
    name: 'Vikram Mehta',
    subtitle: 'Senior Luxury Specialist',
    badge: 'Sales Agent',
    avatar: 'VM',
    color: 'from-emerald-600 to-teal-700'
  }
};

export const DEMO_USERS = [
  {
    id: 'usr_director',
    email: 'board@meridianestates.com',
    password: 'password123',
    name: 'Executive Board',
    role: 'director',
    title: 'Group Managing Director',
    branch: 'Chennai Corporate HQ',
    avatar: 'BD',
    phone: '+91 44 2800 1000',
    badge: 'C-Suite Executive'
  },
  {
    id: 'usr_manager',
    email: 'rajiv.kapoor@meridianestates.com',
    password: 'password123',
    name: 'Rajiv Kapoor',
    role: 'manager',
    title: 'VP Sales & Operations',
    branch: 'Adyar Regional Hub',
    avatar: 'RK',
    phone: '+91 98400 12345',
    badge: 'Branch Leadership'
  },
  {
    id: 'usr_agent',
    email: 'vikram.mehta@meridianestates.com',
    password: 'password123',
    name: 'Vikram Mehta',
    role: 'agent',
    title: 'Senior Luxury Advisor',
    branch: 'Besant Nagar Office',
    avatar: 'VM',
    phone: '+91 98400 98765',
    badge: 'Prime Residential'
  }
];

export const PEOPLE = {
  RK: { name: 'Rajiv Kapoor', role: 'VP Sales & Branch Mgr', branch: 'Adyar HQ', booked: 38500000, target: 45000000 },
  VM: { name: 'Vikram Mehta', role: 'Senior Luxury Advisor', branch: 'Besant Nagar', booked: 19800000, target: 22000000 },
  AP: { name: 'Ananya Pillai', role: 'Residential Consultant', branch: 'Anna Nagar', booked: 14200000, target: 18000000 },
  SK: { name: 'Siddharth Kumar', role: 'Commercial Specialist', branch: 'OMR Corridor', booked: 21500000, target: 20000000 },
  RD: { name: 'Divya Ramesh', role: 'Villa Portfolio Lead', branch: 'ECR Coast', booked: 8900000, target: 15000000 }
};

export const STAGES = [
  { id: 'new', label: 'New Lead', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { id: 'contacted', label: 'Contacted', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'site_visit', label: 'Site Visit Booked', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'nego', label: 'In Negotiation', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'won', label: 'Deal Won / Closed', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { id: 'lost', label: 'Closed Lost', color: 'bg-rose-50 text-rose-700 border-rose-200' }
];

export const LOCALITIES = [
  'Besant Nagar',
  'Adyar',
  'Boat Club',
  'OMR Tech Corridor',
  'Anna Nagar',
  'ECR Promenade'
];

export const INITIAL_PROPERTIES = [
  {
    id: 'PROP-101',
    title: 'The Bay Residences #4A',
    loc: 'Besant Nagar',
    price: 24500000, // ₹2.45 Cr
    type: 'Apartment',
    bhk: 3,
    sqft: 2250,
    facing: 'East',
    status: 'Available',
    days: 14,
    agent: 'VM',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    desc: 'Sea-facing luxury 3BHK with double-height balcony and private elevator access.'
  },
  {
    id: 'PROP-102',
    title: 'Boulevard Estate Plot 12',
    loc: 'ECR Promenade',
    price: 38000000, // ₹3.8 Cr
    type: 'Villa',
    bhk: 4,
    sqft: 4100,
    facing: 'North',
    status: 'Available',
    days: 8,
    agent: 'RD',
    img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    desc: 'Custom contemporary beach villa with private pool, solar grid, and landscaped lawn.'
  },
  {
    id: 'PROP-103',
    title: 'Meridian Tower Penthouse B',
    loc: 'Adyar',
    price: 49000000, // ₹4.9 Cr
    type: 'Apartment',
    bhk: 4,
    sqft: 3800,
    facing: 'North-East',
    status: 'Reserved',
    days: 22,
    agent: 'VM',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    desc: 'Crown penthouse overlooking the Adyar River estuary with 360-degree panorama.'
  },
  {
    id: 'PROP-104',
    title: 'Cyber IT Park Floor 6',
    loc: 'OMR Tech Corridor',
    price: 18500000, // ₹1.85 Cr
    type: 'Commercial',
    bhk: 0,
    sqft: 1800,
    facing: 'East',
    status: 'Available',
    days: 30,
    agent: 'SK',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    desc: 'Grade-A office space with 100% power backup and 18 dedicated car parking bays.'
  },
  {
    id: 'PROP-105',
    title: 'Royal Enclave Luxury Villa 8',
    loc: 'Boat Club',
    price: 85000000, // ₹8.5 Cr
    type: 'Villa',
    bhk: 5,
    sqft: 5600,
    facing: 'East',
    status: 'Available',
    days: 5,
    agent: 'RK',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    desc: 'Ultra-exclusive sanctuary in Chennai’s most coveted neighborhood with private security.'
  },
  {
    id: 'PROP-106',
    title: 'Shanthi Heights #902',
    loc: 'Anna Nagar',
    price: 16500000, // ₹1.65 Cr
    type: 'Apartment',
    bhk: 2,
    sqft: 1420,
    facing: 'South-East',
    status: 'Sold',
    days: 45,
    agent: 'AP',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    desc: 'Fully furnished model unit right next to Tower Park with modular Italian kitchen.'
  }
];

export const INITIAL_LEADS = [
  {
    id: 'L-1041',
    name: 'Dr. K. Swaminathan',
    phone: '+91 98401 22311',
    budget: 25000000, // ₹2.5 Cr
    loc: 'Besant Nagar',
    bhk: 3,
    temp: 'hot',
    stage: 'nego',
    source: 'Referral',
    agent: 'VM',
    next: 'Awaiting 3% discount sign-off from VP',
    log: [
      { t: 'Site visit completed with family. Loved #4A balcony view.', w: 'Yesterday' },
      { t: 'Offered ₹2.38 Cr against ₹2.45 Cr list price.', w: '2 days ago' },
      { t: 'Initial call made by Vikram Mehta.', w: '5 days ago' }
    ]
  },
  {
    id: 'L-1042',
    name: 'Priya & Rahul Sundaram',
    phone: '+91 97909 88120',
    budget: 39000000, // ₹3.9 Cr
    loc: 'ECR Promenade',
    bhk: 4,
    temp: 'hot',
    stage: 'site_visit',
    source: 'Instagram Ad',
    agent: 'RD',
    next: 'Site visit scheduled for Sunday 4:00 PM',
    log: [
      { t: 'Confirmed beach villa viewing schedule.', w: '3 hours ago' },
      { t: 'Sent video walkthrough of Boulevard Estate Plot 12.', w: '1 day ago' }
    ]
  },
  {
    id: 'L-1043',
    name: 'Vertex Software Pvt Ltd',
    phone: '+91 94440 11928',
    budget: 20000000, // ₹2.0 Cr
    loc: 'OMR Tech Corridor',
    bhk: 0,
    temp: 'warm',
    stage: 'contacted',
    source: '99acres',
    agent: 'SK',
    next: 'Share floorplan and lease terms document',
    log: [
      { t: 'Spoke with CFO regarding 1800 sqft tech space requirement.', w: '1 day ago' }
    ]
  },
  {
    id: 'L-1044',
    name: 'Gautam Adani (NRI Account)',
    phone: '+1 408 555 0192',
    budget: 85000000, // ₹8.5 Cr
    loc: 'Boat Club',
    bhk: 5,
    temp: 'hot',
    stage: 'site_visit',
    source: 'Website Walk-in',
    agent: 'VM',
    next: 'Virtual 3D viewing scheduled for Monday',
    log: [
      { t: 'Requested legal title verification docs for Boat Club Villa.', w: 'Yesterday' }
    ]
  },
  {
    id: 'L-1045',
    name: 'Meenakshi Sundaram',
    phone: '+91 98840 99312',
    budget: 17000000, // ₹1.7 Cr
    loc: 'Anna Nagar',
    bhk: 2,
    temp: 'hot',
    stage: 'won',
    source: 'Walk-in',
    agent: 'AP',
    next: 'Booking agreement signed. Registration on Friday.',
    log: [
      { t: 'Advance token amount of ₹10 Lakhs received.', w: '3 days ago' },
      { t: 'Deal closed for Shanthi Heights #902.', w: '4 days ago' }
    ]
  },
  {
    id: 'L-1046',
    name: 'Karthik Subramanian',
    phone: '+91 99620 44510',
    budget: 22000000, // ₹2.2 Cr
    loc: 'Adyar',
    bhk: 3,
    temp: 'warm',
    stage: 'new',
    source: 'Website',
    agent: '', // Unassigned web enquiry
    next: 'Requires manager assignment',
    log: [
      { t: 'Enquiry submitted via Meridian website for Adyar 3BHK.', w: '20 mins ago' }
    ]
  }
];

export const INITIAL_APPROVALS = [
  {
    id: 'AP-101',
    leadId: 'L-1041',
    propId: 'PROP-101',
    agent: 'VM',
    list: 24500000,
    offer: 23800000,
    discountPct: 2.8,
    status: 'pending',
    note: 'Buyer ready to pay 50% down payment within 7 days if approved.',
    w: '2 hours ago'
  }
];

export const INITIAL_TASKS = [
  { id: 1, agent: 'VM', t: 'Follow up with Dr. Swaminathan on offer letter', s: 'L-1041 · In Negotiation', when: 'Today', done: false },
  { id: 2, agent: 'VM', t: 'Send title deed copies to NRI Gautam Adani', s: 'L-1044 · Boat Club Villa', when: 'Today', done: false },
  { id: 3, agent: 'RD', t: 'Confirm driver & keys for ECR Beach Villa viewing', s: 'L-1042 · ECR Promenade', when: 'Today', done: true },
  { id: 4, agent: 'AP', t: 'Collect KYC documents from Meenakshi for registration', s: 'L-1045 · Deal Won', when: 'Tomorrow', done: false }
];

export const INITIAL_VISITS = [
  { id: 101, time: '11:00 AM', agent: 'VM', who: 'Dr. Swaminathan', where: 'The Bay Residences #4A (Besant Nagar)', phone: '+91 98401 22311' },
  { id: 102, time: '04:00 PM', agent: 'RD', who: 'Priya & Rahul', where: 'Boulevard Estate Plot 12 (ECR)', phone: '+91 97909 88120' },
  { id: 103, time: '06:30 PM', agent: 'SK', who: 'Vertex Software CFO', where: 'Cyber IT Park Floor 6 (OMR)', phone: '+91 94440 11928' }
];

export const FINANCIAL_METRICS = {
  monthlyTarget: 120000000, // ₹12.0 Cr
  monthlyAchieved: 94000000, // ₹9.4 Cr
  pipelineValue: 248000000, // ₹24.8 Cr
  activeInventoryValue: 231500000, // ₹23.15 Cr
  avgTicketSize: 28500000, // ₹2.85 Cr
  conversionRate: 28.4, // %
  revenueTrend: [
    { month: 'Apr', target: 80, actual: 78, forecast: 82 },
    { month: 'May', target: 85, actual: 89, forecast: 90 },
    { month: 'Jun', target: 90, actual: 86, forecast: 92 },
    { month: 'Jul', target: 100, actual: 104, forecast: 108 },
    { month: 'Aug', target: 120, actual: 94, forecast: 122 },
    { month: 'Sep', target: 130, actual: 0, forecast: 135 }
  ]
};
