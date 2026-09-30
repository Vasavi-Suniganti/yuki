export interface KnowledgeCheckpoint {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface SimplifiedPaper {
  title: string;
  originalDoi: string;
  publishedJournal: string;
  year: number;
  takeawaySummary: string;
  keyFindings: string[];
  simplifiedMethods: string;
}

export interface AnimatedProcessStep {
  step: number;
  label: string;
  details: string;
  visualTag: string;
}

export interface AnimatedProcess {
  title: string;
  description: string;
  steps: AnimatedProcessStep[];
}

export interface ModuleChapter {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  content: string;
  keyConcepts: string[];
  diagramType?: 'ice-core-stratigraphy' | 'sea-ice-salinity' | 'thermohaline-conveyor' | 'glacier-mass-balance' | 'albedo-effect';
  interactiveWidgetType?: 'bubble-extractor' | 'brine-calculator' | 'density-column' | 'calving-simulator';
  checkpoints: KnowledgeCheckpoint[];
}

export interface RelatedResearchEntities {
  expeditionId?: string;
  scientistId?: string;
  reportId?: string;
  datasetId?: string;
  publicationId?: string;
}

export interface LearningModule {
  id: string;
  topicId: string;
  topicTitle: string;
  title: string;
  kicker: string;
  subtitle: string;
  category: string;
  timeToComplete: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  coverImage: string;
  chapters: ModuleChapter[];
  animatedProcess: AnimatedProcess;
  simplifiedPaper: SimplifiedPaper;
  relatedResearch: RelatedResearchEntities;
}

export interface QuestionBankItem {
  id: string;
  topicId: string;
  topicTitle: string;
  question: string;
  type: 'single_choice' | 'multi_select' | 'true_false' | 'scenario_reasoning';
  options: string[];
  correctAnswers: number[]; // Array of correct option indices
  explanation: string;
  hint: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl?: string;
}

export const learningTopics = [
  {
    id: 'climate-environment',
    title: 'Climate & Environment',
    iconName: 'Sun',
    description: 'Global warming drivers, greenhouse gas records trapped in ice, and polar-monsoon teleconnections.',
    badge: 'Climate Science',
  },
  {
    id: 'cryosphere',
    title: 'Cryosphere Physics',
    iconName: 'Sliders',
    description: 'Ice sheet thermodynamics, sea ice brine rejection, glacier mass balance, and subglacial lakes.',
    badge: 'Glaciology',
  },
  {
    id: 'ocean-science',
    title: 'Ocean Science & Currents',
    iconName: 'Waves',
    description: 'Southern Ocean hydrography, thermohaline circulation, intermediate water mass formation, and carbon sinks.',
    badge: 'Oceanography',
  },
  {
    id: 'polar-life',
    title: 'Polar Life & Biodiversity',
    iconName: 'Sparkles',
    description: 'Antarctic krill ecology, fast-ice microbial communities, extremophiles, and penguin foraging dynamics.',
    badge: 'Biology',
  },
  {
    id: 'polar-technology',
    title: 'Polar Technology & Bases',
    iconName: 'Database',
    description: 'Bharati & Maitri station architecture, ice drills, LiDAR sensors, satellite altimetry, and cleanrooms.',
    badge: 'Engineering',
  },
  {
    id: 'indian-polar-research',
    title: 'Indian Polar Research Program',
    iconName: 'Globe2',
    description: 'India’s polar expeditions history, Himadri Arctic base, Himansh Himalayan station, and NCPOR leadership.',
    badge: 'National Program',
  },
];

export const learningModules: LearningModule[] = [
  {
    id: 'ice-core-past-climate',
    topicId: 'climate-environment',
    topicTitle: 'Climate & Environment',
    title: "How an Ice Core Reveals Earth's Past Climate",
    kicker: 'Paleoclimatology Deep Dive',
    subtitle: 'Extracting ancient air bubbles and temperature proxies from 120-meter deep Antarctic plateau ice cores.',
    category: 'Climate & Environment',
    timeToComplete: '25 min',
    level: 'Intermediate',
    coverImage: 'https://images.unsplash.com/photo-1517783999520-f068d7431a60?w=1200&auto=format&fit=crop&q=80',
    relatedResearch: {
      expeditionId: 'iae46',
      scientistId: 'res-1',
      reportId: 'rep-1',
      datasetId: 'ds-temp-1',
      publicationId: 'pub-ice-1',
    },
    animatedProcess: {
      title: 'From Snowfall to Deep Ice Capsule',
      description: 'Step-by-step transformation of falling snow into trapped atmospheric time capsules.',
      steps: [
        {
          step: 1,
          label: 'Fresh Snow Accumulation',
          details: 'Atmospheric moisture condenses into snow crystals, trapping ambient surface air in open pores (firn layer).',
          visualTag: 'Snowfall Layer',
        },
        {
          step: 2,
          label: 'Firn Compression',
          details: 'Subsequent annual layers press down on the firn. At ~70m depth, snow pores close off completely.',
          visualTag: 'Pore Closure',
        },
        {
          step: 3,
          label: 'Air Bubble Sealing',
          details: 'Trapped air becomes isolated from the atmosphere, creating pristine time capsules of past air composition.',
          visualTag: 'Bubble Enclosure',
        },
        {
          step: 4,
          label: 'Drill Recovery & Melt Extraction',
          details: 'Electro-mechanical drills extract 1-meter ice barrels. CAVS spectrometers analyze gas ratios and oxygen isotopes.',
          visualTag: 'Spectrometry Analysis',
        },
      ],
    },
    simplifiedPaper: {
      title: 'Holocene Climate Oscillations Reconstructed from East Antarctic Ice Core IND-ICE #46',
      originalDoi: '10.1016/j.epsl.2025.118942',
      publishedJournal: 'Earth and Planetary Science Letters',
      year: 2025,
      takeawaySummary: 'Analysis of a 120m ice core recovered near Princess Elizabeth Land shows stable pre-industrial CO2 levels at ~280 ppm followed by a 45% spike after 1850 AD.',
      keyFindings: [
        'Oxygen isotope ratios (δ18O) confirm a 2.4°C cooling during the Little Ice Age (1550–1800 AD).',
        'Dust layers indicate increased Himalayan aerosol transport during intense summer monsoons.',
        'Methane (CH4) concentrations closely track agricultural expansion over the past 2,000 years.',
      ],
      simplifiedMethods: 'Scientists cut 5-cm core segments in cleanroom conditions, melted them in sealed vacuum flasks, and fed the released gas into cavity ring-down spectrometers.',
    },
    chapters: [
      {
        id: 'ch-1',
        title: 'Chapter 1: The Polar Time Capsule',
        subtitle: 'Why ice sheets are Earth’s greatest climate archives',
        readTime: '8 min',
        content: `Ice sheets in East Antarctica have accumulated layer by layer for over 800,000 years. Each year, falling snow captures atmospheric dust, sea salt, volcanic ash, and cosmic isotopes. As new snow falls, the weight compresses the underlying layers into solid glacial ice.

During this compression, tiny pockets of air become trapped between ice crystals. These bubbles are actual physical samples of Earth's atmosphere from tens of thousands of years ago! By measuring gas ratios inside these bubbles, glaciologists can directly measure greenhouse gas concentrations such as carbon dioxide ($CO_2$) and methane ($CH_4$).`,
        keyConcepts: [
          'Firn: Snow that has survived one summer and is undergoing compaction into ice.',
          'Bubble Closure Depth: The boundary (~60–80m) where air becomes permanently sealed in ice.',
          'Paleoproxy: An indirect physical measure of past climate (such as oxygen isotopes for temperature).',
        ],
        diagramType: 'ice-core-stratigraphy',
        interactiveWidgetType: 'bubble-extractor',
        checkpoints: [
          {
            question: 'At what depth in an Antarctic ice sheet do open snow pores permanently seal into air bubbles?',
            options: ['0 to 10 meters', '20 to 30 meters', '60 to 80 meters', '500 to 1000 meters'],
            answerIndex: 2,
            explanation: 'Between 60 and 80 meters depth (the firn-ice transition), pressure forces pores to close into isolated air bubbles.',
          },
        ],
      },
      {
        id: 'ch-2',
        title: 'Chapter 2: Thermometers in the Ice (δ18O Ratios)',
        subtitle: 'How water isotopes record prehistoric temperature',
        readTime: '9 min',
        content: `How do scientists know how cold Antarctica was 50,000 years ago without thermometers? The answer lies in oxygen isotopes: Oxygen-16 ($^{16}O$) and Oxygen-18 ($^{18}O$).

Water molecules containing lighter $^{16}O$ evaporate more easily from warm tropical oceans. As moisture clouds travel towards the cold poles, water containing heavier $^{18}O$ condenses out first. During colder glacial periods, rain and snow reaching the polar ice sheet are depleted in $^{18}O$.

By measuring the ratio $\\delta^{18}O = \\left( \\frac{(^{18}O/^{16}O)_{sample}}{(^{18}O/^{16}O)_{standard}} - 1 \\right) \\times 1000$, glaciologists calculate past ambient air temperatures with precision within $\\pm 0.5^\\circ C$.`,
        keyConcepts: [
          'Isotopic Fractionation: Separation of heavy and light isotopes during phase changes (evaporation/condensation).',
          'Glacial Depletion: Cold climate leads to lower δ18O values in polar snow.',
          'Baseline Calibration: Calibrated against modern meteorological station data at Maitri and Bharati.',
        ],
        diagramType: 'ice-core-stratigraphy',
        checkpoints: [
          {
            question: 'Why does polar snow have a lower Oxygen-18 ratio during colder climate periods?',
            options: [
              'Heavy Oxygen-18 condenses first during storm transport before reaching Antarctica',
              'Oxygen-16 evaporates faster in cold polar weather',
              'Volcanic eruptions remove Oxygen-18 from air',
              'Ice sheet pressure converts Oxygen-18 into Nitrogen',
            ],
            answerIndex: 0,
            explanation: 'Water with heavier Oxygen-18 condenses out preferentially as air masses cool on their journey to the poles.',
          },
        ],
      },
      {
        id: 'ch-3',
        title: 'Chapter 3: Indian Glaciology at Princess Elizabeth Land',
        subtitle: 'NCPOR deep core drilling campaign IAE-46',
        readTime: '8 min',
        content: `During the 46th Indian Antarctic Expedition (IAE-46), NCPOR researchers led by Dr. Kavya Rao deployed electromechanical core drills at high altitude on the inland ice sheet plateau.

Operating in ambient temperatures below -30°C, the team retrieved 120 meters of pristine ice core. Core segments were logged under polarized light to identify refreeze crusts and volcanic dust bands, then packed into specialized insulated transport containers for laboratory analysis back at NCPOR in Goa, India.`,
        keyConcepts: [
          'Electromechanical Core Drill: Rotates sharp carbide teeth to cut clean 10-cm diameter ice cylinders.',
          'Cold Chain Logistics: Ice core samples must remain below -20°C from Antarctic retrieval to Goa lab arrival.',
          'Volcanic Horizon Marker: Ash layers from historical eruptions (e.g. Tambora 1815) provide precise age markers.',
        ],
        checkpoints: [
          {
            question: 'Which Indian research organization conducts ice core drilling campaigns in Antarctica?',
            options: [
              'NCPOR (National Centre for Polar and Ocean Research)',
              'ISRO (Indian Space Research Organisation)',
              'CSIR (Council of Scientific and Industrial Research)',
              'IMD (India Meteorological Department)',
            ],
            answerIndex: 0,
            explanation: 'NCPOR under the Ministry of Earth Sciences (MoES) is India’s nodal agency for Antarctic and Arctic expeditions.',
          },
        ],
      },
    ],
  },
  {
    id: 'sea-ice-formation',
    topicId: 'cryosphere',
    topicTitle: 'Cryosphere Physics',
    title: 'How Sea Ice Forms, Thickens and Changes the Oceans',
    kicker: 'Cryosphere Thermodynamics',
    subtitle: 'From microscopic frazil ice crystals to multi-year pack ice and brine expulsion.',
    category: 'Cryosphere Physics',
    timeToComplete: '20 min',
    level: 'Intermediate',
    coverImage: 'https://images.unsplash.com/photo-1508873696983-2df515122519?w=1200&auto=format&fit=crop&q=80',
    relatedResearch: {
      expeditionId: 'arctic26',
      scientistId: 'res-4',
      reportId: 'rep-2',
      datasetId: 'ds-permafrost-3',
      publicationId: 'pub-permafrost-3',
    },
    animatedProcess: {
      title: 'The Sea Ice Life Cycle',
      description: 'How turbulent polar ocean water freezes into solid floating sea ice.',
      steps: [
        {
          step: 1,
          label: 'Frazil Ice Nucleation',
          details: 'As seawater cools to -1.9°C, microscopic needle-like ice crystals (frazil ice) form in open ocean water.',
          visualTag: 'Frazil Needles',
        },
        {
          step: 2,
          label: 'Grease Ice & Pancake Ice',
          details: 'Wave action aggregates frazil crystals into a soup-like grease ice, which hardens into round pancake ice floes.',
          visualTag: 'Pancake Floes',
        },
        {
          step: 3,
          label: 'Sheet Ice & Brine Rejection',
          details: 'Pancakes freeze together into continuous sheet ice. Pure water freezes into ice crystals, driving super-dense salty brine downward.',
          visualTag: 'Brine Drainage',
        },
        {
          step: 4,
          label: 'Fast Ice Anchoring',
          details: 'Sea ice attaches to shorelines and continental ice shelves, forming fast ice that shelters coastal Antarctic ecosystems.',
          visualTag: 'Fast Ice Anchor',
        },
      ],
    },
    simplifiedPaper: {
      title: 'Brine Rejection Channels and Deep Thermal Stratification in Svalbard Fjords',
      originalDoi: '10.1029/2025JC019821',
      publishedJournal: 'Journal of Geophysical Research: Oceans',
      year: 2025,
      takeawaySummary: 'In-situ sensor moorings in Kongsfjorden reveal that winter sea ice brine drainage accounts for 35% of bottom water ventilation.',
      keyFindings: [
        'Brine channels act as miniature vertical conduits expelling 30+ PSU salty water.',
        'Reductions in winter fast-ice duration lead to warmer bottom water in Arctic fjords.',
      ],
      simplifiedMethods: 'Micro-profilers measured salinity at 1-cm vertical intervals across fast-ice undersurfaces.',
    },
    chapters: [
      {
        id: 'ch-sea-1',
        title: 'Chapter 1: Freezing Saltwater',
        subtitle: 'Why seawater freezes below 0°C',
        readTime: '7 min',
        content: `Freshwater freezes at 0°C (32°F). Seawater, however, contains dissolved salts (average salinity 35 PSU), which depress its freezing point to approximately **-1.9°C (28.6°F)**.

When sea ice forms, water molecules create a hexagonal crystal lattice that excludes salt ions. This expulsion of concentrated salt into surrounding water is called **Brine Rejection**. The discarded brine is cold and extremely dense, causing it to sink rapidly to the ocean floor!`,
        keyConcepts: [
          'Freezing Point Depression: Dissolved salts lower seawater freezing point to -1.9°C.',
          'Brine Rejection: Process where freezing ice expels heavy salt into underlying ocean layers.',
          'Fast Ice: Sea ice anchored to coastlines or island shelves.',
        ],
        diagramType: 'sea-ice-salinity',
        interactiveWidgetType: 'brine-calculator',
        checkpoints: [
          {
            question: 'What is the freezing temperature of typical polar ocean seawater (35 PSU)?',
            options: ['0.0°C', '-1.9°C', '-4.5°C', '-10.0°C'],
            answerIndex: 1,
            explanation: 'Dissolved ocean salt lowers the freezing point of ocean water down to approximately -1.9°C.',
          },
        ],
      },
    ],
  },
  {
    id: 'southern-ocean-circulation',
    topicId: 'ocean-science',
    topicTitle: 'Ocean Science & Currents',
    title: 'How the Southern Ocean Drives Global Ocean Circulation',
    kicker: 'Global Oceanography',
    subtitle: 'Exploring the Antarctic Circumpolar Current, deep water formation, and carbon pump dynamics.',
    category: 'Ocean Science',
    timeToComplete: '25 min',
    level: 'Advanced',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    relatedResearch: {
      expeditionId: 'so26',
      scientistId: 'res-5',
      reportId: 'rep-3',
      datasetId: 'ds-ocean-4',
      publicationId: 'pub-ocean-4',
    },
    animatedProcess: {
      title: 'The Great Ocean Conveyor Belt',
      description: 'How Southern Ocean upwelling and sinking waters drive global climate regulation.',
      steps: [
        {
          step: 1,
          label: 'Wind-Driven Upwelling',
          details: 'Fierce westerly winds drive surface water outward (Ekman transport), bringing deep nutrient-rich water up from 2000m.',
          visualTag: 'Ekman Upwelling',
        },
        {
          step: 2,
          label: 'Antarctic Bottom Water (AABW) Sinking',
          details: 'Super-cooled, dense salty water produced near ice polynyas sinks down continental slopes into ocean abyssal basins.',
          visualTag: 'AABW Sinking',
        },
        {
          step: 3,
          label: 'Biological Carbon Pump',
          details: 'Phytoplankton absorb atmospheric CO2 during summer light, sinking to deep seabed when they die.',
          visualTag: 'Carbon Sequestration',
        },
      ],
    },
    simplifiedPaper: {
      title: 'Decadal Warming of Antarctic Bottom Water in the Indian Sector of the Southern Ocean',
      originalDoi: '10.1038/s41558-025-02104-w',
      publishedJournal: 'Nature Climate Change',
      year: 2025,
      takeawaySummary: 'Deep Argo float telemetry collected aboard ORV Sagar Nidhi shows Antarctic Bottom Water warming by 0.04°C per decade, reducing abyssal ocean heat absorption.',
      keyFindings: [
        'AABW volume decreased by 12% between 60°S and 40°S.',
        'Meltwater influx from Antarctic ice shelves lightens surface water, slowing deep sinking rates.',
      ],
      simplifiedMethods: 'Deployed 24 deep-sea Argo floats rated for 6000m depths along 57°E transect.',
    },
    chapters: [
      {
        id: 'ch-ocean-1',
        title: 'Chapter 1: The Engine of Earth’s Oceans',
        subtitle: 'Why the Southern Ocean absorbs 40% of human carbon emissions',
        readTime: '9 min',
        content: `The Southern Ocean encircles Antarctica uninterrupted by land masses. Powerful westerly winds drive the **Antarctic Circumpolar Current (ACC)**, transporting 130 million cubic meters of water per second—over 100 times the flow of all rivers on Earth combined!

Because deep ocean water rises to the surface in the Southern Ocean, it comes into contact with the atmosphere for the first time in centuries. Cold polar surface water absorbs massive amounts of atmospheric carbon dioxide ($CO_2$), acting as Earth's premier carbon sink.`,
        keyConcepts: [
          'Antarctic Circumpolar Current (ACC): World’s strongest ocean current connecting Atlantic, Pacific, and Indian Oceans.',
          'Antarctic Bottom Water (AABW): Coldest, densest water mass on Earth filling abyssal ocean ocean beds.',
          'Solubility Pump: Cold water holds more dissolved gases ($CO_2$) than warm water.',
        ],
        diagramType: 'thermohaline-conveyor',
        interactiveWidgetType: 'density-column',
        checkpoints: [
          {
            question: 'Which ocean current is the strongest on Earth and flows clockwise around Antarctica?',
            options: ['Gulf Stream', 'Agulhas Current', 'Antarctic Circumpolar Current (ACC)', 'Kuroshio Current'],
            answerIndex: 2,
            explanation: 'The ACC flows unimpeded around Antarctica and connects the Atlantic, Pacific, and Indian Oceans.',
          },
        ],
      },
    ],
  },
  {
    id: 'antarctic-ecosystem-krill',
    topicId: 'polar-life',
    topicTitle: 'Polar Life & Biodiversity',
    title: 'Antarctic Krill & Microbes: Life on the Edge of Ice',
    kicker: 'Polar Marine Ecology',
    subtitle: 'Extremophiles, sea-ice algae, and the marine food web sustaining penguins and blue whales.',
    category: 'Polar Life',
    timeToComplete: '20 min',
    level: 'Beginner',
    coverImage: 'https://images.unsplash.com/photo-1541414779316-956a5f3df20c?w=1200&auto=format&fit=crop&q=80',
    relatedResearch: {
      expeditionId: 'iae45',
      scientistId: 'res-3',
      reportId: 'rep-6',
      datasetId: 'ds-microbe-7',
      publicationId: 'pub-bio-6',
    },
    animatedProcess: {
      title: 'The Antarctic Fast-Ice Food Web',
      description: 'How microscopic sea-ice algae fuel the entire Southern Ocean ecosystem.',
      steps: [
        {
          step: 1,
          label: 'Ice Algae Under-Ice Blooms',
          details: 'Diatoms thrive in brine pockets inside sea ice, absorbing spring sunlight.',
          visualTag: 'Diatom Layer',
        },
        {
          step: 2,
          label: 'Juvenile Krill Grazing',
          details: 'Larval Antarctic krill scrap algae off the underside of fast-ice sheets during winter.',
          visualTag: 'Krill Feeding',
        },
        {
          step: 3,
          label: 'Apex Predator Foraging',
          details: 'Penguins, seals, and baleen whales aggregate at ice edges to feed on dense krill swarms.',
          visualTag: 'Predator Feeding',
        },
      ],
    },
    simplifiedPaper: {
      title: 'Metagenomic Insights into Microbial Extremophiles in Prydz Bay Coastal Fast Ice',
      originalDoi: '10.1128/aem.00412-25',
      publishedJournal: 'Applied and Environmental Microbiology',
      year: 2025,
      takeawaySummary: 'NCPOR marine biologist Dr. N. Das identified cold-active enzymes (psychrophilic proteins) in Antarctic marine bacteria near Bharati Station.',
      keyFindings: [
        'Bacteria produce anti-freeze glycoproteins that prevent intracellular ice crystal formation.',
        'Enzymes remain active at temperatures down to -15°C, offering bio-industrial potential.',
      ],
      simplifiedMethods: 'Extracted seawater DNA using high-throughput benchtop sequencers at Bharati Base laboratory.',
    },
    chapters: [
      {
        id: 'ch-life-1',
        title: 'Chapter 1: The Keystone Specie',
        subtitle: 'Why Euphausia superba holds the polar web together',
        readTime: '6 min',
        content: `Antarctic krill (*Euphausia superba*) are small pink crustaceans (about 6 cm long), yet their total biomass is estimated at over 400 million metric tons—exceeding the total weight of the human population on Earth!

During Antarctic winter, when open ocean food is scarce, juvenile krill survive by using specialized comb-like legs to scrape ice-algae growing inside brine channels underneath fast ice floes.`,
        keyConcepts: [
          'Biomass Giant: Antarctic krill have one of the largest species biomasses on the planet.',
          'Ice Algae Nursery: Sea ice acts as a protective nursery and food source for larval krill.',
          'Extremophiles: Organisms adapted to survive in sub-zero temperatures and high salinity.',
        ],
        checkpoints: [
          {
            question: 'What do juvenile Antarctic krill feed on during the dark polar winter?',
            options: [
              'Volcanic hydrothermal vents',
              'Ice algae growing on the underside of sea ice',
              'Deep ocean corals',
              'Migratory fish eggs',
            ],
            answerIndex: 1,
            explanation: 'Juvenile krill depend on microscopic ice algae growing under sea ice to survive winter.',
          },
        ],
      },
    ],
  },
  {
    id: 'antarctic-sample-collection',
    topicId: 'polar-technology',
    topicTitle: 'Polar Technology & Bases',
    title: 'How Scientists Collect & Store Antarctic Samples',
    kicker: 'Field Engineering & Instrumentation',
    subtitle: 'Inside Bharati research station: Cleanrooms, CTD rosette profilers, and micro-pulse LIDARs.',
    category: 'Polar Technology',
    timeToComplete: '30 min',
    level: 'Intermediate',
    coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop&q=80',
    relatedResearch: {
      expeditionId: 'iae46',
      scientistId: 'res-2',
      reportId: 'rep-5',
      datasetId: 'ds-aerosol-6',
      publicationId: 'pub-atmosphere-7',
    },
    animatedProcess: {
      title: 'CTD Rosette Water Sampling Protocol',
      description: 'How physical oceanographers capture uncontaminated deep ocean water.',
      steps: [
        {
          step: 1,
          label: 'Deck Launch',
          details: 'Heavy winches lower 24 Niskin bottles arranged on a circular steel rosette frame into the ocean.',
          visualTag: 'Rosette Launch',
        },
        {
          step: 2,
          label: 'Real-Time Sensor Telemetry',
          details: 'CTD sensors send continuous conductivity (salinity), temperature, and pressure data back to ship computers.',
          visualTag: 'Live Telemetry',
        },
        {
          step: 3,
          label: 'Electronic Bottle Tripping',
          details: 'Scientists trigger solenoids at targeted depths (e.g. 500m, 2000m) to seal water samples air-tight.',
          visualTag: 'Sealed Niskin Bottle',
        },
      ],
    },
    simplifiedPaper: {
      title: 'Automated Micro-Pulse Lidar Measurements of Boundary-Layer Aerosols at Maitri Station',
      originalDoi: '10.5194/amt-18-2025',
      publishedJournal: 'Atmospheric Measurement Techniques',
      year: 2025,
      takeawaySummary: 'IISc researchers led by Dr. A. Menon automated green laser pulses (532 nm) to measure black carbon aerosol transport over Dronning Maud Land.',
      keyFindings: [
        'Lidar profiles revealed elevated aerosol layers originating from South American biomass burning.',
        'Black carbon lowers snow albedo by 0.5%, accelerating summer melt rates.',
      ],
      simplifiedMethods: 'Shot 2500 laser pulses per second into the Antarctic atmosphere, recording backscattered photons.',
    },
    chapters: [
      {
        id: 'ch-tech-1',
        title: 'Chapter 1: High-Tech Polar Architecture',
        subtitle: 'Design of Bharati Station in Larsemann Hills',
        readTime: '8 min',
        content: `Bharati Station, commissioned by India in 2012, is constructed from 134 prefabricated shipping containers enclosed within a aerodynamic insulated skin.

The station operates on a combined heat-and-power system, utilizes vacuum drainage to conserve water, and houses analytical laboratories equipped with mass spectrometers, cold rooms (-20°C), and satellite ground receivers.`,
        keyConcepts: [
          'Aerodynamic Skin: Reduces snow drift buildup against station walls in hurricane-force blizzard winds.',
          'Cleanroom Lab: Class-100 cleanroom environments prevent contamination of low-concentration trace gas samples.',
          'CTD Profiler: Sensor package measuring Conductivity (Salinity), Temperature, and Depth (Pressure).',
        ],
        checkpoints: [
          {
            question: 'What does a CTD profiler measure in oceanographic research?',
            options: [
              'Carbon, Titanium, and Density',
              'Conductivity (Salinity), Temperature, and Depth (Pressure)',
              'Clouds, Turbidity, and Dust',
              'Currents, Tides, and Drift',
            ],
            answerIndex: 1,
            explanation: 'CTD stands for Conductivity (which measures salinity), Temperature, and Depth (measured via pressure).',
          },
        ],
      },
    ],
  },
  {
    id: 'indian-stations-legacy',
    topicId: 'indian-polar-research',
    topicTitle: 'Indian Polar Research Program',
    title: 'India in the Polar Regions: From Dakshin Gangotri to Himansh',
    kicker: 'National Science History',
    subtitle: 'Over 40 years of Indian polar exploration across Antarctica, the Arctic, and the Himalayas.',
    category: 'Indian Polar Research',
    timeToComplete: '25 min',
    level: 'Beginner',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    relatedResearch: {
      expeditionId: 'himansh26',
      scientistId: 'res-6',
      reportId: 'rep-4',
      datasetId: 'ds-temp-1',
      publicationId: 'pub-geo-8',
    },
    animatedProcess: {
      title: 'Timeline of Indian Polar Milestones',
      description: 'Key scientific milestones of India’s presence at Earth’s three poles.',
      steps: [
        {
          step: 1,
          label: '1981: 1st Indian Antarctic Expedition',
          details: 'Team led by Dr. S. Z. Qasim landed in Antarctica aboard MV Ila, establishing India’s scientific presence.',
          visualTag: '1981 Landing',
        },
        {
          step: 2,
          label: '1983: Dakshin Gangotri Commissioned',
          details: 'India’s first permanent station built on the ice shelf in Dronning Maud Land.',
          visualTag: 'Dakshin Gangotri',
        },
        {
          step: 3,
          label: '1989 & 2012: Maitri & Bharati',
          details: 'Maitri built on rocky Schirmacher Oasis; Bharati commissioned as a modern green station in Larsemann Hills.',
          visualTag: 'Maitri & Bharati',
        },
        {
          step: 4,
          label: '2008 & 2016: Himadri & Himansh',
          details: 'Himadri opened in Ny-Ålesund, Svalbard (Arctic); Himansh established at 4,500m in Lahaul-Spiti (Himalayas).',
          visualTag: '3rd Pole Presence',
        },
      ],
    },
    simplifiedPaper: {
      title: 'Mass Balance and Meltwater Teleconnections of Siti Glacier, Lahaul-Spiti Basin',
      originalDoi: '10.1007/s11629-025-8912-3',
      publishedJournal: 'Journal of Mountain Science',
      year: 2025,
      takeawaySummary: 'Himansh Station glaciologist Dr. A. Kumar documented a net mass balance loss of -0.62 m w.e./year across Himalayan glaciers.',
      keyFindings: [
        'Glacier retreat rates accelerated by 18% over the 2015-2025 decade.',
        'Meltwater feeds Indus and Ganges river basins, directly supporting agricultural water security in North India.',
      ],
      simplifiedMethods: 'Surveyed 18 RTK-GPS tracked ablation stakes and stream Doppler discharge meters.',
    },
    chapters: [
      {
        id: 'ch-india-1',
        title: 'Chapter 1: The Three Poles of India',
        subtitle: 'Connecting Antarctica, Arctic, and the High-Altitude Himalayas',
        readTime: '7 min',
        content: `India is one of the few nations operating permanent scientific research stations across all **Three Poles** of the Earth:
1. **Antarctica (South Pole)**: Bharati & Maitri Stations
2. **Arctic (North Pole)**: Himadri Station in Ny-Ålesund, Svalbard
3. **The Third Pole (Himalayas)**: Himansh Station at 4,500m in Lahaul-Spiti

Research at these bases provides critical data on global sea-level rise, atmospheric teleconnections, and the stability of monsoon rainfall that feeds 1.4 billion people in India.`,
        keyConcepts: [
          'The Third Pole: Term describing the Hindu Kush-Himalayan region holding the largest ice volume outside the polar ice sheets.',
          'NCPOR: Autonomous institute under MoES managing all Indian polar stations and oceanographic vessel charters.',
          'Monsoon Teleconnections: How changes in polar winds and sea-ice drive summer monsoon onset over India.',
        ],
        checkpoints: [
          {
            question: 'What is India’s high-altitude Himalayan research station located in Lahaul-Spiti called?',
            options: ['Maitri', 'Himadri', 'Himansh', 'Bharati'],
            answerIndex: 2,
            explanation: 'Himansh Base was established in 2016 at an altitude of 4,500 meters in Lahaul-Spiti, Himachal Pradesh.',
          },
        ],
      },
    ],
  },
];

export const questionBank: QuestionBankItem[] = [
  // CLIMATE & ENVIRONMENT QUESTIONS
  {
    id: 'q-clim-1',
    topicId: 'climate-environment',
    topicTitle: 'Climate & Environment',
    question: 'What is trapped inside deep ice core bubbles that allows direct measurement of ancient atmospheres?',
    type: 'single_choice',
    options: ['Fossilized micro-shells', 'Actual physical air samples', 'Radioactive mineral dust', 'Sub-glacial river sediment'],
    correctAnswers: [1],
    explanation: 'As snow compresses into ice, atmospheric air is trapped in isolated bubbles, preserving physical gas samples.',
    hint: 'Think about what gas bubbles hold in solid ice.',
    difficulty: 'Easy',
  },
  {
    id: 'q-clim-2',
    topicId: 'climate-environment',
    topicTitle: 'Climate & Environment',
    question: 'Which water isotope is depleted in polar snow during colder glacial climates?',
    type: 'single_choice',
    options: ['Hydrogen-1', 'Oxygen-18 (18O)', 'Carbon-12', 'Nitrogen-14'],
    correctAnswers: [1],
    explanation: 'Water containing heavier Oxygen-18 condenses first during atmospheric transport, leaving polar snow depleted in colder periods.',
    hint: 'It is a heavier isotope of Oxygen.',
    difficulty: 'Medium',
  },
  {
    id: 'q-clim-3',
    topicId: 'climate-environment',
    topicTitle: 'Climate & Environment',
    question: 'What was the approximate pre-industrial atmospheric CO2 concentration recorded in ice cores before 1850 AD?',
    type: 'single_choice',
    options: ['180 ppm', '280 ppm', '420 ppm', '550 ppm'],
    correctAnswers: [1],
    explanation: 'Ice core records show pre-industrial CO2 levels remained around 280 ppm for thousands of years before human industrial activity.',
    hint: 'It is significantly lower than today’s ~420 ppm.',
    difficulty: 'Medium',
  },
  {
    id: 'q-clim-4',
    topicId: 'climate-environment',
    topicTitle: 'Climate & Environment',
    question: 'Select ALL environmental factors that can be reconstructed from polar ice cores:',
    type: 'multi_select',
    options: ['Past atmospheric greenhouse gas levels (CO2, CH4)', 'Historical temperature variations', 'Volcanic eruption ash layers', 'Tectonic plate boundary velocity'],
    correctAnswers: [0, 1, 2],
    explanation: 'Ice cores record atmospheric gas ratios, temperature proxies (isotopes), and volcanic ash, but not tectonic plate velocity.',
    hint: 'Select the 3 atmospheric/climate proxies.',
    difficulty: 'Hard',
  },
  {
    id: 'q-clim-5',
    topicId: 'climate-environment',
    topicTitle: 'Climate & Environment',
    question: 'True or False: The Albedo Effect describes how white snow and ice reflect solar radiation back into space.',
    type: 'true_false',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'True. High albedo snow reflects up to 80-90% of incoming sunlight, keeping polar regions cold.',
    hint: 'Think about white surface reflectivity.',
    difficulty: 'Easy',
  },

  // CRYOSPHERE PHYSICS QUESTIONS
  {
    id: 'q-cryo-1',
    topicId: 'cryosphere',
    topicTitle: 'Cryosphere Physics',
    question: 'Why does ocean seawater freeze at approximately -1.9°C instead of 0°C?',
    type: 'single_choice',
    options: [
      'High atmospheric pressure over oceans',
      'Dissolved salt depresses the freezing point',
      'Ocean currents generate friction heat',
      'Sub-surface geothermal vents warm the water',
    ],
    correctAnswers: [1],
    explanation: 'Dissolved salt ions disrupt ice crystal formation, lowering the freezing point of ocean water to -1.9°C.',
    hint: 'Salinity plays a key thermodynamic role.',
    difficulty: 'Easy',
  },
  {
    id: 'q-cryo-2',
    topicId: 'cryosphere',
    topicTitle: 'Cryosphere Physics',
    question: 'What is the process called when freezing sea ice expels dense salty water into the ocean below?',
    type: 'single_choice',
    options: ['Sublimation', 'Brine Rejection', 'Thermal Expansion', 'Isostatic Rebound'],
    correctAnswers: [1],
    explanation: 'Brine Rejection occurs when ice crystals force out salt, creating cold, heavy brine that sinks into the abyssal ocean.',
    hint: 'Saltwater expulsion during freezing.',
    difficulty: 'Medium',
  },
  {
    id: 'q-cryo-3',
    topicId: 'cryosphere',
    topicTitle: 'Cryosphere Physics',
    question: 'Which sequence correctly describes the early stages of sea ice formation in calm water?',
    type: 'single_choice',
    options: [
      'Glacier ice -> Pancake ice -> Frazil ice',
      'Frazil ice -> Grease ice -> Pancake ice -> Sheet ice',
      'Fast ice -> Ice core -> Calving',
      'Permafrost -> Ice shelf -> Iceberg',
    ],
    correctAnswers: [1],
    explanation: 'Freezing starts with microscopic frazil needles, forming grease ice soup, then pancake floes, and finally consolidated sheet ice.',
    hint: 'Microscopic crystals form first.',
    difficulty: 'Medium',
  },

  // OCEAN SCIENCE QUESTIONS
  {
    id: 'q-ocean-1',
    topicId: 'ocean-science',
    topicTitle: 'Ocean Science & Currents',
    question: 'What is the name of the coldest, densest ocean water mass that sinks near Antarctica and fills global abyssal basins?',
    type: 'single_choice',
    options: [
      'North Atlantic Deep Water (NADW)',
      'Antarctic Bottom Water (AABW)',
      'Mediterranean Intermediate Water',
      'Pacific Equatorial Surface Water',
    ],
    correctAnswers: [1],
    explanation: 'Antarctic Bottom Water (AABW) is formed near Antarctic polynyas and flows into abyssal ocean basins globally.',
    hint: 'Abbreviated as AABW.',
    difficulty: 'Easy',
  },
  {
    id: 'q-ocean-2',
    topicId: 'ocean-science',
    topicTitle: 'Ocean Science & Currents',
    question: 'How does cold polar water act as an effective sink for atmospheric carbon dioxide (CO2)?',
    type: 'single_choice',
    options: [
      'Cold water holds more dissolved gas than warm water',
      'High waves destroy carbon molecules',
      'Ice caps freeze CO2 into solid dry ice',
      'Polar winds blow CO2 into sub-surface rock',
    ],
    correctAnswers: [0],
    explanation: 'Gas solubility is higher in cold liquids (the solubility pump), allowing polar oceans to absorb vast amounts of CO2.',
    hint: 'Think about gas solubility in cold vs warm liquids.',
    difficulty: 'Medium',
  },
  {
    id: 'q-ocean-3',
    topicId: 'ocean-science',
    topicTitle: 'Ocean Science & Currents',
    question: 'Which ocean current transports over 130 million m3/sec of water clockwise around Antarctica?',
    type: 'single_choice',
    options: [
      'Gulf Stream',
      'Antarctic Circumpolar Current (ACC)',
      'Somali Current',
      'California Current',
    ],
    correctAnswers: [1],
    explanation: 'The ACC is Earth’s largest ocean current, linking the Atlantic, Pacific, and Indian Oceans without land interruption.',
    hint: 'Circulates around Antarctica.',
    difficulty: 'Easy',
  },

  // POLAR LIFE QUESTIONS
  {
    id: 'q-life-1',
    topicId: 'polar-life',
    topicTitle: 'Polar Life & Biodiversity',
    question: 'What is the primary food source for larval and juvenile Antarctic krill during winter?',
    type: 'single_choice',
    options: [
      'Planktonic jellyfish',
      'Ice algae growing on the underside of sea ice',
      'Benthic sea cucumbers',
      'Deep hydrothermal bacteria',
    ],
    correctAnswers: [1],
    explanation: 'Juvenile krill scrape microscopic diatoms and ice algae off the under-surface of fast ice floes during dark winter months.',
    hint: 'Algae attached under sea ice.',
    difficulty: 'Easy',
  },
  {
    id: 'q-life-2',
    topicId: 'polar-life',
    topicTitle: 'Polar Life & Biodiversity',
    question: 'True or False: Psychrophilic bacteria found in Antarctic waters possess special enzymes that remain active below 0°C.',
    type: 'true_false',
    options: ['True', 'False'],
    correctAnswers: [0],
    explanation: 'True. Psychrophiles (cold-loving microbes) produce cold-adapted enzymes and antifreeze proteins to thrive in sub-zero ice.',
    hint: 'Cold-adapted extremophiles.',
    difficulty: 'Easy',
  },

  // POLAR TECH & INDIAN RESEARCH QUESTIONS
  {
    id: 'q-tech-1',
    topicId: 'polar-technology',
    topicTitle: 'Polar Technology & Bases',
    question: 'Where is India’s Himadri Arctic Research Station situated?',
    type: 'single_choice',
    options: ['Nuuk, Greenland', 'Ny-Ålesund, Svalbard, Norway', 'Reykjavik, Iceland', 'Fairbanks, Alaska'],
    correctAnswers: [1],
    explanation: 'Himadri Station was established in 2008 at the international research settlement of Ny-Ålesund, Svalbard.',
    hint: 'Located in Norway’s Svalbard archipelago.',
    difficulty: 'Easy',
  },
  {
    id: 'q-tech-2',
    topicId: 'polar-technology',
    topicTitle: 'Polar Technology & Bases',
    question: 'Which Indian Antarctic station, commissioned in 2012 in Larsemann Hills, features a modern green containerized design?',
    type: 'single_choice',
    options: ['Dakshin Gangotri', 'Maitri', 'Bharati', 'Himansh'],
    correctAnswers: [2],
    explanation: 'Bharati Station was commissioned in 2012 in Larsemann Hills with an aerodynamic skin and 134 integrated containers.',
    hint: 'India’s 3rd permanent Antarctic base.',
    difficulty: 'Easy',
  },
  {
    id: 'q-tech-3',
    topicId: 'indian-polar-research',
    topicTitle: 'Indian Polar Research Program',
    question: 'What altitude is India’s Himansh Himalayan glaciology base located at in Lahaul-Spiti?',
    type: 'single_choice',
    options: ['1,200 meters', '2,500 meters', '4,500 meters', '6,800 meters'],
    correctAnswers: [2],
    explanation: 'Himansh Station sits at 4,500 meters (~14,760 ft) in the Chandra-Bhaga basin of Lahaul-Spiti, Himachal Pradesh.',
    hint: 'High-altitude research base.',
    difficulty: 'Medium',
  },
];
