import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const milestones = [
    // 写作里程碑
    {
      type: 'writing',
      milestones: [
        { id: 'w1', target: 10, label: '起步阶段', emoji: '🌱', reward: '新手徽章' },
        { id: 'w2', target: 50, label: '小有成就', emoji: '🌿', reward: '铜牌徽章' },
        { id: 'w3', target: 100, label: '写作达人', emoji: '🌳', reward: '银牌徽章' },
        { id: 'w4', target: 365, label: '年度坚持', emoji: '🏆', reward: '金牌徽章' },
        { id: 'w5', target: 500, label: '写作大师', emoji: '👑', reward: '钻石徽章' },
        { id: 'w6', target: 1000, label: '传奇作家', emoji: '🌟', reward: '传奇称号' },
      ]
    },
    // 打卡里程碑
    {
      type: 'streak',
      milestones: [
        { id: 's1', target: 7, label: '一周达人', emoji: '🌟', reward: '一周徽章' },
        { id: 's2', target: 30, label: '月度坚持者', emoji: '🌙', reward: '月度徽章' },
        { id: 's3', target: 100, label: '百日英雄', emoji: '💯', reward: '百日徽章' },
        { id: 's4', target: 365, label: '年度传奇', emoji: '🏆', reward: '年度徽章' },
        { id: 's5', target: 500, label: '超级马拉松', emoji: '🚀', reward: '超级徽章' },
        { id: 's6', target: 1000, label: '千年神话', emoji: '👑', reward: '神话称号' },
      ]
    },
    // 心情里程碑
    {
      type: 'mood',
      milestones: [
        { id: 'm1', target: 7, label: '心情稳定', emoji: '😊', reward: '稳定徽章' },
        { id: 'm2', target: 8, label: '积极乐观', emoji: '😄', reward: '乐观徽章' },
        { id: 'm3', target: 9, label: '阳光心情', emoji: '☀️', reward: '阳光徽章' },
        { id: 'm4', target: 9.5, label: '心情达人', emoji: '🌟', reward: '达人徽章' },
        { id: 'm5', target: 9.8, label: '快乐源泉', emoji: '🎉', reward: '快乐徽章' },
        { id: 'm6', target: 10, label: '满分心情', emoji: '👑', reward: '完美称号' },
      ]
    },
    // 探索里程碑
    {
      type: 'explorer',
      milestones: [
        { id: 'e1', target: 5, label: '新手探索', emoji: '🔍', reward: '探索徽章' },
        { id: 'e2', target: 10, label: '功能发现者', emoji: '🗺️', reward: '发现徽章' },
        { id: 'e3', target: 20, label: '功能达人', emoji: '🎯', reward: '达人徽章' },
        { id: 'e4', target: 30, label: '探索先锋', emoji: '🚀', reward: '先锋徽章' },
        { id: 'e5', target: 40, label: '功能大师', emoji: '⭐', reward: '大师徽章' },
        { id: 'e6', target: 50, label: '全能探索者', emoji: '👑', reward: '全能称号' },
      ]
    },
    // 创意里程碑
    {
      type: 'creativity',
      milestones: [
        { id: 'c1', target: 50, label: '创意萌芽', emoji: '🌱', reward: '萌芽徽章' },
        { id: 'c2', target: 100, label: '小有创意', emoji: '💡', reward: '创意徽章' },
        { id: 'c3', target: 200, label: '灵感涌现', emoji: '✨', reward: '灵感徽章' },
        { id: 'c4', target: 500, label: '创意达人', emoji: '🎨', reward: '达人徽章' },
        { id: 'c5', target: 800, label: '创意大师', emoji: '🌟', reward: '大师徽章' },
        { id: 'c6', target: 1000, label: '创意传奇', emoji: '👑', reward: '传奇称号' },
      ]
    },
    // 活跃度里程碑
    {
      type: 'engagement',
      milestones: [
        { id: 'g1', target: 50, label: '初入社区', emoji: '👋', reward: '新人徽章' },
        { id: 'g2', target: 200, label: '活跃分子', emoji: '💬', reward: '活跃徽章' },
        { id: 'g3', target: 500, label: '社交达人', emoji: '🤝', reward: '社交徽章' },
        { id: 'g4', target: 1000, label: '人气之星', emoji: '⭐', reward: '人气徽章' },
        { id: 'g5', target: 2000, label: '社区明星', emoji: '🌟', reward: '明星徽章' },
        { id: 'g6', target: 5000, label: '社区传奇', emoji: '👑', reward: '传奇称号' },
      ]
    },
  ]
  
  return NextResponse.json({
    success: true,
    data: milestones,
    totalMilestones: milestones.reduce((acc, m) => acc + m.milestones.length, 0),
  })
}