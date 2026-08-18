
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// ---- CONFIG ----
const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));
const AUTHOR_ID = 'REPLACE_WITH_YOUR_UID';
const BYLINE = 'Vong Vansak';
// -----------------

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const articles = [
  {
    title: 'High-Speed Rail Project Links Major Coastal Hubs',
    category: 'World',
    excerpt: 'The new transit line cuts regional travel times by more than half.',
    readTime: '5 min',
    seed: 301,
    content: `Engineers have officially opened a state-of-the-art high-speed rail corridor linking three major coastal cities, marking one of the largest infrastructure achievements in the region this decade. Electric trains running at speeds over 300 km/h now offer a clean alternative to short-haul domestic flights.

Transportation planners expect the network to carry millions of passengers annually, taking thousands of commuter cars off congested coastal freeways. Early ticket sales have already surpassed initial projections.

Local business leaders praise the line for uniting regional labor markets and spurring economic development around mid-sized transit stations along the route.`,
  },
  {
    title: 'Central Banks Pioneer Interoperable Digital Currencies',
    category: 'Business',
    excerpt: 'Cross-border settlement pilot reduces transaction delays to mere seconds.',
    readTime: '6 min',
    seed: 302,
    content: `A consortium of central banks has concluded a successful pilot testing cross-border transactions using interconnected central bank digital currencies (CBDCs). The trial demonstrated that sovereign digital currencies can clear international trade settlements almost instantaneously while maintaining strict regulatory compliance.

Traditional cross-border wire transfers often require multiple intermediary banks, incurring high processing fees and delay windows of several business days.

Financial analysts note that while full commercial implementation remains several years off, the successful pilot proves that distributed ledger tech can streamline global commerce safely.`,
  },
  {
    title: 'Reviving Ancient Craftsmanship in Contemporary Architecture',
    category: 'Culture',
    excerpt: 'Modern builders embrace timber joinery and earth construction for sustainable design.',
    readTime: '4 min',
    seed: 303,
    content: `Architects are turning to centuries-old building techniques to tackle contemporary climate challenges. By combining ancient timber joinery, rammed earth walls, and natural passive cooling shafts with modern structural engineering, builders are creating stunning carbon-neutral structures.

These traditional techniques eliminate the need for high-carbon materials like concrete and steel while offering superior thermal insulation in extreme weather conditions.

Design schools report growing student enrollment in traditional craftsmanship workshops, signaling a broader shift toward bio-based, low-impact architectural design.`,
  },
  {
    title: 'Advances in Graphene Production Lower Hardware Costs',
    category: 'Technology',
    excerpt: 'A novel synthesis method opens doors for commercial ultra-fast electronics.',
    readTime: '5 min',
    seed: 304,
    content: `Materials scientists have discovered a low-cost chemical synthesis method capable of producing high-purity graphene sheets at scale. The ultra-thin carbon material, famed for its exceptional electrical conductivity and mechanical strength, has long been constrained by expensive manufacturing processes.

The new technique allows manufacturers to synthesize uniform graphene layers using common industrial byproducts at significantly lower temperatures.

Tech companies plan to utilize the affordable material to improve heat dissipation in microprocessors, extend battery lifespans, and construct flexible electronic displays.`,
  },
  {
    title: 'Volleyball Underdogs Clinch Dramatic Championship Victory',
    category: 'Sport',
    excerpt: 'A sudden rally in the deciding set seals an unexpected national title.',
    readTime: '4 min',
    seed: 305,
    content: `An unheralded volleyball club secured their first national title tonight, recovering from a set down in the grand final to upset the reigning champions in a nail-biting tiebreaker set.

The match featured spectacular defensive plays and relentless blocking at the net, keeping the roaring stadium crowd on edge throughout the two-hour contest. A string of aces in the fifth set broke the deadlock.

The winning coach applauded the squad's mental grit, noting that rigorous conditioning over the offseason prepared the team to perform under immense pressure.`,
  },
  {
    title: 'Breakthrough Study Links Gut Microbiome to Brain Plasticity',
    category: 'Health',
    excerpt: 'Targeted probiotic therapies show promise in managing chronic stress and anxiety.',
    readTime: '5 min',
    seed: 306,
    content: `Medical researchers have uncovered clear molecular pathways linking specific gut bacterial strains to neurochemical production in the brain. The study indicates that balanced gut flora directly influences mood regulation and cognitive resilience under stress.

Clinical trials involving targeted dietary interventions demonstrated measurable reductions in cortisol markers and improved sleep quality among participants.

Gastroenterologists and psychiatrists are increasingly collaborating to develop personalized nutrition protocols that support mental health alongside conventional therapies.`,
  },
  {
    title: 'Volcanic Island Expedition Maps Undiscovered Deep-Sea Life',
    category: 'World',
    excerpt: 'Marine biologists identify dozen new species near hydrothermal vent systems.',
    readTime: '6 min',
    seed: 307,
    content: `A deep-sea oceanographic expedition investigating volcanic trenches has discovered a diverse ecosystem surrounding previously unmapped hydrothermal vents. Robotic submersibles captured high-definition footage of unknown crustacean and jellyfish species thriving in extreme temperatures.

Scientists explain that these organism populations rely on chemosynthetic bacteria rather than sunlight to process energy, offering valuable clues about how life adapts to harsh conditions.

Environmental groups are calling for immediate marine sanctuary status across the trench zone to safeguard the unique habitat from future seabed mining exploration.`,
  },
  {
    title: 'Global Renewable Energy Jobs Reach Record Highs',
    category: 'Business',
    excerpt: 'Solar and wind expansion drives massive employment growth across manufacturing and installation.',
    readTime: '4 min',
    seed: 308,
    content: `Employment in the clean energy sector reached an all-time high this past year, according to a report published by international labor organizations. Rapid solar equipment installation and offshore wind construction accounted for the majority of new positions.

Vocational training programs are expanding worldwide to train electricians, grid technicians, and maintenance engineers needed to support the transition.

Economists emphasize that green energy investments generate significantly more localized employment opportunities per dollar spent compared to traditional fossil fuel power projects.`,
  },
  {
    title: 'Revitalizing Open-Air Cinema Culture in Rural Communities',
    category: 'Culture',
    excerpt: 'Mobile projection crews bring classic and independent films to remote towns.',
    readTime: '3 min',
    seed: 309,
    content: `A grassroots arts initiative is bringing back the magic of open-air cinema to remote towns that lack commercial movie theaters. Equipped with inflatable screens and portable solar generators, mobile projection teams host outdoor film nights in community parks.

Events draw multi-generational audiences, featuring classic cinema alongside locally produced short films and documentaries.

Organizers state the goal is to foster social cohesion and celebrate community storytelling under the stars, revitalizing rural public spaces through shared entertainment.`,
  },
  {
    title: 'Neuromorphic Microchips Replicate Brain-Style Computing',
    category: 'Technology',
    excerpt: 'Biologically-inspired processor architecture consumes a fraction of standard computing power.',
    readTime: '5 min',
    seed: 310,
    content: `Computer engineers have unveiled a novel neuromorphic processor designed to mimic the architecture of human biological neurons. Unlike traditional microchips, the design processes information in event-based spikes, drastically reducing energy consumption.

The low-power design makes these chips ideal for edge devices, autonomous drones, and wearable medical sensors that require real-time processing without draining battery life.

Industry experts believe neuromorphic hardware could resolve the surging energy demands associated with running complex AI models in modern data centers.`,
  },
  {
    title: 'Youth Gymnastics Prodigy Sets World Record on Parallel Bars',
    category: 'Sport',
    excerpt: 'Flawless execution and unmatched difficulty score earn top honors at world games.',
    readTime: '3 min',
    seed: 311,
    content: `A seventeen-year-old gymnast stunned international judges today by landing a perfect routine on the parallel bars, breaking a world score record that had held for over a decade.

The performance combined unprecedented structural difficulty with fluid transitions and a stick-flat dismount that drew a standing ovation from fellow competitors.

Coaches highlighted the athlete's extraordinary dedication, pointing out that years of disciplined technical work paved the way for this historic athletic achievement.`,
  },
  {
    title: 'Wearable Biosensors Offer Real-Time Glucose Monitoring',
    category: 'Health',
    excerpt: 'Non-invasive skin patches provide continuous health data without painful blood tests.',
    readTime: '4 min',
    seed: 312,
    content: `Biomedical engineers have developed a flexible, non-invasive skin patch capable of continuously measuring blood glucose levels through interstitial fluid. The sensor syncs wirelessly with smartphones to alert users of sudden metabolic spikes or drops.

Unlike traditional finger-prick devices or needle sensors, the patch uses micro-optical arrays to detect molecular changes painlessly throughout the day.

Clinical trials indicate high accuracy rates, promising a vastly improved quality of life for millions living with diabetes and insulin sensitivity.`,
  },
  {
    title: 'Conservation Accord Protects Critical Migratory Bird Flyways',
    category: 'World',
    excerpt: 'International coalition secures wetland habitats across three continents.',
    readTime: '5 min',
    seed: 313,
    content: `Governments across three continents have ratified a joint conservation agreement to preserve critical wetland stopover sites for migratory waterfowl and shorebirds. The agreement establishes protected zones along thousands of miles of coastal flyways.

Decades of industrial development and wetland drainage had severely fragmented these vital refueling stops, causing notable declines in migratory bird populations.

The newly protected habitats will undergo active ecological restoration, ensuring safe breeding, feeding, and wintering grounds for vulnerable avian species.`,
  },
  {
    title: 'Logistics Startups Deploy Automated Cargo Drones for Island Delivery',
    category: 'Business',
    excerpt: 'Unmanned aerial vehicles deliver medical supplies and packages across island chains.',
    readTime: '4 min',
    seed: 314,
    content: `A commercial logistics firm has launched the first regular cargo drone service connecting remote island communities to mainland distribution hubs. Autonomous heavy-lift drones now transport vital medical supplies, fresh food, and mail over water barriers in minutes.

Previously, island residents relied on sparse ferry schedules that were frequently delayed by stormy seas.

The drone service offers a fast, reliable lifeline, with company officials planning to expand fleet sizes and payload capabilities across neighboring coastal archipelagos.`,
  },
  {
    title: 'Preserving Oral Histories Through Digital Sound Archives',
    category: 'Culture',
    excerpt: 'Community historians record elders to save regional dialects and folklore.',
    readTime: '4 min',
    seed: 315,
    content: `An ambitious audio archiving project is preserving endangered oral histories by recording elders sharing regional folklore, ancestral traditions, and disappearing dialects. The high-definition audio files are indexed and made freely accessible online.

Volunteers travel to rural villages equipped with mobile recording gear, encouraging storytellers to share memories in their native tongues.

Educators plan to incorporate the digital sound archive into school curricula, ensuring future generations remain connected to their cultural heritage and linguistic roots.`,
  },
  {
    title: 'Commercial Fusion Reactor Project Achieves Plasma Stability Milestone',
    category: 'Technology',
    excerpt: 'Magnetic confinement test maintains superheated plasma for record duration.',
    readTime: '6 min',
    seed: 316,
    content: `Nuclear physicists working on a experimental fusion reactor achieved a breakthrough this week, maintaining stable superheated plasma at over 100 million degrees Celsius for a record duration.

The milestone was made possible by advanced high-temperature superconducting magnets that contain the volatile plasma inside a doughnut-shaped tokamak chamber without wall contact.

While net energy production remains the next major milestone, scientists agree that sustained magnetic control brings clean, virtually limitless fusion energy one step closer to reality.`,
  },
  {
    title: 'Community Cycling Program Reduces Urban Traffic Congestion',
    category: 'Sport',
    excerpt: 'Protected bike lanes and shared e-bike fleets transform daily city commutes.',
    readTime: '3 min',
    seed: 317,
    content: `A city-wide initiative encouraging commuter cycling has yielded impressive results, with local transit authorities reporting a marked drop in downtown car traffic during peak hours over the past year.

The program expanded protected bike lane networks and introduced subsidized e-bike sharing stations near major metro stops.

City officials point to improved air quality metrics and reduced parking stress as clear evidence that investing in active transport infrastructure pays long-term civic dividends.`,
  },
  {
    title: 'Mindfulness Training Shown to Lower Occupational Burnout',
    category: 'Health',
    excerpt: 'Structured stress-reduction programs improve focus and emotional balance in high-stress jobs.',
    readTime: '4 min',
    seed: 318,
    content: `A workplace wellness study conducted across corporate and healthcare environments reveals that structured mindfulness training significantly reduces employee fatigue and cognitive burnout.

Participants who engaged in daily ten-minute breathing exercises and guided meditation reported better focus, lower stress levels, and higher job satisfaction compared to control groups.

Organizational psychologists advocate integrating short mental rest periods into standard workday routines to safeguard mental well-being and foster sustainable productivity.`,
  },
  {
    title: 'Desalination Breakthrough Uses Solar Power to Supply Fresh Water',
    category: 'World',
    excerpt: 'Off-grid thermal desalination plants bring affordable drinking water to arid coastlines.',
    readTime: '5 min',
    seed: 319,
    content: `Engineers have successfully deployed a solar-driven desalination system capable of converting seawater into clean drinking water without relying on grid electricity or fossil fuels.

The system utilizes specialized thermal collectors to vaporize seawater, separating salt impurities through natural condensation cycles while preventing mineral scaling on system components.

The low-maintenance, off-grid design offers a sustainable freshwater solution for drought-prone coastal villages facing severe groundwater shortages.`,
  },
  {
    title: 'Next-Gen Quantum Sensors Detect Underground Mineral Resources',
    category: 'Technology',
    excerpt: 'Ultra-sensitive gravimeters map subterranean structures without invasive drilling.',
    readTime: '5 min',
    seed: 320,
    content: `Geophysicists are deploying quantum gravity sensors to map subterranean structures with unprecedented detail. By measuring minute variations in Earth's gravitational field, these ultra-sensitive devices can pinpoint underground aquifers, fault lines, and mineral deposits.

Unlike traditional seismic surveying, quantum sensing operates silently from the surface, eliminating the need for invasive explosive charges or deep exploratory drilling.

Mining and environmental monitoring companies expect quantum gravimetry to dramatically reduce ecological disruption during resource assessment and geological hazard mapping.`,
  },
];

async function seed() {
  console.log(`Seeding ${articles.length} brand new articles into Firestore...`);

  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    console.log(`[${i + 1}/${articles.length}] Creating: ${a.title}`);

    await db.collection('articles').add({
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      category: a.category,
      readTime: a.readTime,
      imageUrl: `https://picsum.photos/seed/${a.seed}/1200/800`,
      byline: BYLINE,
      authorId: AUTHOR_ID,
      createdAt: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000)
      ),
    });
  }

  console.log('Done! Refresh your site to see the seeded articles.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});