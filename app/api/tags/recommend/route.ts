import { NextRequest, NextResponse } from 'next/server';

// 预定义的标签分类和关键词
const tagCategories: Record<string, string[]> = {
  // 情绪相关
  '开心': ['高兴', '快乐', '幸福', '愉快', '开心', '喜悦', '欢乐', '兴奋'],
  '沮丧': ['难过', '悲伤', '沮丧', '失落', '郁闷', '忧伤', '低落'],
  '焦虑': ['焦虑', '担心', '紧张', '不安', '烦躁', '着急', '忐忑'],
  '平静': ['平静', '安宁', '放松', '宁静', '淡定', '从容'],
  '感恩': ['感谢', '感恩', '感激', '温暖', '感动', '幸福'],
  
  // 生活相关
  '工作': ['工作', '上班', '加班', '项目', '会议', '同事', '领导', '任务'],
  '学习': ['学习', '读书', '课程', '知识', '技能', '考试', '成长'],
  '健康': ['健康', '运动', '健身', '跑步', '饮食', '睡眠', '身体'],
  '旅行': ['旅行', '旅游', '出游', '风景', '景点', '度假'],
  '美食': ['美食', '好吃', '餐厅', '做饭', '烹饪', '食物'],
  '家庭': ['家庭', '家人', '父母', '孩子', '亲情', '陪伴'],
  '友情': ['朋友', '友情', '聚会', '聊天', '社交'],
  '爱情': ['爱情', '恋人', '对象', '约会', '浪漫', '感情'],
  
  // 兴趣爱好
  '阅读': ['阅读', '书', '小说', '文学', '读书', '书籍'],
  '音乐': ['音乐', '歌曲', '演唱会', '歌词', '歌手', '播放'],
  '电影': ['电影', '影片', '影院', '剧情', '演员', '导演'],
  '游戏': ['游戏', '玩游戏', '玩家', '通关', '电竞'],
  '摄影': ['摄影', '拍照', '照片', '相机', '镜头', '光影'],
  
  // 时间相关
  '日常': ['日常', '生活', '一天', '今天', '记录'],
  '周末': ['周末', '休息', '假日', '放松'],
  '夜晚': ['夜晚', '晚上', '深夜', '夜', '睡前'],
  '早晨': ['早晨', '早上', '晨', '醒来'],
  
  // 主题相关
  '反思': ['反思', '思考', '感悟', '总结', '回顾', '自省'],
  '目标': ['目标', '计划', '愿望', '理想', '决心', '新年'],
  '创意': ['创意', '灵感', '想法', '创新', '创作'],
  '记忆': ['记忆', '回忆', '往事', '曾经', '怀念'],
  
  // 技术相关
  '编程': ['编程', '代码', '开发', '程序', '软件', '技术', 'bug', 'API'],
  'AI': ['AI', '人工智能', '机器学习', 'ChatGPT', '模型', '算法'],
  '产品': ['产品', '需求', '设计', '用户', '体验', '功能'],
};

// 标签关联关系
const tagRelations: Record<string, string[]> = {
  '开心': ['感恩', '日常', '友情'],
  '沮丧': ['反思', '记忆'],
  '焦虑': ['目标', '反思'],
  '工作': ['目标', '压力', '学习'],
  '学习': ['成长', '目标', '阅读'],
  '健康': ['运动', '日常'],
  '旅行': ['记忆', '摄影', '快乐'],
  '阅读': ['学习', '成长', '反思'],
  '编程': ['AI', '学习', '技术'],
  'AI': ['编程', '学习', '创意'],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, existingTags = [] } = body;
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: '内容不能为空' },
        { status: 400 }
      );
    }
    
    const suggestions: Array<{
      tag: string;
      score: number;
      reason: string;
      relatedTags: string[];
    }> = [];
    
    // 分析内容，匹配标签
    for (const [tag, keywords] of Object.entries(tagCategories)) {
      // 跳过已存在的标签
      if (existingTags.includes(tag)) continue;
      
      // 计算匹配分数
      let matchCount = 0;
      const matchedKeywords: string[] = [];
      
      for (const keyword of keywords) {
        const regex = new RegExp(keyword, 'gi');
        const matches = content.match(regex);
        if (matches) {
          matchCount += matches.length;
          matchedKeywords.push(keyword);
        }
      }
      
      if (matchCount > 0) {
        // 计算置信度分数 (0-100)
        const score = Math.min(100, Math.round((matchCount / 3) * 30 + 30));
        
        // 生成推荐理由
        let reason = '';
        if (matchedKeywords.length === 1) {
          reason = `检测到关键词「${matchedKeywords[0]}」`;
        } else if (matchedKeywords.length <= 3) {
          reason = `检测到关键词「${matchedKeywords.slice(0, 3).join('、')}」`;
        } else {
          reason = `检测到 ${matchedKeywords.length} 个相关关键词`;
        }
        
        // 获取相关标签
        const relatedTags = (tagRelations[tag] || [])
          .filter(t => !existingTags.includes(t) && t !== tag);
        
        suggestions.push({
          tag,
          score,
          reason,
          relatedTags: relatedTags.slice(0, 3)
        });
      }
    }
    
    // 按分数排序，取前 10 个
    suggestions.sort((a, b) => b.score - a.score);
    const topSuggestions = suggestions.slice(0, 10);
    
    return NextResponse.json({
      suggestions: topSuggestions,
      total: suggestions.length,
      analyzed: {
        contentLength: content.length,
        keywordsFound: suggestions.reduce((a, b) => a + Math.ceil(b.score / 10), 0)
      }
    });
  } catch (_error) {
    console.error('Tag recommend error:', _error);
    return NextResponse.json(
      { error: '分析失败' },
      { status: 500 }
    );
  }
}