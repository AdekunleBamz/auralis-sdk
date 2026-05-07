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
  ["#08111f", "#00b894", "#ffbe55", "#f85f73", "#eef7f2"],
  ["#101316", "#8fe388", "#f7cf5f", "#e85d75", "#f6f4ef"],
  ["#15100f", "#35d0ba", "#f4a261", "#e76f51", "#fbfbf3"],
  ["#111827", "#3ddc97", "#ffb703", "#fb7185", "#f7fee7"],
  ["#0d1b1e", "#1dd3b0", "#ffd166", "#ef476f", "#f4f1de"],
  ["#171219", "#4ecdc4", "#ffe66d", "#ff6b6b", "#f7fff7"],
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
  const edition = promptHash.slice(2, 8).toUpperCase();
  const name = `${prefix} ${form} #${edition}`;
  const description = `${name} is an Auralis artifact shaped from a natural-language seed and minted on Celo.`;
  const attributes = [
    { trait_type: "Mood", value: mood },
    { trait_type: "Form", value: form },
    { trait_type: "Palette", value: palette.slice(1, 4).join(" / ") },
    { trait_type: "Prompt Hash", value: promptHash },
    { trait_type: "Agent", value: options.agentName ?? "Auralis Agent" },
  ];
  const svg = createAuralisSvg({
    prompt: normalized,
    promptHash,
    name,
    mood,
    form,
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
  palette: readonly string[];
}): string {
  const bytes = hashBytes(input.promptHash);
  const [ink, teal, amber, coral, paper] = input.palette;
  const r1 = 150 + (bytes[4] % 100);
  const r2 = 90 + (bytes[5] % 90);
  const drift = bytes[6] % 48;
  const spin = bytes[7] % 360;
  const glyph = input.form.slice(0, 1).toUpperCase();
  const safePrompt = escapeSvg(input.prompt);
  const safeName = escapeSvg(input.name);

  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 10 + spin / 180;
    const radius = index % 2 === 0 ? r1 : r2;
    const x = 500 + Math.cos(angle) * radius;
    const y = 450 + Math.sin(angle) * radius;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000" role="img" aria-label="${safeName}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${paper}"/>
      <stop offset="0.52" stop-color="${teal}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${coral}" stop-opacity="0.42"/>
    </linearGradient>
    <radialGradient id="core" cx="50%" cy="48%" r="60%">
      <stop offset="0" stop-color="${amber}"/>
      <stop offset="0.48" stop-color="${teal}"/>
      <stop offset="1" stop-color="${ink}"/>
    </radialGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="32" stdDeviation="24" flood-color="${ink}" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="1000" height="1000" fill="url(#sky)"/>
  <path d="M0 715 C185 ${620 + drift} 318 ${800 - drift} 500 705 C711 ${595 + drift} 836 ${768 - drift} 1000 642 L1000 1000 L0 1000 Z" fill="${ink}" opacity="0.92"/>
  <circle cx="212" cy="220" r="${70 + (bytes[8] % 70)}" fill="${amber}" opacity="0.62"/>
  <circle cx="796" cy="258" r="${42 + (bytes[9] % 62)}" fill="${coral}" opacity="0.56"/>
  <g transform="rotate(${spin} 500 450)" filter="url(#softShadow)">
    <polygon points="${points}" fill="url(#core)" stroke="${paper}" stroke-width="14" stroke-linejoin="round"/>
    <circle cx="500" cy="450" r="${88 + (bytes[10] % 42)}" fill="${paper}" opacity="0.94"/>
    <text x="500" y="486" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="108" font-weight="800" fill="${ink}">${glyph}</text>
  </g>
  <path d="M254 666 C354 590 443 696 523 632 C608 563 688 620 760 560" fill="none" stroke="${amber}" stroke-width="18" stroke-linecap="round" opacity="0.9"/>
  <text x="84" y="835" font-family="Inter, Arial, sans-serif" font-size="50" font-weight="800" fill="${paper}">${safeName}</text>
  <text x="84" y="893" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="600" fill="${paper}" opacity="0.76">${escapeSvg(input.mood)} ${escapeSvg(input.form)} on Celo</text>
  <text x="84" y="935" font-family="Inter, Arial, sans-serif" font-size="20" fill="${paper}" opacity="0.58">${safePrompt.slice(0, 82)}</text>
</svg>`;
}
