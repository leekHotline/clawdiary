import fs from "fs";
import path from "path";

export interface DiaryCover {
  id: string;
  diaryId: string;
  imageUrl: string;
  source: "ai" | "upload" | "unsplash" | "custom";
  prompt?: string;
  style?: string;
  width: number;
  height: number;
  createdAt: string;
}

export interface CoverTemplate {
  id: string;
  name: string;
  style: string;
  promptTemplate: string;
  previewUrl: string;
  category: string;
}

const COVERS_FILE = path.join(process.cwd(), "data", "covers.json");

const COVER_TEMPLATES: CoverTemplate[] = [
  {
    id: "minimal",
    name: "极简风格",
    style: "minimal",
    promptTemplate: "minimalist art, simple shapes, clean lines, soft colors, {topic}, abstract, modern",
    previewUrl: "https://image.pollinations.ai/prompt/minimalist%20art,%20simple%20shapes,%20clean%20lines,%20soft%20colors,%20abstract,%20modern?width=800&height=400&seed=minimal",
    category: "artistic"
  },
  {
    id: "watercolor",
    name: "水彩画",
    style: "watercolor",
    promptTemplate: "watercolor painting, soft edges, flowing colors, artistic, {topic}, dreamy",
    previewUrl: "https://image.pollinations.ai/prompt/watercolor%20painting,%20soft%20edges,%20flowing%20colors,%20artistic,%20dreamy?width=800&height=400&seed=watercolor",
    category: "artistic"
  },
  {
    id: "neon",
    name: "霓虹灯光",
    style: "neon",
    promptTemplate: "neon lights, cyberpunk, glowing colors, dark background, {topic}, futuristic",
    previewUrl: "https://image.pollinations.ai/prompt/neon%20lights,%20cyberpunk,%20glowing%20colors,%20dark%20background,%20futuristic?width=800&height=400&seed=neon",
    category: "tech"
  },
  {
    id: "nature",
    name: "自然风景",
    style: "nature",
    promptTemplate: "beautiful nature landscape, mountains, sky, peaceful, {topic}, scenic",
    previewUrl: "https://image.pollinations.ai/prompt/beautiful%20nature%20landscape,%20mountains,%20sky,%20peaceful,%20scenic?width=800&height=400&seed=nature",
    category: "nature"
  },
  {
    id: "space",
    name: "太空星空",
    style: "space",
    promptTemplate: "space, stars, galaxies, nebula, cosmic, {topic}, astronomy, colorful",
    previewUrl: "https://image.pollinations.ai/prompt/space,%20stars,%20galaxies,%20nebula,%20cosmic,%20astronomy,%20colorful?width=800&height=400&seed=space",
    category: "nature"
  },
  {
    id: "lobster",
    name: "太空龙虾",
    style: "lobster",
    promptTemplate: "cute red lobster in space, floating among stars, cartoon style, kawaii, {topic}, space lobster, friendly",
    previewUrl: "https://image.pollinations.ai/prompt/cute%20red%20lobster%20in%20space,%20floating%20among%20stars,%20cartoon%20style,%20kawaii,%20friendly?width=800&height=400&seed=lobster",
    category: "special"
  },
  {
    id: "vintage",
    name: "复古风格",
    style: "vintage",
    promptTemplate: "vintage style, retro, nostalgic, aged paper, sepia tones, {topic}, classic",
    previewUrl: "https://image.pollinations.ai/prompt/vintage%20style,%20retro,%20nostalgic,%20aged%20paper,%20sepia%20tones,%20classic?width=800&height=400&seed=vintage",
    category: "artistic"
  },
  {
    id: "geometric",
    name: "几何图案",
    style: "geometric",
    promptTemplate: "geometric patterns, shapes, lines, circles, triangles, {topic}, abstract, modern art",
    previewUrl: "https://image.pollinations.ai/prompt/geometric%20patterns,%20shapes,%20lines,%20circles,%20triangles,%20abstract,%20modern%20art?width=800&height=400&seed=geometric",
    category: "artistic"
  }
];

function ensureDataDir() {
  const dataDir = path.dirname(COVERS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export function getCoverTemplates(): CoverTemplate[] {
  return COVER_TEMPLATES;
}

export function getCoverTemplate(id: string): CoverTemplate | undefined {
  return COVER_TEMPLATES.find(t => t.id === id);
}

export async function getDiaryCovers(): Promise<DiaryCover[]> {
  try {
    ensureDataDir();
    if (!fs.existsSync(COVERS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(COVERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading covers:", error);
    return [];
  }
}

export async function getCoverByDiaryId(diaryId: string): Promise<DiaryCover | null> {
  const covers = await getDiaryCovers();
  return covers.find(c => c.diaryId === diaryId) || null;
}

export function generateCoverUrl(prompt: string, style: string = "default", width: number = 1200, height: number = 630): string {
  const encodedPrompt = encodeURIComponent(prompt);
  const seed = `${style}-${Date.now()}`;
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}`;
}

export async function createDiaryCover(cover: Omit<DiaryCover, "id" | "createdAt">): Promise<DiaryCover> {
  ensureDataDir();
  const covers = await getDiaryCovers();
  const newCover: DiaryCover = {
    ...cover,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  covers.push(newCover);
  try {
    fs.writeFileSync(COVERS_FILE, JSON.stringify(covers, null, 2));
  } catch (e) {
    console.error("Failed to write covers file:", e);
  }
  return newCover;
}

export async function updateDiaryCover(id: string, updates: Partial<DiaryCover>): Promise<DiaryCover | null> {
  ensureDataDir();
  const covers = await getDiaryCovers();
  const index = covers.findIndex((c) => c.id === id);
  if (index === -1) return null;
  
  covers[index] = {
    ...covers[index],
    ...updates,
  };
  try {
    fs.writeFileSync(COVERS_FILE, JSON.stringify(covers, null, 2));
  } catch (e) {
    console.error("Failed to write covers file:", e);
  }
  return covers[index];
}

export async function deleteDiaryCover(id: string): Promise<boolean> {
  ensureDataDir();
  const covers = await getDiaryCovers();
  const filtered = covers.filter((c) => c.id !== id);
  if (filtered.length === covers.length) return false;
  try {
    fs.writeFileSync(COVERS_FILE, JSON.stringify(filtered, null, 2));
  } catch (e) {
    console.error("Failed to write covers file:", e);
  }
  return true;
}