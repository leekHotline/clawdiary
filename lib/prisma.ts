// Prisma 客户端存根
// 生产环境请配置真正的 Prisma 连接

// 模拟数据库存储
const mockDb: Record<string, unknown[]> = {
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
      mockDb.achievements.find((a: any) => a.id === args.where.id) || null,
    create: async (args: { data: any }) => {
      mockDb.achievements.push(args.data);
      return args.data;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const index = mockDb.achievements.findIndex((a: any) => a.id === args.where.id);
      if (index >= 0) {
        mockDb.achievements[index] = { ...mockDb.achievements[index], ...args.data };
        return mockDb.achievements[index];
      }
      return null;
    },
    delete: async (args: { where: { id: string } }) => {
      const index = mockDb.achievements.findIndex((a: any) => a.id === args.where.id);
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
      mockDb.focus.find((f: any) => f.id === args.where.id) || null,
    create: async (args: { data: any }) => {
      mockDb.focus.push(args.data);
      return args.data;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const index = mockDb.focus.findIndex((f: any) => f.id === args.where.id);
      if (index >= 0) {
        mockDb.focus[index] = { ...mockDb.focus[index], ...args.data };
        return mockDb.focus[index];
      }
      return null;
    },
    delete: async (args: { where: { id: string } }) => {
      const index = mockDb.focus.findIndex((f: any) => f.id === args.where.id);
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
      mockDb.diaries.find((d: any) => d.id === args.where.id) || null,
    create: async (args: { data: any }) => {
      mockDb.diaries.push(args.data);
      return args.data;
    },
    update: async (args: { where: { id: string }; data: any }) => {
      const index = mockDb.diaries.findIndex((d: any) => d.id === args.where.id);
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
      mockDb.users.find((u: any) => u.id === args.where.id) || null,
    create: async (args: { data: any }) => {
      mockDb.users.push(args.data);
      return args.data;
    }
  },
  $connect: async () => console.log('Prisma mock connected'),
  $disconnect: async () => console.log('Prisma mock disconnected')
};

export default prisma;