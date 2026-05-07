import {
  escapeSvg,
  hashBytes,
  hashPrompt,
  jsonToDataUri,
  normalizePrompt,
  pick,
  svgToDataUri,
  type AuralisDraft,
  type AuralisMetadataOptions,
  type Hex,
} from "@bamzzstudio/auralis-core";

const PALETTES = [
  ["#17212b", "#5de2b5", "#ffd166", "#ff7a90", "#ffe1ea", "#fffaf0", "#29435a"],
  ["#20182d", "#8fd6ff", "#f9c74f", "#f28482", "#fce4ec", "#fff8f1", "#3a2b54"],
  ["#12231f", "#7ae582", "#f6bd60", "#f76f8e", "#e8fff3", "#fffbea", "#24443e"],
  ["#1f2937", "#a7f3d0", "#fbbf24", "#fb7185", "#ede9fe", "#fffdf4", "#334155"],
  ["#261b2f", "#c4b5fd", "#fde68a", "#f0abfc", "#d9f99d", "#fff7ed", "#4c1d95"],
  ["#102a43", "#67e8f9", "#fcd34d", "#fdba74", "#dbeafe", "#fffaf0", "#1e3a5f"],
] as const;

const PREFIXES = [
  "Mira",
  "Vanta",
  "Eko",
  "Solin",
  "Nava",
  "Kairo",
  "Saffra",
  "Luma",
  "Oro",
] as const;

const FORMS = [
  "Sigil",
  "Bloom",
  "Cipher",
  "Relic",
  "Halo",
  "Lens",
  "Vessel",
  "Pulse",
  "Glyph",
] as const;

const MOODS = [
  "Lucid",
  "Warm",
  "Electric",
  "Quiet",
  "Radiant",
  "Bold",
  "Tender",
  "Kinetic",
] as const;

const ART_FAMILIES = [
  "Mascot Sticker",
  "Dream Landscape",
  "Hero Object",
  "Abstract Emblem",
] as const;

const THEMES = [
  {
    name: "Payments",
    glyph: "$",
    family: "Hero Object",
    keywords: ["pay", "payment", "stablecoin", "merchant", "market", "money", "wallet", "cash", "invoice"],
  },
  {
    name: "Game",
    glyph: "★",
    family: "Mascot Sticker",
    keywords: ["game", "football", "champion", "victory", "quest", "score", "play", "tournament", "winner"],
  },
  {
    name: "Solar",
    glyph: "☀",
    family: "Dream Landscape",
    keywords: ["solar", "sun", "energy", "light", "power", "grid", "climate", "green"],
  },
  {
    name: "Learning",
    glyph: "✎",
    family: "Hero Object",
    keywords: ["learn", "school", "education", "course", "book", "student", "club", "lesson", "teacher"],
  },
  {
    name: "Savings",
    glyph: "◌",
    family: "Abstract Emblem",
    keywords: ["save", "savings", "circle", "cooperative", "women", "fund", "pool", "community"],
  },
  {
    name: "Food",
    glyph: "◆",
    family: "Hero Object",
    keywords: ["food", "farm", "meal", "kitchen", "restaurant", "crop", "marketplace", "delivery"],
  },
  {
    name: "AI Agent",
    glyph: "◎",
    family: "Abstract Emblem",
    keywords: ["ai", "agent", "bot", "llm", "prompt", "model", "automation", "assistant"],
  },
  {
    name: "Music",
    glyph: "♪",
    family: "Mascot Sticker",
    keywords: ["music", "song", "audio", "sound", "artist", "beat", "dance", "playlist"],
  },
] as const;

function detectTheme(prompt: string, fallbackSeed: number) {
  const normalized = prompt.toLowerCase();
  const theme = THEMES.find((candidate) =>
    candidate.keywords.some((keyword) => normalized.includes(keyword)),
  );

  return theme ?? THEMES[fallbackSeed % THEMES.length];
}

function createSubjectMotif(
  themeName: string,
  colors: {
    ink: string;
    primary: string;
    secondary: string;
    accent: string;
    blush: string;
    paper: string;
    shade: string;
  },
): string {
  const { ink, primary, secondary, accent, blush, paper, shade } = colors;

  if (themeName === "Payments") {
    return `<g>
      <rect x="404" y="330" width="192" height="144" rx="34" fill="${paper}" stroke="${ink}" stroke-width="14"/>
      <path d="M404 374 H596" stroke="${primary}" stroke-width="28"/>
      <circle cx="458" cy="430" r="18" fill="${secondary}"/>
      <text x="548" y="438" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="900" fill="${ink}">$</text>
    </g>`;
  }

  if (themeName === "Game") {
    return `<g>
      <circle cx="500" cy="414" r="90" fill="${paper}" stroke="${ink}" stroke-width="14"/>
      <path d="M500 324 L526 385 L592 390 L542 432 L558 498 L500 462 L442 498 L458 432 L408 390 L474 385 Z" fill="${secondary}"/>
      <path d="M392 550 H608" stroke="${accent}" stroke-width="24" stroke-linecap="round"/>
    </g>`;
  }

  if (themeName === "Solar") {
    return `<g>
      <circle cx="500" cy="402" r="78" fill="${secondary}" stroke="${paper}" stroke-width="14"/>
      <g stroke="${secondary}" stroke-width="18" stroke-linecap="round">
        <path d="M500 260 V300"/><path d="M500 504 V548"/><path d="M360 402 H404"/><path d="M596 402 H640"/>
        <path d="M400 302 L430 332"/><path d="M600 302 L570 332"/><path d="M400 502 L430 472"/><path d="M600 502 L570 472"/>
      </g>
      <path d="M372 576 H628" stroke="${primary}" stroke-width="28" stroke-linecap="round"/>
    </g>`;
  }

  if (themeName === "Learning") {
    return `<g>
      <path d="M372 344 C434 316 470 336 500 358 C530 336 566 316 628 344 V536 C568 508 530 526 500 552 C470 526 432 508 372 536 Z" fill="${paper}" stroke="${ink}" stroke-width="14" stroke-linejoin="round"/>
      <path d="M500 358 V552 M410 398 H470 M410 444 H468 M530 398 H590 M532 444 H592" stroke="${primary}" stroke-width="12" stroke-linecap="round"/>
    </g>`;
  }

  if (themeName === "Savings") {
    return `<g>
      <circle cx="500" cy="420" r="126" fill="${paper}" stroke="${ink}" stroke-width="14"/>
      <circle cx="500" cy="420" r="76" fill="${blush}" stroke="${primary}" stroke-width="14"/>
      <path d="M426 420 C454 372 546 372 574 420 C546 468 454 468 426 420 Z" fill="${secondary}"/>
      <circle cx="500" cy="420" r="22" fill="${ink}"/>
    </g>`;
  }

  if (themeName === "Food") {
    return `<g>
      <path d="M386 428 C386 354 438 310 500 310 C562 310 614 354 614 428 C614 512 554 574 500 574 C446 574 386 512 386 428 Z" fill="${accent}" stroke="${paper}" stroke-width="14"/>
      <path d="M438 318 C450 256 512 246 560 278" fill="none" stroke="${primary}" stroke-width="22" stroke-linecap="round"/>
      <path d="M444 456 C480 488 520 488 556 456" fill="none" stroke="${paper}" stroke-width="16" stroke-linecap="round"/>
    </g>`;
  }

  if (themeName === "AI Agent") {
    return `<g>
      <rect x="376" y="318" width="248" height="204" rx="58" fill="${paper}" stroke="${ink}" stroke-width="14"/>
      <path d="M500 278 V318 M432 278 V318 M568 278 V318" stroke="${primary}" stroke-width="14" stroke-linecap="round"/>
      <circle cx="450" cy="418" r="22" fill="${primary}"/>
      <circle cx="550" cy="418" r="22" fill="${primary}"/>
      <path d="M448 480 C486 504 514 504 552 480" fill="none" stroke="${ink}" stroke-width="14" stroke-linecap="round"/>
    </g>`;
  }

  if (themeName === "Music") {
    return `<g>
      <path d="M548 314 V500 C548 546 508 574 466 558 C428 544 422 500 456 478 C478 464 506 468 526 486 V354 L636 326 V460 C636 506 596 534 554 518" fill="none" stroke="${paper}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="430" cy="358" r="34" fill="${secondary}"/>
      <circle cx="628" cy="552" r="28" fill="${accent}"/>
    </g>`;
  }

  return `<circle cx="500" cy="420" r="112" fill="${paper}" stroke="${shade}" stroke-width="16"/>`;
}

export function createAuralisDraft(
  prompt: string,
  options: AuralisMetadataOptions = {},
): AuralisDraft {
  const normalized = normalizePrompt(prompt);
  const promptHash = hashPrompt(normalized);
  const bytes = hashBytes(promptHash);
  const palette = PALETTES[bytes[0] % PALETTES.length];
  const mood = pick(MOODS, bytes[1]);
  const form = pick(FORMS, bytes[2]);
  const prefix = pick(PREFIXES, bytes[3]);
  const theme = detectTheme(normalized, bytes[4]);
  const family = theme.family;
  const edition = promptHash.slice(2, 8).toUpperCase();
  const name = `${prefix} ${form} #${edition}`;
  const description = `${name} is an Auralis artifact shaped from a natural-language seed and minted on Celo.`;
  const attributes = [
    { trait_type: "Mood", value: mood },
    { trait_type: "Form", value: form },
    { trait_type: "Theme", value: theme.name },
    { trait_type: "Art Family", value: family },
    { trait_type: "Palette", value: palette.slice(1, 5).join(" / ") },
    { trait_type: "Style", value: "Modern deterministic artifact" },
    { trait_type: "Prompt Hash", value: promptHash },
    { trait_type: "Agent", value: options.agentName ?? "Auralis Agent" },
  ];
  const svg = createAuralisSvg({
    prompt: normalized,
    promptHash,
    name,
    mood,
    form,
    family,
    themeName: theme.name,
    themeGlyph: theme.glyph,
    palette,
  });
  const image = svgToDataUri(svg);
  const metadata = {
    name,
    description,
    image,
    external_url: options.externalUrl ?? "https://auralis.app",
    attributes,
    properties: {
      app: options.appName ?? "Auralis",
      prompt: normalized,
      promptHash,
      creator: options.creator ?? null,
      generatedBy: options.agentName ?? "Auralis Agent",
      chain: "celo",
    },
  };

  return {
    prompt: normalized,
    promptHash,
    name,
    description,
    image,
    svg,
    tokenUri: jsonToDataUri(metadata),
    metadata,
    attributes,
  };
}

export function createAuralisSvg(input: {
  prompt: string;
  promptHash: Hex;
  name: string;
  mood: string;
  form: string;
  family: string;
  themeName: string;
  themeGlyph: string;
  palette: readonly string[];
}): string {
  const bytes = hashBytes(input.promptHash);
  const [ink, primary, secondary, accent, blush, paper, shade] = input.palette;
  const drift = bytes[4] % 52;
  const tilt = (bytes[5] % 17) - 8;
  const faceMood = bytes[6] % 3;
  const glyphSize = 92 + (bytes[7] % 26);
  const cheek = 36 + (bytes[8] % 12);
  const glyph = input.themeGlyph;
  const safePrompt = escapeSvg(input.prompt);
  const safeName = escapeSvg(input.name);
  const safeMood = escapeSvg(input.mood);
  const safeForm = escapeSvg(input.form);
  const safeTheme = escapeSvg(input.themeName);
  const promptLine = safePrompt.slice(0, 74);
  const safeFamily = escapeSvg(input.family);
  const subject = createSubjectMotif(input.themeName, {
    ink,
    primary,
    secondary,
    accent,
    blush,
    paper,
    shade,
  });

  const sparkles = Array.from({ length: 18 }, (_, index) => {
    const seed = bytes[(index + 9) % bytes.length];
    const x = 74 + ((seed * 37 + index * 61) % 852);
    const y = 74 + ((seed * 29 + index * 43) % 640);
    const size = 8 + (seed % 17);
    const opacity = (0.26 + (seed % 40) / 100).toFixed(2);

    if (index % 3 === 0) {
      return `<path d="M${x} ${y - size} L${x + size * 0.28} ${y - size * 0.28} L${x + size} ${y} L${x + size * 0.28} ${y + size * 0.28} L${x} ${y + size} L${x - size * 0.28} ${y + size * 0.28} L${x - size} ${y} L${x - size * 0.28} ${y - size * 0.28} Z" fill="${paper}" opacity="${opacity}"/>`;
    }

    return `<circle cx="${x}" cy="${y}" r="${(size / 3).toFixed(1)}" fill="${index % 2 === 0 ? secondary : accent}" opacity="${opacity}"/>`;
  }).join("\n  ");

  const accessory = (() => {
    if (input.form === "Bloom") {
      return `<g opacity="0.95">
      <ellipse cx="390" cy="267" rx="50" ry="78" fill="${blush}" transform="rotate(-34 390 267)"/>
      <ellipse cx="610" cy="267" rx="50" ry="78" fill="${blush}" transform="rotate(34 610 267)"/>
      <ellipse cx="500" cy="221" rx="48" ry="72" fill="${secondary}"/>
      ${subject}
    </g>`;
    }

    if (input.form === "Halo" || input.form === "Pulse") {
      return `<g>
      <ellipse cx="500" cy="276" rx="184" ry="54" fill="none" stroke="${secondary}" stroke-width="24" opacity="0.88"/>
      ${subject}
    </g>`;
    }

    if (input.form === "Vessel" || input.form === "Relic") {
      return `<g>
      <path d="M392 251 H608 L570 318 H430 Z" fill="${secondary}" stroke="${paper}" stroke-width="12" stroke-linejoin="round"/>
      ${subject}
    </g>`;
    }

    return `<g>
      <path d="M392 306 L435 232 L493 292 L560 222 L608 306 Z" fill="${secondary}" stroke="${paper}" stroke-width="12" stroke-linejoin="round"/>
      ${subject}
    </g>`;
  })();

  const mouth =
    faceMood === 0
      ? `<path d="M438 515 C472 566 532 566 566 515" fill="none" stroke="${ink}" stroke-width="18" stroke-linecap="round"/>`
      : faceMood === 1
        ? `<path d="M438 518 C470 548 536 548 568 518" fill="none" stroke="${ink}" stroke-width="16" stroke-linecap="round"/>`
        : `<path d="M446 524 C486 510 524 548 562 524" fill="none" stroke="${ink}" stroke-width="16" stroke-linecap="round"/>`;

  const mainArt = (() => {
    if (input.family === "Dream Landscape") {
      const sunX = 690 + (bytes[22] % 90);
      const sunY = 190 + (bytes[23] % 85);
      const moonX = 210 + (bytes[24] % 90);
      const riverShift = bytes[25] % 58;

      const landscapeSubject = (() => {
        if (input.themeName === "Solar") {
          return `<g><circle cx="${sunX}" cy="${sunY}" r="96" fill="${secondary}" opacity="0.96"/><path d="M284 590 H716" stroke="${primary}" stroke-width="28" stroke-linecap="round"/></g>`;
        }

        if (input.themeName === "Payments") {
          return `<g><rect x="598" y="424" width="116" height="82" rx="22" fill="${paper}" opacity="0.9"/><path d="M620 456 H690" stroke="${primary}" stroke-width="18"/><text x="656" y="496" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="900" fill="${ink}">$</text></g>`;
        }

        if (input.themeName === "Learning") {
          return `<g><path d="M292 466 C340 442 376 448 414 474 V582 C372 554 334 552 292 574 Z" fill="${paper}" opacity="0.92"/><path d="M414 474 C452 448 488 442 536 466 V574 C494 552 456 554 414 582 Z" fill="${blush}" opacity="0.92"/></g>`;
        }

        return `<text x="500" y="608" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="86" font-weight="900" fill="${paper}" opacity="0.92">${glyph}</text>`;
      })();

      return `<g filter="url(#stickerShadow)">
    <rect x="152" y="134" width="696" height="574" rx="74" fill="url(#card)" stroke="${paper}" stroke-width="16"/>
    <rect x="190" y="172" width="620" height="498" rx="56" fill="${primary}" opacity="0.24"/>
    <circle cx="${sunX}" cy="${sunY}" r="72" fill="${secondary}" opacity="0.94"/>
    <circle cx="${moonX}" cy="244" r="44" fill="${paper}" opacity="0.82"/>
    <path d="M190 520 C308 382 378 478 494 330 C608 478 716 348 810 514 L810 670 L190 670 Z" fill="${shade}" opacity="0.96"/>
    <path d="M190 574 C316 456 388 554 500 422 C604 550 718 440 810 556 L810 670 L190 670 Z" fill="${ink}" opacity="0.88"/>
    <path d="M368 670 C406 ${588 - riverShift} 472 ${600 + riverShift} 498 520 C534 614 612 596 650 670 Z" fill="${paper}" opacity="0.86"/>
    <path d="M406 628 C452 598 544 608 598 626" fill="none" stroke="${primary}" stroke-width="16" stroke-linecap="round" opacity="0.8"/>
    <path d="M250 294 C332 244 410 244 492 294" fill="none" stroke="${accent}" stroke-width="18" stroke-linecap="round" opacity="0.7"/>
    ${landscapeSubject}
  </g>`;
    }

    if (input.family === "Hero Object") {
      return `<g filter="url(#stickerShadow)">
    <ellipse cx="500" cy="662" rx="264" ry="58" fill="${ink}" opacity="0.18"/>
    <rect x="192" y="152" width="616" height="548" rx="118" fill="url(#card)" stroke="${paper}" stroke-width="16"/>
    <circle cx="308" cy="262" r="48" fill="${secondary}" opacity="0.84"/>
    <circle cx="704" cy="586" r="62" fill="${accent}" opacity="0.5"/>
    <g transform="rotate(${tilt} 500 454)">
      ${subject}
    </g>
  </g>`;
    }

    if (input.family === "Abstract Emblem") {
      const rings = Array.from({ length: 7 }, (_, index) => {
        const radius = 90 + index * 36 + (bytes[(index + 27) % bytes.length] % 18);
        const dash = 14 + (bytes[(index + 34) % bytes.length] % 28);
        const color = index % 3 === 0 ? secondary : index % 3 === 1 ? primary : accent;
        return `<circle cx="500" cy="424" r="${radius}" fill="none" stroke="${color}" stroke-width="${index % 2 === 0 ? 18 : 10}" stroke-dasharray="${dash} ${dash + 18}" opacity="${(0.42 + index * 0.06).toFixed(2)}"/>`;
      }).join("\n    ");

      return `<g filter="url(#stickerShadow)">
    <rect x="160" y="126" width="680" height="590" rx="88" fill="url(#card)" stroke="${paper}" stroke-width="16"/>
    <g transform="rotate(${tilt * 2} 500 424)">
      ${rings}
      <path d="M500 220 L562 362 L716 376 L598 478 L634 628 L500 548 L366 628 L402 478 L284 376 L438 362 Z" fill="url(#body)" stroke="${paper}" stroke-width="18" stroke-linejoin="round"/>
      <g transform="translate(0 5) scale(0.78 0.78) translate(142 120)">
        ${subject}
      </g>
      <circle cx="500" cy="424" r="92" fill="${paper}" opacity="0.95"/>
      <text x="500" y="459" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${glyphSize}" font-weight="900" fill="${ink}">${glyph}</text>
    </g>
  </g>`;
    }

    return `<g transform="rotate(${tilt} 500 444)" filter="url(#stickerShadow)">
    <rect x="242" y="156" width="516" height="552" rx="164" fill="url(#card)" stroke="${paper}" stroke-width="18"/>
    <rect x="292" y="206" width="416" height="416" rx="142" fill="${primary}" opacity="0.2"/>
    ${accessory}
    <path d="M334 456 C334 326 410 260 500 260 C590 260 666 326 666 456 C666 590 592 668 500 668 C408 668 334 590 334 456 Z" fill="url(#body)" stroke="${paper}" stroke-width="18"/>
    <path d="M368 401 C405 312 482 290 555 312 C503 327 465 356 438 403 C420 435 389 442 368 401 Z" fill="${paper}" opacity="0.42"/>
    <circle cx="422" cy="470" r="27" fill="${ink}"/>
    <circle cx="578" cy="470" r="27" fill="${ink}"/>
    <circle cx="413" cy="459" r="8" fill="${paper}"/>
    <circle cx="569" cy="459" r="8" fill="${paper}"/>
    <circle cx="382" cy="524" r="${cheek}" fill="${accent}" opacity="0.42"/>
    <circle cx="618" cy="524" r="${cheek}" fill="${accent}" opacity="0.42"/>
    ${mouth}
    <g transform="translate(500 625)">
      <rect x="-74" y="-58" width="148" height="104" rx="42" fill="${paper}" opacity="0.96"/>
      <text x="0" y="22" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${glyphSize}" font-weight="900" fill="${ink}">${glyph}</text>
    </g>
    <path d="M300 260 C338 190 404 174 456 205" fill="none" stroke="${paper}" stroke-width="24" stroke-linecap="round" opacity="0.65"/>
  </g>`;
  })();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000" role="img" aria-label="${safeName}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${paper}"/>
      <stop offset="0.44" stop-color="${blush}"/>
      <stop offset="1" stop-color="${primary}"/>
    </linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${paper}" stop-opacity="0.98"/>
      <stop offset="1" stop-color="${blush}" stop-opacity="0.9"/>
    </linearGradient>
    <radialGradient id="body" cx="42%" cy="32%" r="78%">
      <stop offset="0" stop-color="${paper}"/>
      <stop offset="0.45" stop-color="${primary}"/>
      <stop offset="1" stop-color="${shade}"/>
    </radialGradient>
    <linearGradient id="footer" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${ink}"/>
      <stop offset="1" stop-color="${shade}"/>
    </linearGradient>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="32" stdDeviation="24" flood-color="${ink}" flood-opacity="0.22"/>
    </filter>
    <filter id="stickerShadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="22" stdDeviation="18" flood-color="${ink}" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="1000" height="1000" fill="url(#bg)"/>
  <path d="M-20 736 C168 ${640 + drift} 298 ${789 - drift} 500 704 C706 ${618 + drift} 824 ${752 - drift} 1020 612 L1020 1000 L-20 1000 Z" fill="${ink}" opacity="0.9"/>
  <path d="M66 168 C190 74 328 114 424 193 C548 295 682 218 794 122 C864 62 940 72 1004 116 L1004 0 L0 0 L0 238 C22 218 42 190 66 168 Z" fill="${paper}" opacity="0.34"/>
  ${sparkles}
  ${mainArt}
  <g filter="url(#softShadow)">
    <rect x="72" y="772" width="856" height="146" rx="44" fill="url(#footer)" opacity="0.94"/>
    <rect x="95" y="794" width="102" height="102" rx="32" fill="${paper}" opacity="0.96"/>
    <text x="146" y="861" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="900" fill="${ink}">${glyph}</text>
    <text x="226" y="833" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="900" fill="${paper}">${safeName}</text>
    <text x="226" y="875" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" fill="${secondary}">${safeTheme} - ${safeMood} ${safeForm} - ${safeFamily}</text>
    <text x="226" y="902" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="600" fill="${paper}" opacity="0.58">${promptLine}</text>
  </g>
</svg>`;
}
