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
    sourceUrls: ["https://store.steampowered.com/app/4538960/ZENONIA_1/"],
    fields: {
      official_role_line: "Balanced and resilient",
      primary_stats: [],
      weapon_affinity: [],
      armor_affinity: [],
      active_skills: [],
      passive_skills: [],
      stat_allocation_notes:
        "Not confirmed for the Steam build as of 2026-09-06; the official store page confirms that players can customize stats but does not specify a Warrior allocation recommendation.",
      gear_focus:
        "Not confirmed for the Steam build as of 2026-09-06; the official store page confirms customizable gear but does not specify a Warrior gear focus.",
      difficulty_for_new_players: "Not confirmed for the Steam build as of 2026-09-06.",
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
    lastReviewed: "2026-09-06",
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
    sourceUrls: ["https://store.steampowered.com/app/4538960/ZENONIA_1/"],
    fields: {
      official_role_line: "Defensive and reliable",
      primary_stats: [],
      weapon_affinity: [],
      armor_affinity: [],
      active_skills: [],
      passive_skills: [],
      stat_allocation_notes:
        "Not confirmed for the Steam build as of 2026-09-06; the official store page confirms that players can customize stats but does not specify a Paladin allocation recommendation.",
      gear_focus:
        "Not confirmed for the Steam build as of 2026-09-06; the official store page confirms customizable gear but does not specify a Paladin gear focus.",
      difficulty_for_new_players: "Not confirmed for the Steam build as of 2026-09-06.",
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
    lastReviewed: "2026-09-06",
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
    sourceUrls: ["https://store.steampowered.com/app/4538960/ZENONIA_1/"],
    fields: {
      official_role_line: "Fast and lethal",
      primary_stats: [],
      weapon_affinity: [],
      armor_affinity: [],
      active_skills: [],
      passive_skills: [],
      stat_allocation_notes:
        "Not confirmed for the Steam build as of 2026-09-06; the official store page confirms that players can customize stats but does not specify an Assassin allocation recommendation.",
      gear_focus:
        "Not confirmed for the Steam build as of 2026-09-06; the official store page confirms customizable gear but does not specify an Assassin gear focus.",
      difficulty_for_new_players: "Not confirmed for the Steam build as of 2026-09-06.",
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
    lastReviewed: "2026-09-06",
  },
];

export const entityFamilies: EntityFamilyConfig[] = [
  {
    id: "classes",
    routePattern: "/classes/{slug}",
    locales: ["en-US"],
    lastReviewed: "2026-09-06",
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