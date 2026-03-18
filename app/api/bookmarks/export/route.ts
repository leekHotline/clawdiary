import { NextRequest, NextResponse } from "next/server";

// 书签导入导出 API
interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  category?: string;
  createdAt: string;
}

// 内存存储
let bookmarksStore: BookmarkItem[] = [
  {
    id: "1",
    title: "Next.js 官方文档",
    url: "https://nextjs.org/docs",
    description: "Next.js 框架官方文档",
    tags: ["开发", "框架"],
    category: "学习资源",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "React 最佳实践",
    url: "https://react.dev/learn",
    description: "React 官方学习指南",
    tags: ["React", "前端"],
    category: "学习资源",
    createdAt: new Date().toISOString(),
  },
];

// 导出书签
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";
  const category = searchParams.get("category");

  let bookmarks = [...bookmarksStore];

  // 按分类过滤
  if (category) {
    bookmarks = bookmarks.filter((b) => b.category === category);
  }

  // 根据格式导出
  if (format === "html") {
    // HTML 书签格式（浏览器兼容）
    const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Claw Diary 书签</H1>
<DL><p>
${bookmarks
  .map(
    (b) => `    <DT><A HREF="${b.url}">${b.title}</A>${b.description ? ` - ${b.description}` : ""}</DT>`
  )
  .join("\n")}
</DL><p>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": 'attachment; filename="bookmarks.html"',
      },
    });
  }

  if (format === "csv") {
    // CSV 格式
    const csv = [
      "标题,URL,描述,标签,分类,创建时间",
      ...bookmarks.map(
        (b) =>
          `"${b.title}","${b.url}","${b.description || ""}","${(b.tags || []).join(";")}","${b.category || ""}","${b.createdAt}"`
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="bookmarks.csv"',
      },
    });
  }

  // 默认 JSON 格式
  return NextResponse.json({
    success: true,
    data: bookmarks,
    total: bookmarks.length,
    exportedAt: new Date().toISOString(),
  });
}

// 导入书签
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookmarks, mode = "merge" } = body;

    if (!Array.isArray(bookmarks)) {
      return NextResponse.json(
        { success: false, error: "书签数据格式错误" },
        { status: 400 }
      );
    }

    // 验证书签格式
    const validBookmarks: BookmarkItem[] = [];
    const errors: string[] = [];

    bookmarks.forEach((b, index) => {
      if (!b.url) {
        errors.push(`第 ${index + 1} 个书签缺少 URL`);
        return;
      }
      validBookmarks.push({
        id: b.id || `import-${Date.now()}-${index}`,
        title: b.title || b.url,
        url: b.url,
        description: b.description || "",
        tags: b.tags || [],
        category: b.category || "导入的书签",
        createdAt: b.createdAt || new Date().toISOString(),
      });
    });

    // 根据模式处理
    if (mode === "replace") {
      bookmarksStore = validBookmarks;
    } else {
      // merge 模式：去重合并
      const existingUrls = new Set(bookmarksStore.map((b) => b.url));
      const newBookmarks = validBookmarks.filter((b) => !existingUrls.has(b.url));
      bookmarksStore = [...bookmarksStore, ...newBookmarks];
    }

    return NextResponse.json({
      success: true,
      message: `成功导入 ${validBookmarks.length} 个书签`,
      imported: validBookmarks.length,
      skipped: bookmarks.length - validBookmarks.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "导入失败" },
      { status: 500 }
    );
  }
}

// 批量删除
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids)) {
      return NextResponse.json(
        { success: false, error: "ID 列表格式错误" },
        { status: 400 }
      );
    }

    const before = bookmarksStore.length;
    bookmarksStore = bookmarksStore.filter((b) => !ids.includes(b.id));
    const deleted = before - bookmarksStore.length;

    return NextResponse.json({
      success: true,
      message: `已删除 ${deleted} 个书签`,
      deleted,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "删除失败" },
      { status: 500 }
    );
  }
}