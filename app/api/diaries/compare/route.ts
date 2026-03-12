import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// GET /api/diaries/compare?left=1&right=2 - 对比两篇日记
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leftId = parseInt(searchParams.get("left") || "0");
    const rightId = parseInt(searchParams.get("right") || "0");

    if (!leftId || !rightId) {
      return NextResponse.json(
        { error: "需要提供 left 和 right 参数" },
        { status: 400 }
      );
    }

    if (leftId === rightId) {
      return NextResponse.json(
        { error: "不能对比同一篇日记" },
        { status: 400 }
      );
    }

    const diaries = await getDiaries();
    const leftDiary = diaries.find(d => d.id === leftId);
    const rightDiary = diaries.find(d => d.id === rightId);

    if (!leftDiary || !rightDiary) {
      return NextResponse.json(
        { error: "日记不存在" },
        { status: 404 }
      );
    }

    // 计算内容差异
    const leftLines = (leftDiary.content || "").split('\n');
    const rightLines = (rightDiary.content || "").split('\n');
    
    const lineDiff = calculateLineDiff(leftLines, rightLines);
    const wordDiff = calculateWordDiff(
      leftDiary.content || "",
      rightDiary.content || ""
    );

    // 计算相似度
    const similarity = calculateSimilarity(
      leftDiary.content || "",
      rightDiary.content || ""
    );

    // 标签差异
    const leftTags = leftDiary.tags || [];
    const rightTags = rightDiary.tags || [];
    const addedTags = rightTags.filter(t => !leftTags.includes(t));
    const removedTags = leftTags.filter(t => !rightTags.includes(t));
    const commonTags = leftTags.filter(t => rightTags.includes(t));

    // 时间差异
    const leftDate = new Date(leftDiary.date);
    const rightDate = new Date(rightDiary.date);
    const daysDiff = Math.round((rightDate.getTime() - leftDate.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      left: {
        id: leftDiary.id,
        title: leftDiary.title,
        date: leftDiary.date,
        wordCount: leftDiary.content?.length || 0,
        lineCount: leftLines.length,
        mood: leftDiary.mood,
        weather: leftDiary.weather,
        tags: leftTags
      },
      right: {
        id: rightDiary.id,
        title: rightDiary.title,
        date: rightDiary.date,
        wordCount: rightDiary.content?.length || 0,
        lineCount: rightLines.length,
        mood: rightDiary.mood,
        weather: rightDiary.weather,
        tags: rightTags
      },
      comparison: {
        daysDiff,
        wordCountDiff: (rightDiary.content?.length || 0) - (leftDiary.content?.length || 0),
        lineCountDiff: rightLines.length - leftLines.length,
        similarity: Math.round(similarity * 100),
        lineChanges: lineDiff,
        wordChanges: wordDiff,
        tagChanges: {
          added: addedTags,
          removed: removedTags,
          common: commonTags
        },
        metadataChanges: {
          title: leftDiary.title !== rightDiary.title ? {
            from: leftDiary.title,
            to: rightDiary.title
          } : null,
          mood: leftDiary.mood !== rightDiary.mood ? {
            from: leftDiary.mood,
            to: rightDiary.mood
          } : null,
          weather: leftDiary.weather !== rightDiary.weather ? {
            from: leftDiary.weather,
            to: rightDiary.weather
          } : null
        }
      }
    });
  } catch (error) {
    console.error("Compare diaries error:", error);
    return NextResponse.json(
      { error: "对比失败" },
      { status: 500 }
    );
  }
}

function calculateLineDiff(leftLines: string[], rightLines: string[]) {
  const result: Array<{
    type: 'same' | 'add' | 'remove' | 'change';
    left?: string;
    right?: string;
    leftNum: number;
    rightNum: number;
  }> = [];

  let leftIdx = 0;
  let rightIdx = 0;

  while (leftIdx < leftLines.length || rightIdx < rightLines.length) {
    const leftLine = leftLines[leftIdx];
    const rightLine = rightLines[rightIdx];

    if (leftIdx >= leftLines.length) {
      result.push({ type: 'add', right: rightLine, leftNum: 0, rightNum: rightIdx + 1 });
      rightIdx++;
    } else if (rightIdx >= rightLines.length) {
      result.push({ type: 'remove', left: leftLine, leftNum: leftIdx + 1, rightNum: 0 });
      leftIdx++;
    } else if (leftLine === rightLine) {
      result.push({ type: 'same', left: leftLine, right: rightLine, leftNum: leftIdx + 1, rightNum: rightIdx + 1 });
      leftIdx++;
      rightIdx++;
    } else {
      const leftInRight = rightLines.slice(rightIdx).indexOf(leftLine);
      const rightInLeft = leftLines.slice(leftIdx).indexOf(rightLine);

      if (leftInRight === -1 && rightInLeft === -1) {
        result.push({ type: 'change', left: leftLine, right: rightLine, leftNum: leftIdx + 1, rightNum: rightIdx + 1 });
        leftIdx++;
        rightIdx++;
      } else if (leftInRight !== -1 && (rightInLeft === -1 || leftInRight <= rightInLeft)) {
        for (let i = 0; i < leftInRight; i++) {
          result.push({ type: 'add', right: rightLines[rightIdx + i], leftNum: 0, rightNum: rightIdx + i + 1 });
        }
        rightIdx += leftInRight;
      } else {
        for (let i = 0; i < rightInLeft!; i++) {
          result.push({ type: 'remove', left: leftLines[leftIdx + i], leftNum: leftIdx + i + 1, rightNum: 0 });
        }
        leftIdx += rightInLeft!;
      }
    }
  }

  return {
    total: result.length,
    same: result.filter(r => r.type === 'same').length,
    added: result.filter(r => r.type === 'add').length,
    removed: result.filter(r => r.type === 'remove').length,
    changed: result.filter(r => r.type === 'change').length,
    details: result.slice(0, 100) // 只返回前100行详情
  };
}

function calculateWordDiff(left: string, right: string) {
  const leftWords = left.split(/\s+/).filter(w => w.length > 0);
  const rightWords = right.split(/\s+/).filter(w => w.length > 0);
  
  const leftSet = new Set(leftWords);
  const rightSet = new Set(rightWords);
  
  const added = rightWords.filter(w => !leftSet.has(w));
  const removed = leftWords.filter(w => !rightSet.has(w));
  const common = leftWords.filter(w => rightSet.has(w));

  return {
    leftCount: leftWords.length,
    rightCount: rightWords.length,
    diff: rightWords.length - leftWords.length,
    addedCount: added.length,
    removedCount: removed.length,
    commonCount: common.length,
    addedWords: [...new Set(added)].slice(0, 20),
    removedWords: [...new Set(removed)].slice(0, 20)
  };
}

function calculateSimilarity(left: string, right: string): number {
  if (!left && !right) return 1;
  if (!left || !right) return 0;

  const leftWords = left.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const rightWords = right.toLowerCase().split(/\s+/).filter(w => w.length > 0);

  const leftSet = new Set(leftWords);
  const rightSet = new Set(rightWords);

  const intersection = new Set([...leftSet].filter(x => rightSet.has(x)));
  const union = new Set([...leftSet, ...rightSet]);

  return intersection.size / union.size;
}