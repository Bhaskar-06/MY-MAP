// India-wide transit intelligence service
// Uses smart algorithms to find routes across India

const INDIA_TRANSPORT_DATA = {
  // Major cities with their transport hubs
  cities: {
    'mumbai': {
      lat: 19.0760, lng: 72.8777,
      aliases: ['bombay', 'mumbai'],
      hubs: {
        railway: 'Chhatrapati Shivaji Terminus (CST)',
        bus: 'Mumbai Central Bus Depot',
        metro: 'Versova Metro Station',
        airport: 'Chhatrapati Shivaji International Airport'
      },
      transports: ['local_train', 'metro', 'bus', 'auto', 'taxi', 'monorail']
    },
    'delhi': {
      lat: 28.6139, lng: 77.2090,
      aliases: ['new delhi', 'delhi'],
      hubs: {
        railway: 'New Delhi Railway Station',
        bus: 'ISBT Kashmiri Gate',
        metro: 'Rajiv Chowk Metro Station',
        airport: 'Indira Gandhi International Airport'
      },
      transports: ['metro', 'bus', 'auto', 'taxi', 'e-rickshaw']
    },
    'bangalore': {
      lat: 12.9716, lng: 77.5946,
      aliases: ['bengaluru', 'bangalore'],
      hubs: {
        railway: 'KSR Bengaluru City Railway Station',
        bus: 'Kempegowda Bus Station (Majestic)',
        metro: 'Majestic Metro Station',
        airport: 'Kempegowda International Airport'
      },
      transports: ['metro', 'bus', 'auto', 'taxi']
    },
    'chennai': {
      lat: 13.0827, lng: 80.2707,
      aliases: ['madras', 'chennai'],
      hubs: {
        railway: 'Chennai Central',
        bus: 'CMBT Chennai',
        metro: 'Chennai Central Metro',
        airport: 'Chennai International Airport'
      },
      transports: ['metro', 'suburban_rail', 'bus', 'auto']
    },
    'hyderabad': {
      lat: 17.3850, lng: 78.4867,
      aliases: ['hyderabad', 'secunderabad'],
      hubs: {
        railway: 'Hyderabad Deccan Station',
        bus: 'MGBS Hyderabad',
        metro: 'Ameerpet Metro Station',
        airport: 'Rajiv Gandhi International Airport'
      },
      transports: ['metro', 'bus', 'auto', 'taxi']
    },
    'mysuru': {
      lat: 12.2958, lng: 76.6394,
      aliases: ['mysore', 'mysuru'],
      hubs: {
        railway: 'Mysuru Railway Station',
        bus: 'Mysuru Central Bus Stand (KSRTC)',
        airport: 'Mysuru Airport'
      },
      transports: ['bus', 'auto', 'taxi']
    },
    'kolkata': {
      lat: 22.5726, lng: 88.3639,
      aliases: ['calcutta', 'kolkata'],
      hubs: {
        railway: 'Howrah Junction',
        bus: 'Esplanade Bus Terminus',
        metro: 'Howrah Metro Station',
        airport: 'Netaji Subhas Chandra Bose Airport'
      },
      transports: ['metro', 'tram', 'bus', 'auto', 'taxi', 'ferry']
    },
    'pune': {
      lat: 18.5204, lng: 73.8567,
      aliases: ['pune', 'poona'],
      hubs: {
        railway: 'Pune Junction',
        bus: 'Pune Swargate Bus Stand',
        airport: 'Pune International Airport'
      },
      transports: ['bus', 'auto', 'taxi']
    },
    'ahmedabad': {
      lat: 23.0225, lng: 72.5714,
      aliases: ['ahmedabad', 'amdavad'],
      hubs: {
        railway: 'Ahmedabad Junction',
        bus: 'Geeta Mandir Bus Stand',
        metro: 'Vastral Metro Station',
        airport: 'Sardar Vallabhbhai Patel Airport'
      },
      transports: ['metro', 'brt', 'bus', 'auto']
    },
    'jaipur': {
      lat: 26.9124, lng: 75.7873,
      aliases: ['jaipur', 'pink city'],
      hubs: {
        railway: 'Jaipur Junction',
        bus: 'Sindhi Camp Bus Stand',
        metro: 'Mansarovar Metro Station',
        airport: 'Jaipur International Airport'
      },
      transports: ['metro', 'bus', 'auto', 'taxi']
    }
  },

  // State bus services
  stateTransport: {
    'karnataka': {
      operator: 'KSRTC',
      helpline: '1800-425-1900',
      website: 'ksrtc.in',
      app: 'Karnataka KSRTC',
      types: ['Ordinary', 'Express', 'Volvo', 'Airavata', 'Rajahamsa']
    },
    'maharashtra': {
      operator: 'MSRTC',
      helpline: '1800-22-1250',
      website: 'msrtc.gov.in',
      app: 'Shivneri/MSRTC',
      types: ['Ordinary', 'Semi-Luxury', 'Shivshahi', 'Shivneri', 'Asiad']
    },
    'kerala': {
      operator: 'KSRTC Kerala',
      helpline: '0471-2463799',
      website: 'keralartc.com',
      types: ['Ordinary', 'Fast Passenger', 'Super Express', 'Garuda']
    },
    'tamil_nadu': {
      operator: 'TNSTC',
      helpline: '044-24794600',
      website: 'tnstc.in',
      types: ['Ordinary', 'Express', 'Ultra Deluxe', 'AC Bus']
    },
    'andhra_pradesh': {
      operator: 'APSRTC',
      helpline: '0866-2570005',
      website: 'apsrtccts.com',
      types: ['Ordinary', 'Express', 'Super Luxury', 'Garuda Plus']
    },
    'telangana': {
      operator: 'TSRTC',
      helpline: '040-69440000',
      website: 'tsrtc.telangana.gov.in',
      types: ['Ordinary', 'Express', 'Metro Express', 'Garuda']
    },
    'gujarat': {
      operator: 'GSRTC',
      helpline: '079-22850005',
      website: 'gsrtc.in',
      types: ['Ordinary', 'Express', 'Volvo']
    },
    'rajasthan': {
      operator: 'RSRTC',
      helpline: '0141-2207788',
      website: 'rsrtc.rajasthan.gov.in',
      types: ['Ordinary', 'Express', 'Silver Line', 'Gold Line']
    },
    'delhi': {
      operator: 'DTC',
      helpline: '011-23386071',
      website: 'dtc.nic.in',
      types: ['Ordinary', 'AC Bus', 'Cluster Bus']
    },
    'west_bengal': {
      operator: 'WBTC',
      helpline: '033-22485931',
      website: 'wbtc.co.in',
      types: ['Ordinary', 'AC Bus', 'Mini Bus']
    },
    'uttar_pradesh': {
      operator: 'UPSRTC',
      helpline: '0522-2631695',
      website: 'upsrtc.com',
      types: ['Ordinary', 'Express', 'Janrath', 'Shatabdi']
    },
    'madhya_pradesh': {
      operator: 'MPSRTC',
      helpline: '0755-2767012',
      website: 'mpsrtc.org',
      types: ['Ordinary', 'Express']
    },
    'punjab': {
      operator: 'PUNBUS',
      helpline: '0172-2703076',
      website: 'punbus.punjab.gov.in',
      types: ['Ordinary', 'Express', 'AC Bus']
    }
  },

  // Train booking
  railways: {
    booking: 'https://www.irctc.co.in',
    helpline: '139',
    app: 'IRCTC Rail Connect',
    classes: ['SL', '3AC', '2AC', '1AC', 'CC', '2S', 'GN'],
    types: ['Express', 'Superfast', 'Rajdhani', 'Shatabdi', 'Duronto', 'Vande Bharat', 'Local']
  },

  // Metro cities
  metros: {
    'delhi': { lines: 4, operator: 'DMRC', helpline: '155370', app: 'Delhi Metro Rail' },
    'mumbai': { lines: 3, operator: 'MMRC', helpline: '1800-22-6767', app: 'Mumbai Metro' },
    'bangalore': { lines: 2, operator: 'BMRCL', helpline: '080-22969000', app: 'Namma Metro' },
    'chennai': { lines: 2, operator: 'CMRL', helpline: '044-44444077', app: 'Chennai Metro' },
    'hyderabad': { lines: 3, operator: 'HMRL', helpline: '040-23400400', app: 'Hyderabad Metro' },
    'kolkata': { lines: 1, operator: 'KMRC', helpline: '033-22143751', app: 'Kolkata Metro' },
    'ahmedabad': { lines: 1, operator: 'MEGA', helpline: '079-27557645', app: 'Ahmedabad Metro' },
    'jaipur': { lines: 1, operator: 'JMRC', helpline: '0141-2378788', app: 'Jaipur Metro' },
    'lucknow': { lines: 1, operator: 'LMRC', helpline: '0522-4014800', app: 'Lucknow Metro' },
    'kochi': { lines: 1, operator: 'KMRL', helpline: '0484-2862700', app: 'Kochi Metro' },
    'pune': { lines: 1, operator: 'PMRDA', helpline: '020-26050000', app: 'Pune Metro' },
    'nagpur': { lines: 1, operator: 'NMRCL', helpline: '0712-6698000', app: 'Nagpur Metro' }
  },

  // Taxi/Cab services
  taxiServices: [
    { name: 'Ola', app: 'Ola', helpline: '033-66000600', types: ['Mini', 'Prime', 'Auto', 'Bike'] },
    { name: 'Uber', app: 'Uber', helpline: '000-800-919-0191', types: ['UberGo', 'UberX', 'Auto'] },
    { name: 'Rapido', app: 'Rapido', types: ['Bike', 'Auto'] },
    { name: 'InDriver', app: 'inDrive', types: ['Car', 'Auto'] },
    { name: 'Meru Cabs', app: 'Meru', helpline: '022-44224422', types: ['AC Car'] },
  ]
};

// Detect which state/region a location is in
export const detectRegion = (lat, lng) => {
  // State boundaries (approximate)
  if (lat >= 10 && lat <= 18 && lng >= 74 && lng <= 78.5) return 'karnataka';
  if (lat >= 15 && lat <= 22 && lng >= 72 && lng <= 80.5) return 'maharashtra';
  if (lat >= 8 && lat <= 12.5 && lng >= 76.5 && lng <= 80) return 'kerala';
  if (lat >= 8 && lat <= 14 && lng >= 77 && lng <= 80.5) return 'tamil_nadu';
  if (lat >= 12.5 && lat <= 19.5 && lng >= 77 && lng <= 84.5) return 'andhra_pradesh';
  if (lat >= 15.8 && lat <= 19.9 && lng >= 77.2 && lng <= 81.8) return 'telangana';
  if (lat >= 20 && lat <= 24.8 && lng >= 68 && lng <= 74.5) return 'gujarat';
  if (lat >= 23 && lat <= 30.2 && lng >= 69.5 && lng <= 78.3) return 'rajasthan';
  if (lat >= 28 && lat <= 32 && lng >= 75.5 && lng <= 77.5) return 'delhi';
  if (lat >= 21.5 && lat <= 27.5 && lng >= 83 && lng <= 87.5) return 'west_bengal';
  if (lat >= 23.5 && lat <= 30.5 && lng >= 77 && lng <= 84.5) return 'uttar_pradesh';
  if (lat >= 21 && lat <= 26.8 && lng >= 74 && lng <= 82.8) return 'madhya_pradesh';
  if (lat >= 29.5 && lat <= 32.5 && lng >= 73.9 && lng <= 76.9) return 'punjab';
  return 'india'; // Default
};

// Find nearest city
export const findNearestCity = (lat, lng) => {
  let nearest = null;
  let minDist = Infinity;

  Object.entries(INDIA_TRANSPORT_DATA.cities).forEach(([key, city]) => {
    const dist = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2));
    if (dist < minDist) {
      minDist = dist;
      nearest = { key, ...city, distance: dist * 111 }; // approx km
    }
  });

  return nearest;
};

// Generate comprehensive transit plan
export const generateTransitPlan = (origin, destination) => {
  const originRegion = detectRegion(origin.lat, origin.lng);
  const destRegion = detectRegion(destination.lat, destination.lng);
  const originCity = findNearestCity(origin.lat, origin.lng);
  const destCity = findNearestCity(destination.lat, destination.lng);

  const distKm = calculateDistanceKm(origin, destination);
  const stateTransport = INDIA_TRANSPORT_DATA.stateTransport[originRegion] ||
                         INDIA_TRANSPORT_DATA.stateTransport['india'] ||
                         { operator: 'State RTC', helpline: '139' };

  const plans = [];

  // Plan 1: Direct Bus Route
  if (distKm < 500) {
    plans.push(generateBusRoute(origin, destination, stateTransport, originCity, destCity, distKm));
  }

  // Plan 2: Train + Bus combination
  if (distKm > 50) {
    plans.push(generateTrainRoute(origin, destination, originCity, destCity, distKm, stateTransport));
  }

  // Plan 3: Multi-modal (Bus + Local transport)
  plans.push(generateMultiModalRoute(origin, destination, originCity, destCity, distKm, stateTransport, originRegion));

  // Plan 4: Cab/Taxi option
  plans.push(generateCabRoute(origin, destination, distKm));

  return plans;
};

const generateBusRoute = (origin, dest, stateTransport, originCity, destCity, distKm) => {
  const durationHours = distKm / 45; // Average bus speed 45 km/h
  const fare = Math.round(distKm * 1.2); // Approx ₹1.2 per km

  const steps = [];

  // Walk to bus stop
  steps.push({
    type: 'walk',
    icon: '🚶',
    color: '#4CAF50',
    instruction: `Walk to nearest bus stop`,
    detail: `Head towards the main road to find ${stateTransport.operator} bus stop`,
    duration: 5,
    distance: 300,
    tip: 'Look for bus stand boards or ask locals'
  });

  // Board bus
  steps.push({
    type: 'bus',
    icon: '🚌',
    color: '#9C27B0',
    instruction: `Take ${stateTransport.operator} bus towards ${destCity?.name || dest.name}`,
    detail: `Board any bus going towards ${destCity?.name || dest.name} direction`,
    operator: stateTransport.operator,
    operatorDetails: {
      name: stateTransport.operator,
      helpline: stateTransport.helpline,
      website: stateTransport.website,
      app: stateTransport.app,
      busTypes: stateTransport.types,
    },
    from: originCity?.hubs?.bus || 'Nearest Bus Stand',
    to: destCity?.hubs?.bus || `${dest.name} Bus Stand`,
    duration: Math.round(durationHours * 60),
    distance: Math.round(distKm * 1000),
    fare: { amount: fare, currency: 'INR', type: 'Ordinary Bus' },
    frequency: 'Every 30-60 minutes',
    timing: 'Usually 5 AM to 11 PM',
    stops: generateIntermediateStops(origin, dest, 3),
    bookingInfo: {
      online: stateTransport.website,
      app: stateTransport.app,
      counter: 'Available at bus stand counter',
    },
    tips: [
      `Call ${stateTransport.helpline} for exact timings`,
      'Book online on RedBus or AbhiBus for advance booking',
      'Carry exact change for ordinary buses',
      `Check ${stateTransport.website} for routes`
    ]
  });

  // Walk to destination
  steps.push({
    type: 'walk',
    icon: '🚶',
    color: '#4CAF50',
    instruction: `Walk to destination`,
    detail: 'From bus stop, walk or take auto to final destination',
    duration: 10,
    distance: 500,
  });

  return {
    id: 'bus-direct',
    mode: 'transit',
    subMode: 'bus',
    type: 'direct_bus',
    title: `🚌 Direct ${stateTransport.operator} Bus`,
    duration: Math.round(durationHours * 60) + 15,
    distance: Math.round(distKm * 1000),
    fare: fare,
    summary: `${formatDuration(Math.round(durationHours * 60) + 15)} • ₹${fare} • Direct Bus`,
    steps,
    geometry: generateRouteGeometry(origin, dest, 'road'),
    operator: stateTransport.operator,
    reliability: 'High',
    bookingRequired: false,
  };
};

const generateTrainRoute = (origin, dest, originCity, destCity, distKm, stateTransport) => {
  const trainSpeed = distKm > 300 ? 80 : 60;
  const trainDuration = Math.round((distKm / trainSpeed) * 60);
  const trainFare = Math.round(distKm * 0.5); // Approx ₹0.5 per km sleeper

  const steps = [];

  // Go to railway station
  steps.push({
    type: 'transit',
    icon: '🚌',
    color: '#9C27B0',
    instruction: `Go to ${originCity?.hubs?.railway || 'Nearest Railway Station'}`,
    detail: `Take local bus or auto to railway station`,
    duration: 20,
    distance: 3000,
    options: ['Local Bus', 'Auto Rickshaw', 'Taxi/Cab'],
    fare: { amount: 30, currency: 'INR', type: 'Auto/Bus' }
  });

  // Board train
  steps.push({
    type: 'train',
    icon: '🚂',
    color: '#F44336',
    instruction: `Take train towards ${destCity?.name || dest.name}`,
    detail: `Board express/superfast train from ${originCity?.hubs?.railway || 'Railway Station'}`,
    from: originCity?.hubs?.railway || 'Origin Railway Station',
    to: destCity?.hubs?.railway || 'Destination Railway Station',
    duration: trainDuration,
    distance: Math.round(distKm * 1000),
    fare: { amount: trainFare, currency: 'INR', type: 'Sleeper Class (SL)' },
    fareByClass: {
      'General (GN)': Math.round(trainFare * 0.7),
      'Sleeper (SL)': trainFare,
      '3rd AC (3A)': Math.round(trainFare * 2.5),
      '2nd AC (2A)': Math.round(trainFare * 3.5),
      '1st AC (1A)': Math.round(trainFare * 5),
    },
    bookingInfo: {
      online: 'https://www.irctc.co.in',
      app: 'IRCTC Rail Connect',
      counter: 'Railway Station Booking Counter',
      helpline: '139',
    },
    trainTypes: ['Express', 'Superfast', 'Rajdhani (premium)', 'Shatabdi (day)'],
    tips: [
      'Book on IRCTC app 120 days in advance',
      'Check train availability on RailYatri or ConfirmTkt',
      'Tatkal booking opens 1 day before',
      'Call 139 for train enquiry (free)'
    ],
    importantInfo: 'Carry valid ID proof for travel'
  });

  // Last mile connectivity
  steps.push({
    type: 'local',
    icon: '🛺',
    color: '#FF9800',
    instruction: `Local transport to destination`,
    detail: `From ${destCity?.hubs?.railway || 'Station'}, take auto/bus to destination`,
    duration: 20,
    distance: 5000,
    options: [
      { type: 'Auto Rickshaw', fare: '₹50-150', icon: '🛺' },
      { type: 'Local Bus', fare: '₹10-30', icon: '🚌' },
      { type: 'Shared Jeep/Tempo', fare: '₹20-50', icon: '🚐' },
      { type: 'Taxi/Cab', fare: '₹100-300', icon: '🚕' },
    ]
  });

  return {
    id: 'train-route',
    mode: 'transit',
    subMode: 'train',
    type: 'train',
    title: '🚂 Train Route',
    duration: trainDuration + 45,
    distance: Math.round(distKm * 1000),
    fare: trainFare + 80,
    summary: `${formatDuration(trainDuration + 45)} • ₹${trainFare + 80}+ • Train`,
    steps,
    geometry: generateRouteGeometry(origin, dest, 'rail'),
    operator: 'Indian Railways',
    reliability: 'Very High',
    bookingRequired: true,
  };
};

const generateMultiModalRoute = (origin, dest, originCity, destCity, distKm, stateTransport, region) => {
  const steps = [];
  const metro = INDIA_TRANSPORT_DATA.metros;

  // Check if metro available in origin city
  const hasMetro = originCity && metro[originCity.key];
  const hasDestMetro = destCity && metro[destCity.key];

  if (hasMetro) {
    steps.push({
      type: 'metro',
      icon: '🚇',
      color: '#2196F3',
      instruction: `Take ${metro[originCity.key].operator} Metro`,
      detail: `Board metro towards city center from ${originCity.hubs?.metro}`,
      operator: metro[originCity.key].operator,
      helpline: metro[originCity.key].helpline,
      app: metro[originCity.key].app,
      duration: 20,
      fare: { amount: 30, currency: 'INR', type: 'Metro Card/Token' },
      tip: 'Use metro smart card for 10% discount'
    });
  } else {
    steps.push({
      type: 'bus',
      icon: '🚌',
      color: '#9C27B0',
      instruction: `Take city bus to main bus stand`,
      detail: `Board ${stateTransport.operator} bus from nearby stop`,
      operator: stateTransport.operator,
      duration: 25,
      fare: { amount: 20, currency: 'INR', type: 'City Bus' },
    });
  }

  // Long distance bus
  steps.push({
    type: 'bus',
    icon: '🚌',
    color: '#7B1FA2',
    instruction: `Take ${stateTransport.operator} bus to ${destCity?.name || dest.name}`,
    detail: `Board from ${originCity?.hubs?.bus || 'Main Bus Stand'}`,
    operator: stateTransport.operator,
    from: originCity?.hubs?.bus || 'Main Bus Stand',
    to: destCity?.hubs?.bus || `${dest.name} Bus Stand`,
    duration: Math.round((distKm / 45) * 60),
    fare: { amount: Math.round(distKm * 1.2), currency: 'INR', type: 'Bus Ticket' },
    frequency: 'Every 1-2 hours',
    bookingInfo: {
      app: 'RedBus / AbhiBus',
      online: 'redbus.in',
      counter: 'Bus Stand Counter',
    },
    operatorDetails: {
      name: stateTransport.operator,
      helpline: stateTransport.helpline,
      website: stateTransport.website,
    },
  });

  // Final auto/local transport
  steps.push({
    type: 'auto',
    icon: '🛺',
    color: '#FF9800',
    instruction: 'Take auto/local transport to destination',
    detail: 'Available outside bus stand',
    duration: 15,
    fare: { amount: 50, currency: 'INR', type: 'Auto Rickshaw' },
    alternatives: [
      { mode: 'Shared Jeep', fare: '₹20-50' },
      { mode: 'Local Bus', fare: '₹10-20' },
      { mode: 'Ola/Uber Auto', fare: '₹40-80' },
    ]
  });

  const totalDuration = steps.reduce((sum, s) => sum + (s.duration || 0), 0);
  const totalFare = steps.reduce((sum, s) => sum + (s.fare?.amount || 0), 0);

  return {
    id: 'multimodal',
    mode: 'transit',
    subMode: 'multimodal',
    type: 'multi_modal',
    title: '🗺️ Multi-Modal Route',
    duration: totalDuration + 20,
    distance: Math.round(distKm * 1000),
    fare: totalFare,
    summary: `${formatDuration(totalDuration + 20)} • ₹${totalFare}+ • Multiple Transport`,
    steps,
    geometry: generateRouteGeometry(origin, dest, 'mixed'),
    reliability: 'Medium',
    bookingRequired: false,
    note: 'Combines best available transport options'
  };
};

const generateCabRoute = (origin, dest, distKm) => {
  const duration = Math.round((distKm / 55) * 60);
  const olaFare = Math.round(distKm * 12);
  const uberFare = Math.round(distKm * 13);

  return {
    id: 'cab',
    mode: 'cab',
    subMode: 'taxi',
    type: 'cab',
    title: '🚕 Cab/Taxi',
    duration,
    distance: Math.round(distKm * 1000),
    fare: olaFare,
    summary: `${formatDuration(duration)} • ₹${olaFare}-${uberFare} • Cab`,
    steps: [
      {
        type: 'cab',
        icon: '🚕',
        color: '#FFC107',
        instruction: 'Book cab from your location',
        detail: 'Door-to-door service, most convenient',
        duration,
        distance: Math.round(distKm * 1000),
        providers: [
          { name: 'Ola', fare: `₹${olaFare}`, app: 'Ola', icon: '🟡', helpline: '033-66000600' },
          { name: 'Uber', fare: `₹${uberFare}`, app: 'Uber', icon: '⬛', helpline: '000-800-919-0191' },
          { name: 'Rapido', fare: `₹${Math.round(distKm * 8)} (Bike)`, app: 'Rapido', icon: '🟠' },
          { name: 'InDrive', fare: `₹${Math.round(distKm * 10)}`, app: 'inDrive', icon: '🟢' },
        ],
        tips: [
          'Compare fares on all apps before booking',
          'Rapido bike taxi cheaper for short distances',
          'Outstation cab available for long distances',
          'Share cab with Ola Share/Uber Pool to save'
        ]
      }
    ],
    geometry: generateRouteGeometry(origin, dest, 'road'),
    reliability: 'Very High',
    bookingRequired: true,
  };
};

// Helper functions
const generateIntermediateStops = (origin, dest, count) => {
  const stops = [];
  for (let i = 1; i <= count; i++) {
    const fraction = i / (count + 1);
    stops.push({
      lat: origin.lat + (dest.lat - origin.lat) * fraction,
      lng: origin.lng + (dest.lng - origin.lng) * fraction,
      name: `Stop ${i}`,
    });
  }
  return stops;
};

const generateRouteGeometry = (origin, dest, type) => {
  const points = [[origin.lat, origin.lng]];

  if (type === 'road') {
    const midLat = (origin.lat + dest.lat) / 2 + (Math.random() - 0.5) * 0.1;
    const midLng = (origin.lng + dest.lng) / 2 + (Math.random() - 0.5) * 0.1;
    points.push([midLat, midLng]);
  } else if (type === 'rail') {
    const via1Lat = origin.lat + (dest.lat - origin.lat) * 0.33;
    const via1Lng = origin.lng + (dest.lng - origin.lng) * 0.33;
    const via2Lat = origin.lat + (dest.lat - origin.lat) * 0.66;
    const via2Lng = origin.lng + (dest.lng - origin.lng) * 0.66;
    points.push([via1Lat, via1Lng]);
    points.push([via2Lat, via2Lng]);
  }

  points.push([dest.lat, dest.lng]);
  return points;
};

export const calculateDistanceKm = (p1, p2) => {
  const R = 6371;
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLng = (p2.lng - p1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(p1.lat * Math.PI / 180) *
            Math.cos(p2.lat * Math.PI / 180) *
            Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
};

export { INDIA_TRANSPORT_DATA };