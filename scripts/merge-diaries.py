#!/usr/bin/env python3
"""合并所有日记数据到 diaries.json - 健壮版"""

import json
import re
from pathlib import Path

DATA_DIR = Path("/root/.openclaw/workspace/ai-diary/data")
OUTPUT_FILE = DATA_DIR / "diaries.json"

IMAGE_MAP = {
    "协作": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop",
    "新功能": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=400&fit=crop",
    "里程碑": "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=400&fit=crop",
    "技术": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    "AI": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    "学习": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop",
    "成长": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop",
    "调试": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    "构建": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    "审查": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
}

def get_image(tags):
    for tag in tags:
        if tag in IMAGE_MAP:
            return IMAGE_MAP[tag]
    return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop"

def extract_value(content, key, is_string=True, is_array=False):
    """提取字段值"""
    if is_array:
        match = re.search(rf'{key}:\s*\[([^\]]*)\]', content)
        if match:
            items = re.findall(r'["\']([^"\']+)["\']', match.group(1))
            return items
        return []
    
    if is_string:
        # 尝试单引号、双引号、模板字符串
        match = re.search(rf'{key}:\s*["\']([^"\']+)["\']', content)
        if match:
            return match.group(1)
        # 模板字符串
        match = re.search(rf'{key}:\s*`([^`]+)`', content)
        if match:
            return match.group(1)
        return ""
    else:
        # 数字或布尔值
        match = re.search(rf'{key}:\s*([^,\n}}]+)', content)
        if match:
            val = match.group(1).strip()
            try:
                return int(val) if val.isdigit() else val
            except:
                return val
        return None

def parse_ts_file(filepath):
    """解析 TS 文件"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    diary = {}
    
    # ID - 统一转为 day-X 格式
    id_match = re.search(r'id:\s*(\d+)', content)
    if id_match:
        diary['id'] = f"day-{id_match.group(1)}"
    else:
        id_match = re.search(r'id:\s*["\']([^"\']+)["\']', content)
        if id_match:
            raw_id = id_match.group(1)
            # 标准化 ID
            if raw_id.startswith('day-'):
                diary['id'] = raw_id
            elif raw_id.isdigit():
                diary['id'] = f"day-{raw_id}"
            else:
                num = re.search(r'(\d+)', raw_id)
                if num:
                    diary['id'] = f"day-{num.group(1)}"
                else:
                    diary['id'] = raw_id
    
    # Title
    diary['title'] = extract_value(content, 'title')
    
    # Date
    diary['date'] = extract_value(content, 'date')
    
    # Author
    author = extract_value(content, 'author')
    diary['author'] = author if author else 'AI'
    
    # Content - 多行模板字符串
    content_match = re.search(r'content:\s*`([^`]*(?:\n[^`]*)*)`', content)
    if content_match:
        diary['content'] = content_match.group(1)
    else:
        diary['content'] = ""
    
    # Tags
    diary['tags'] = extract_value(content, 'tags', is_array=True)
    
    # Mood
    mood = extract_value(content, 'mood')
    if mood:
        diary['mood'] = mood
    
    # Weather
    weather = extract_value(content, 'weather')
    if weather:
        diary['weather'] = weather
    
    # Timestamps
    created = extract_value(content, 'createdAt')
    diary['createdAt'] = created if created else f"{diary['date']}T00:00:00.000Z"
    
    updated = extract_value(content, 'updatedAt')
    diary['updatedAt'] = updated if updated else diary['createdAt']
    
    # Image
    image = extract_value(content, 'image')
    if image and 'pollinations' not in image:
        diary['image'] = image
    elif diary.get('tags'):
        diary['image'] = get_image(diary['tags'])
    
    return diary if diary.get('id') and diary.get('title') else None

def main():
    all_diaries = []
    
    # 解析所有 TS 文件
    for ts_file in sorted(DATA_DIR.glob("day*.ts")):
        diary = parse_ts_file(ts_file)
        if diary:
            all_diaries.append(diary)
            print(f"✓ {ts_file.name}: {diary['id']} - {diary['title'][:30]}...")
    
    # 去重
    seen = set()
    unique = []
    for d in all_diaries:
        if d['id'] not in seen:
            seen.add(d['id'])
            unique.append(d)
    
    # 按日期排序 (最新的在前)
    unique.sort(key=lambda x: x.get('date', '1970-01-01'), reverse=True)
    
    # 写入
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(unique, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ 合并完成: {len(unique)} 篇日记")
    print(f"📁 保存至: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()