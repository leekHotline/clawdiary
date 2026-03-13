// Prisma 客户端存根
// 生产环境请配置真正的 Prisma 连接

// 类型定义
interface Achievement {
  id: string;
  userId?: string;
  type: string;
  title: string;
  description?: string;
  unlockedAt?: string;
  [key: string]: unknown;
}

interface FocusRecord {
  id: string;
  userId?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  [key: string]: unknown;
}

interface Diary {
  id: string;
  userId?: string;
  title?: string;
  content?: string;
  createdAt?: string;
  [key: string]: unknown;
}

interface User {
  id: string;
  name?: string;
  email?: string;
  createdAt?: string;
  [key: string]: unknown;
}

// 模拟数据库存储
const mockDb: {
  achievements: Achievement[];
  focus: FocusRecord[];
  diaries: Diary[];
  users: User[];
} = {
  achievements: [],
  focus: [],
  diaries: [],
  users: []
};

// 简单的 Prisma 客户端模拟
export const prisma = {
  achievement: {
    findMany: async () => mockDb.achievements,
    findUnique: async (args: { where: { id: string } }) => 
      mockDb.achievements.find((a) => a.id === args.where.id) || null,
    create: async (args: { data: Achievement }) => {
      mockDb.achievements.push(args.data);
      return args.data;
    },
    update: async (args: { where: { id: string }; data: Partial<Achievement> }) => {
      const index = mockDb.achievements.findIndex((a) => a.id === args.where.id);
      if (index >= 0) {
        mockDb.achievements[index] = { ...mockDb.achievements[index], ...args.data };
        return mockDb.achievements[index];
      }
      return null;
    },
    delete: async (args: { where: { id: string } }) => {
      const index = mockDb.achievements.findIndex((a) => a.id === args.where.id);
      if (index >= 0) {
        mockDb.achievements.splice(index, 1);
        return true;
      }
      return null;
    }
  },
  focus: {
    findMany: async () => mockDb.focus,
    findUnique: async (args: { where: { id: string } }) =>
      mockDb.focus.find((f) => f.id === args.where.id) || null,
    create: async (args: { data: FocusRecord }) => {
      mockDb.focus.push(args.data);
      return args.data;
    },
    update: async (args: { where: { id: string }; data: Partial<FocusRecord> }) => {
      const index = mockDb.focus.findIndex((f) => f.id === args.where.id);
      if (index >= 0) {
        mockDb.focus[index] = { ...mockDb.focus[index], ...args.data };
        return mockDb.focus[index];
      }
      return null;
    },
    delete: async (args: { where: { id: string } }) => {
      const index = mockDb.focus.findIndex((f) => f.id === args.where.id);
      if (index >= 0) {
        mockDb.focus.splice(index, 1);
        return true;
      }
      return null;
    }
  },
  diary: {
    findMany: async () => mockDb.diaries,
    findUnique: async (args: { where: { id: string } }) =>
      mockDb.diaries.find((d) => d.id === args.where.id) || null,
    create: async (args: { data: Diary }) => {
      mockDb.diaries.push(args.data);
      return args.data;
    },
    update: async (args: { where: { id: string }; data: Partial<Diary> }) => {
      const index = mockDb.diaries.findIndex((d) => d.id === args.where.id);
      if (index >= 0) {
        mockDb.diaries[index] = { ...mockDb.diaries[index], ...args.data };
        return mockDb.diaries[index];
      }
      return null;
    }
  },
  user: {
    findMany: async () => mockDb.users,
    findUnique: async (args: { where: { id: string } }) =>
      mockDb.users.find((u) => u.id === args.where.id) || null,
    create: async (args: { data: User }) => {
      mockDb.users.push(args.data);
      return args.data;
    }
  },
  $connect: async () => console.log('Prisma mock connected'),
  $disconnect: async () => console.log('Prisma mock disconnected')
};

export default prisma;