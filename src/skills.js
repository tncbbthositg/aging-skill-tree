// Content is independent of rendering. Parents describe the visual branches;
// age alone determines unlocks, so adding a joke never changes existing rules.
const skill = (id, age, name, description, icon, parents = [], type = 'Passive') =>
  ({ id, age, name, description, icon, parents, type });
export const trees = [
  { id: 'structure', name: 'Structural Integrity', subtitle: 'Your body is now a percussion instrument.', color: '#b8d888', icon: 'bone', skills: [
    skill('mystery',30,'Mystery Damage','Wake up sore from an activity you do not remember performing.','bone'),
    skill('floor',33,'Floor Recovery','Standing up from the floor now requires a brief loading animation.','stairs',['mystery']),
    skill('sneeze',36,'Sneezing Hazard','Sneezing has a small chance to inflict Lower Back Injury.','bolt',['mystery']),
    skill('joints',40,'Ambient Joint Noise','Movement generates unsolicited clicks and pops. You are your own sound effects department.','sound',['floor','sneeze']),
    skill('sleep-injury',43,'Sleep Injury','Long Rest may inflict Neck, Shoulder, or Back Damage. Prerequisite: own a pillow you used to trust.','moon',['joints']),
    skill('stairs',45,'Creaking Louder Than the Stairs','Joint audio volume increased 100%. The staircase would like you to keep it down.','stairs',['joints']),
    skill('weather',50,'Weather Detection','Knees predict incoming precipitation with moderate accuracy and considerable complaining.','cloud',['sleep-injury','stairs']),
    skill('socks',55,'Defensive Socks','Putting on socks becomes a balance challenge. Nearby furniture gains Support Class.','shield',['weather'])
  ]},
  { id: 'sensors', name: 'Sensor Calibration', subtitle: 'Same sensors. Revised operating specifications.', color: '#eac674', icon: 'eye', skills: [
    skill('focus',32,'Manual Focus','Move small text back and forth until autofocus succeeds. Arms sold separately.','eye'),
    skill('low-light',36,'Low-Light Nerf','Reading ability reduced 60% in restaurants with “atmosphere.”','moon',['focus']),
    skill('contrast',39,'Contrast Enhancement Required','Gray text on slightly different gray becomes an unsolvable puzzle.','eye',['focus']),
    skill('audio',41,'Audio Filtering Reduced','Understanding speech becomes harder when literally anyone else is talking.','sound',['low-light','contrast']),
    skill('thermostat',42,'Thermostat Awareness','Detect a 1°F deviation from anywhere in the house. Gain +20 Irritation if someone touched it.','thermometer',['audio']),
    skill('flashlight',43,'Phone Flashlight Expertise','Illuminate menus, thermostats, and serial numbers with the confidence of a search party.','bolt',['low-light']),
    skill('reading',45,'Reading Distance −30%','Near-focus range reduced. Arm extension automatically compensates.','eye',['flashlight']),
    skill('utility',46,'Utility Bill Clairvoyance','Every open exterior door causes psychic damage. Who touched the thermostat?','thermometer',['thermostat']),
    skill('outside',48,'We’re Not Heating the Outside','Automatically say this when a door remains open for more than eight seconds.','thermometer',['utility']),
    skill('what',50,'Preemptive “What?”','Say “what?” 0.7 seconds before processing the sentence you actually heard.','sound',['reading']),
    skill('hvac',53,'HVAC Optimization','Develop deeply held opinions about ceiling-fan direction. Nobody asked.','cloud',['outside']),
    skill('scaling',55,'UI Scaling','Default font size is now considered a personal attack.','eye',['what']),
    skill('lights',60,'Peak Dad Efficiency','Turn off lights in rooms you are not occupying. Includes rooms other people ARE occupying.','bolt',['hvac'])
  ]},
  { id: 'recovery', name: 'Recovery & Maintenance', subtitle: 'Please consult your increasingly long manual.', color: '#d8a8ec', icon: 'moon', skills: [
    skill('hangover',30,'Extended Hangover','Alcohol debuffs persist substantially longer than the alcohol itself.','moon'),
    skill('cooldown',34,'Recovery Cooldown +50%','Physical activities continue to be felt several business days later.','shield',['hangover']),
    skill('late',38,'Late-Night Event Penalty','Invitations beginning after 9 PM inflict anticipatory fatigue.','moon',['hangover']),
    skill('bathroom',40,'Nocturnal Bathroom Quest I','Long Rest interrupted by one mandatory bathroom side quest. Fast travel unavailable.','drop',['cooldown','late']),
    skill('vacation',43,'Vacation Recovery Debt','Return from vacation less rested than when you left. Request a recovery vacation.','cloud',['bathroom']),
    skill('nap',45,'Midday Maintenance Window','Nap ability unlocked. Restore 25% Energy. Using after 3 PM may apply Insomnia. Daytime shutdown is now socially defensible.','moon',['bathroom'],'Active ability'),
    skill('bathroom-2',50,'Nocturnal Bathroom Quest II','Bathroom side quest frequency increased. You already know the route in the dark.','drop',['vacation','nap']),
    skill('couch',55,'Couch Shutdown','Sitting quietly after dinner may initiate an involuntary Long Rest. Television remains on.','moon',['bathroom-2'])
  ]}
];
export const allSkills = trees.flatMap(tree => tree.skills);
export const legendaryIds = ['thermostat','stairs','nap'];
export function parseAge(value) {
  if (value == null || String(value).trim() === '') return 45;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(20, Math.min(80, Math.round(number))) : 45;
}
export const unlockedSkills = age => allSkills.filter(skill => age >= skill.age);
export const hasLegendary = age => legendaryIds.every(id => age >= allSkills.find(skill => skill.id === id).age);
