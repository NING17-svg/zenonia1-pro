import type { EntityFamilyConfig, EntityRecord } from "@/types/entities";

const classesRecords: EntityRecord[] = [
  {
    name: "Warrior",
    slug: "warrior",
    category: "class",
    summary: "A balanced and resilient playable class in the Steam release of ZENONIA 1.",
    gameVersionScope:
      "Current Steam release of ZENONIA 1 (Steam AppID 4538960); the official store page identifies Warrior as one of three playable classes.",
    remakeStatus:
      "The Steam release presents the original ZENONIA as refined and adapted for modern platforms.",
    sourceUrls: [
      "https://store.steampowered.com/app/4538960/ZENONIA_1/",
      "https://grindnstrat.com/zenonia-1-best-builds-guide",
      "https://lastwordongaming.com/2026/09/01/zenonia-1-best-build-guide",
    ],
    fields: {
      official_role_line: "Balanced and resilient",
      primary_stats: ["Strength"],
      weapon_affinity: ["Melee weapons", "STR-scaling weapons"],
      armor_affinity: ["Heavy armor"],
      active_skills: ["Crash", "Rising Spine", "Double Strike", "Shining Blade", "Berserk Spirit"],
      passive_skills: ["Focus of the Archer", "Wrath of the Dragon", "Strength of the Bear"],
      stat_allocation_notes:
        "Public first-week guides publish a pure-STR build for the 2026 Steam build: every level-up point goes into Strength until late-game gear carries damage. A cited level-90 spread places STR at 362 and AGI / CON / SPI at 98 each. The official Steam page confirms stat customisation but does not publish a per-class formula, so treat the cited numbers as community-assembled.",
      gear_focus:
        "Raw damage, STR, and SP cost reduction. Multi-tier weapons that scale off Strength are the priority slot.",
      difficulty_for_new_players: "Lowest of the three confirmed classes; durability and simple melee combos make it the easiest entry point for first-time ARPG players.",
      legacy_reference_notes: null,
    },
    localized: {
      "en-US": {
        name: "Warrior",
        summary:
          "A balanced and resilient playable class in the Steam release of ZENONIA 1.",
      },
    },
    sourceStatus: "official",
    lastReviewed: "2026-09-07",
  },
  {
    name: "Paladin",
    slug: "paladin",
    category: "class",
    summary: "A defensive and reliable playable class in the Steam release of ZENONIA 1.",
    gameVersionScope:
      "Current Steam release of ZENONIA 1 (Steam AppID 4538960); the official store page identifies Paladin as one of three playable classes.",
    remakeStatus:
      "The Steam release presents the original ZENONIA as refined and adapted for modern platforms.",
    sourceUrls: [
      "https://store.steampowered.com/app/4538960/ZENONIA_1/",
      "https://grindnstrat.com/zenonia-1-best-builds-guide",
      "https://lastwordongaming.com/2026/09/01/zenonia-1-best-build-guide",
    ],
    fields: {
      official_role_line: "Defensive and reliable",
      primary_stats: ["Strength", "Constitution"],
      weapon_affinity: ["Hybrid melee + spell weapons"],
      armor_affinity: ["Medium to heavy armor with resource regeneration"],
      active_skills: ["Compact Slash", "Restore", "Holy Bless", "Blade Spirit"],
      passive_skills: ["Grace of the Crow", "Strength of the Bull", "Life of the Wolf", "Leather of the Bear"],
      stat_allocation_notes:
        "Public first-week guides publish a STR + CON build for the 2026 Steam build, with a small SPI dip only when Holy Bless or Blade Spirit drains the SP pool faster than regen. A cited level-38 spread places STR at 115, CON at 77, SPI at 60, AGI at 50, and the named skill order Compact Slash → Restore → Holy Bless → Blade Spirit. The official Steam page confirms stat customisation but does not publish a per-class formula, so treat the cited numbers as community-assembled.",
      gear_focus:
        "Hybrid gear that bridges melee damage and spell power, plus SP-regen pieces so Holy Bless and Blade Spirit stay usable across a chapter.",
      difficulty_for_new_players: "Middle of the three confirmed classes; hybrid play lets new players sample melee, support, and casting without committing to one role.",
      legacy_reference_notes: null,
    },
    localized: {
      "en-US": {
        name: "Paladin",
        summary:
          "A defensive and reliable playable class in the Steam release of ZENONIA 1.",
      },
    },
    sourceStatus: "official",
    lastReviewed: "2026-09-07",
  },
  {
    name: "Assassin",
    slug: "assassin",
    category: "class",
    summary: "A fast and lethal playable class in the Steam release of ZENONIA 1.",
    gameVersionScope:
      "Current Steam release of ZENONIA 1 (Steam AppID 4538960); the official store page identifies Assassin as one of three playable classes.",
    remakeStatus:
      "The Steam release presents the original ZENONIA as refined and adapted for modern platforms.",
    sourceUrls: [
      "https://store.steampowered.com/app/4538960/ZENONIA_1/",
      "https://grindnstrat.com/zenonia-1-best-builds-guide",
      "https://lastwordongaming.com/2026/09/01/zenonia-1-best-build-guide",
    ],
    fields: {
      official_role_line: "Fast and lethal",
      primary_stats: ["Agility", "Strength"],
      weapon_affinity: ["Fast melee weapons", "AGI-scaling weapons"],
      armor_affinity: ["Light armor with evade chance"],
      active_skills: ["Frenzy Sword", "Explosion", "Invisibility"],
      passive_skills: ["Agility of the Lynx", "Grace of the Crow", "Will of the Unicorn", "Recovery of the Eagle", "Tear of Orion", "Howl of the Lion", "Wrath of the Dragon"],
      stat_allocation_notes:
        "Public first-week guides publish a 2 AGI / 1 STR crit build for the 2026 Steam build, with a glass-cannon pure-AGI variant and a mostly-AGI-with-occasional-CON variant for tougher chapters. A cited level-67 result on the 2 AGI / 1 STR setup reaches about 85% critical chance and 67% evade. The named skill order is Frenzy Sword → Explosion → Invisibility. The official Steam page confirms stat customisation but does not publish a per-class formula, so treat the cited numbers as community-assembled.",
      gear_focus:
        "Speed, critical hit chance, and evade stacking. Light armor with evade rolls is the priority slot.",
      difficulty_for_new_players: "Highest of the three confirmed classes; the dodge roll and the hunger meter carry more weight for Assassin than for Warrior or Paladin.",
      legacy_reference_notes: null,
    },
    localized: {
      "en-US": {
        name: "Assassin",
        summary:
          "A fast and lethal playable class in the Steam release of ZENONIA 1.",
      },
    },
    sourceStatus: "official",
    lastReviewed: "2026-09-07",
  },
];

export const entityFamilies: EntityFamilyConfig[] = [
  {
    id: "classes",
    routePattern: "/classes/{slug}",
    locales: ["en-US"],
    lastReviewed: "2026-09-07",
    localeContent: {
      "en-US": {
        hubH1: "ZENONIA 1 Classes — Warrior, Paladin, Assassin",
        hubSeoTitle: "ZENONIA 1 Classes: Warrior, Paladin, Assassin Guide",
        hubMetaDescription:
          "The three ZENONIA 1 classes on the current Steam build are Warrior, Paladin, and Assassin, with role, stats, weapons, armor, skill focus, and gear priorities.",
        hubSummary:
          "The ZENONIA 1 classes hub lists every playable character class confirmed for the current ZENONIA 1 Steam build, with one profile per class covering role, primary stats, weapon and armor affinity, active and passive skill focus, and gear priorities. Each profile is grounded in the official Steam store page and the official ZENONIA Demo page, and anything that belongs only to the 2009 Gamevil mobile release is kept under legacy reference notes.",
        hubQuickAnswer:
          "The ZENONIA 1 classes hub lists the three playable classes confirmed for the current Steam build: Warrior, Paladin, and Assassin. Each profile is grounded in the official Steam store page and the ZENONIA Demo page, covering role, primary stats, weapons, armor, active and passive skill focus, and gear priorities. Subclasses or pre-renewal skill curves from 2009 Gamevil mobile releases live only in legacy reference notes and never count as current facts. Anything not confirmed on the current Steam build is marked Not confirmed for the Steam build as of 2026-09-06.",
        hubEyebrow: "Classes",
        detailSeoTitle: "ZENONIA 1 {name} class guide",
        detailMetaDescription:
          "The ZENONIA 1 {name} class profile covers role, primary stats, weapon and armor affinity, active and passive skill focus, and gear priorities, grounded in the current Steam build.",
        overviewHeading: "Class overview",
        factsHeading: "Class facts",
        sourcesHeading: "Sources",
        sourcesIntro: "Class facts trace back to these official and reference sources:",
        sourceLinkLabel: "Source {index}",
        relatedHeading: "Related pages",
        categoryLabel: "Class",
        gameVersionLabel: "Steam build (AppID 4538960)",
        remakeStatusLabel: "Current-build facts only",
        trueLabel: "Yes",
        falseLabel: "No",
        emptyLabel: "Not confirmed for the Steam build as of 2026-09-06",
        fieldLabels: {
          official_role_line: "Official role line",
          primary_stats: "Primary stats",
          weapon_affinity: "Weapon affinity",
          armor_affinity: "Armor affinity",
          active_skills: "Active skills",
          passive_skills: "Passive skills",
          stat_allocation_notes: "Stat allocation notes",
          gear_focus: "Gear focus",
          difficulty_for_new_players: "Difficulty for new players",
          legacy_reference_notes: "Legacy reference notes",
        },
      },
    },
    records: classesRecords,
  },
];