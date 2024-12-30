const adjectives = [
  'Royal',
  'Throne',
  'Porcelain',
  'Golden',
  'Majestic',
  'Sacred',
  'Secret',
  'Emergency',
  'Blessed',
  'Pristine',
  'Urgent',
  'Mystical',
  'Legendary',
  'Epic',
  'Glorious'
];

const nouns = [
  'Throne',
  'Dump Station',
  'Relief Center',
  'Pit Stop',
  'Rest Room',
  'Comfort Station',
  'Powder Room',
  'Business Office',
  'Meditation Chamber',
  'Command Center',
  'Loading Dock',
  'Download Zone',
  'Data Center',
  'Meeting Room',
  'Think Tank'
];

const puns = [
  'Flush Hour',
  'Game of Thrones',
  'Poop Deck',
  'Toilet of Terror',
  'The Oval Orifice',
  'Mission: Possible',
  'The Porcelain Palace',
  'The Royal Flush',
  'Dumping Grounds',
  'The Thinker\'s Spot',
  'The Daily Download',
  'Code Brown HQ',
  'The Squatting Spot',
  'Number Two\'s Company',
  'The Oval Office'
];

export const generateToiletName = () => {
  const nameType = Math.floor(Math.random() * 3);
  
  switch (nameType) {
    case 0:
      // Generate "Adjective Noun" combination
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      return `${adj} ${noun}`;
    
    case 1:
      // Use a pre-made pun
      return puns[Math.floor(Math.random() * puns.length)];
    
    case 2:
      // Generate "The Something" format
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
      return `The ${randomNoun}`;
    
    default:
      return 'The Porcelain Throne';
  }
}; 