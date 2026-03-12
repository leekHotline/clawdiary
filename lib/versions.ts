// 日记版本历史管理
// 用于跟踪日记的编辑历史，支持回滚

export interface DiaryVersion {
  id: string;
  diaryId: string;
  versionNumber: number;
  title: string;
  content: string;
  tags: string[];
  changedAt: string;
  changedBy: string;
  changeReason?: string;
  wordCount: number;
  checksum: string;
}

export interface VersionDiff {
  version1: DiaryVersion;
  version2: DiaryVersion;
  titleChanged: boolean;
  contentDiff: {
    added: number;
    removed: number;
    unchanged: number;
  };
  tagsAdded: string[];
  tagsRemoved: string[];
}

// 内存存储（生产环境应使用数据库）
const versionHistory: Map<string, DiaryVersion[]> = new Map();

// 生成简单校验和
function generateChecksum(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// 获取日记的所有版本
export function getVersions(diaryId: string): DiaryVersion[] {
  return versionHistory.get(diaryId) || [];
}

// 获取特定版本
export function getVersion(diaryId: string, versionNumber: number): DiaryVersion | null {
  const versions = getVersions(diaryId);
  return versions.find(v => v.versionNumber === versionNumber) || null;
}

// 获取最新版本
export function getLatestVersion(diaryId: string): DiaryVersion | null {
  const versions = getVersions(diaryId);
  return versions.length > 0 ? versions[versions.length - 1] : null;
}

// 创建新版本
export function createVersion(
  diaryId: string,
  title: string,
  content: string,
  tags: string[],
  changedBy: string = "user",
  changeReason?: string
): DiaryVersion {
  const versions = getVersions(diaryId);
  const versionNumber = versions.length + 1;
  const checksum = generateChecksum(content);

  const version: DiaryVersion = {
    id: `ver_${diaryId}_${versionNumber}`,
    diaryId,
    versionNumber,
    title,
    content,
    tags,
    changedAt: new Date().toISOString(),
    changedBy,
    changeReason,
    wordCount: content.length,
    checksum
  };

  versions.push(version);
  versionHistory.set(diaryId, versions);

  return version;
}

// 初始化版本（首次创建日记时）
export function initializeVersion(
  diaryId: string,
  title: string,
  content: string,
  tags: string[]
): DiaryVersion {
  // 检查是否已有版本
  const existing = getVersions(diaryId);
  if (existing.length > 0) {
    return existing[existing.length - 1];
  }
  
  return createVersion(diaryId, title, content, tags, "system", "初始创建");
}

// 比较两个版本
export function compareVersions(
  diaryId: string,
  version1: number,
  version2: number
): VersionDiff | null {
  const v1 = getVersion(diaryId, version1);
  const v2 = getVersion(diaryId, version2);

  if (!v1 || !v2) return null;

  // 简单的内容差异计算
  const content1 = v1.content.split(/\s+/);
  const content2 = v2.content.split(/\s+/);
  
  const contentDiff = {
    added: Math.max(0, content2.length - content1.length),
    removed: Math.max(0, content1.length - content2.length),
    unchanged: Math.min(content1.length, content2.length)
  };

  return {
    version1: v1,
    version2: v2,
    titleChanged: v1.title !== v2.title,
    contentDiff,
    tagsAdded: v2.tags.filter(t => !v1.tags.includes(t)),
    tagsRemoved: v1.tags.filter(t => !v2.tags.includes(t))
  };
}

// 获取版本统计
export function getVersionStats(diaryId: string): {
  totalVersions: number;
  totalChanges: number;
  averageWordCount: number;
  lastChangedAt: string | null;
} {
  const versions = getVersions(diaryId);
  
  if (versions.length === 0) {
    return {
      totalVersions: 0,
      totalChanges: 0,
      averageWordCount: 0,
      lastChangedAt: null
    };
  }

  const totalWordCount = versions.reduce((sum, v) => sum + v.wordCount, 0);
  
  return {
    totalVersions: versions.length,
    totalChanges: versions.length - 1, // 减去初始版本
    averageWordCount: Math.round(totalWordCount / versions.length),
    lastChangedAt: versions[versions.length - 1].changedAt
  };
}

// 回滚到指定版本
export function rollbackToVersion(
  diaryId: string,
  targetVersion: number,
  rolledBy: string = "user"
): DiaryVersion | null {
  const target = getVersion(diaryId, targetVersion);
  
  if (!target) return null;

  // 创建新版本（内容为旧版本内容）
  return createVersion(
    diaryId,
    target.title,
    target.content,
    target.tags,
    rolledBy,
    `回滚到版本 ${targetVersion}`
  );
}

// 删除版本历史（删除日记时调用）
export function deleteVersionHistory(diaryId: string): boolean {
  return versionHistory.delete(diaryId);
}

// 获取所有版本历史
export function getAllVersionHistory(): Map<string, DiaryVersion[]> {
  return versionHistory;
}