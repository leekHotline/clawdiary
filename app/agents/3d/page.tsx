'use client';

import Link from 'next/link';
import { Suspense, useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Html, 
  useGLTF,
  RoundedBox,
  Text,
  Float,
  Sparkles,
  Clone
} from '@react-three/drei';
import * as THREE from 'three';

// Agent 数据类型
interface AgentActivity {
  status: 'idle' | 'active' | 'working' | 'speaking';
  message: string;
  lastActive: number;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  status: 'online' | 'busy' | 'idle' | 'offline';
  position: [number, number, number];
  color: string;
}

// 实时状态 API 响应
interface ActivityState {
  lastUpdate: number;
  agents: Record<string, AgentActivity>;
}

// 默认 Agent 数据
const defaultAgents: Agent[] = [
  { id: 'leek', name: 'LeekClawBot', role: '编码专家', emoji: '🦞', status: 'online', position: [-4, 0, 0], color: '#6366f1' },
  { id: 'write', name: 'writeClawBot', role: '文案专家', emoji: '✍️', status: 'busy', position: [-2, 0, 3.5], color: '#8b5cf6' },
  { id: 'market', name: 'marketCmoBot', role: '市场专家', emoji: '📈', status: 'online', position: [2, 0, 3.5], color: '#a855f7' },
  { id: 'search', name: 'searchdataClawBot', role: '数据专家', emoji: '🔍', status: 'idle', position: [4, 0, 0], color: '#d946ef' },
  { id: 'evolution', name: 'evolutionClawBot', role: '进化专家', emoji: '🧬', status: 'online', position: [2, 0, -3.5], color: '#ec4899' },
  { id: 'review', name: 'reviewClawdBot', role: '审查专家', emoji: '✅', status: 'idle', position: [-2, 0, -3.5], color: '#f43f5e' },
];

// 默认 activity 对象（使用固定时间戳避免渲染期间调用 Date.now()）
const defaultActivity: AgentActivity = { status: 'idle', message: '', lastActive: 0 };

// GLB 龙虾模型 - 中心主角
function GLBLobster({ activity }: { activity: AgentActivity }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/3dmodel/space-lobster.glb');
  const [targetRotation, setTargetRotation] = useState(0);
  
  // 克隆场景避免污染原始资源
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // 动画
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    
    // 根据活动状态显示不同动画
    if (activity.status === 'speaking') {
      // 说话：点头 + 摇摆
      groupRef.current.rotation.x = Math.sin(time * 10) * 0.1;
      groupRef.current.rotation.z = Math.sin(time * 8) * 0.05;
      groupRef.current.position.y = 0.5 + Math.sin(time * 3) * 0.08;
      // 左右看
      groupRef.current.rotation.y = -Math.PI / 2 + Math.sin(time * 2) * 0.3;
    } else if (activity.status === 'working') {
      // 工作：专注点头
      groupRef.current.rotation.x = 0.3 + Math.sin(time * 12) * 0.05;
      groupRef.current.rotation.z = Math.sin(time * 6) * 0.03;
      groupRef.current.position.y = 0.5 + Math.sin(time * 4) * 0.03;
    } else if (activity.status === 'active') {
      // 活跃：四处走动
      groupRef.current.position.x = Math.sin(time * 0.5) * 0.5;
      groupRef.current.position.z = Math.cos(time * 0.5) * 0.5;
      groupRef.current.position.y = 0.5 + Math.sin(time * 2) * 0.1;
      groupRef.current.rotation.y = -Math.PI / 2 + time * 0.5;
    } else {
      // 空闲：轻微呼吸
      groupRef.current.rotation.z = Math.sin(time * 2) * 0.02;
      groupRef.current.position.y = 0.5 + Math.sin(time * 1.5) * 0.03;
      groupRef.current.rotation.y = -Math.PI / 2 + Math.sin(time * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]} scale={2}>
      <primitive object={clonedScene} />
      
      {/* 状态指示器 */}
      {activity.status !== 'idle' && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial 
            color={activity.status === 'speaking' ? '#22c55e' : 
                   activity.status === 'working' ? '#f59e0b' : '#3b82f6'}
            emissive={activity.status === 'speaking' ? '#22c55e' : 
                      activity.status === 'working' ? '#f59e0b' : '#3b82f6'}
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
      
      {/* 消息气泡 */}
      {activity.message && (
        <Html position={[0, 2.5, 0]} center>
          <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg max-w-[200px] text-center">
            <p className="text-sm text-gray-800">{activity.message}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// 简化龙虾图标（用于工位）
function LobsterIcon({ 
  position, 
  color = '#ff6b6b',
  scale = 0.5,
  activity
}: { 
  position: [number, number, number];
  color?: string;
  scale?: number;
  activity: AgentActivity;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    
    // 根据活动状态显示不同动画
    if (activity.status === 'speaking' || activity.status === 'active') {
      // 活跃：跳动
      groupRef.current.rotation.z = Math.sin(time * 10) * 0.1;
      groupRef.current.position.y = position[1] + Math.abs(Math.sin(time * 5)) * 0.2;
      groupRef.current.rotation.y = time * 2;
    } else if (activity.status === 'working') {
      // 工作：专注摇摆
      groupRef.current.rotation.z = Math.sin(time * 6) * 0.05;
      groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.03;
    } else {
      // 空闲
      groupRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.05;
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.3;
    }
  });

  const statusColor = activity.status === 'speaking' ? '#22c55e' : 
                      activity.status === 'working' ? '#f59e0b' : 
                      activity.status === 'active' ? '#3b82f6' : '#6b7280';

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* 简化龙虾图标 - 球体 + 大钳子 */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.3} />
      </mesh>
      
      {/* 眼睛 */}
      <mesh position={[-0.1, 0.2, 0.2]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.1, 0.2, 0.2]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      
      {/* 大钳子 */}
      <mesh position={[-0.4, 0, 0.1]} rotation={[0, 0, -0.5]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#c92a2a" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0.4, 0, 0.1]} rotation={[0, 0, 0.5]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#c92a2a" roughness={0.4} metalness={0.3} />
      </mesh>
      
      {/* 状态指示 */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial 
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

// 工位组件
function Workstation({ 
  position, 
  agent,
  activity,
  onClick 
}: { 
  position: [number, number, number];
  agent: Agent;
  activity: AgentActivity;
  onClick: () => void;
}) {
  const getStatusColor = () => {
    if (activity.status === 'speaking') return '#22c55e';
    if (activity.status === 'working') return '#f59e0b';
    if (activity.status === 'active') return '#3b82f6';
    return '#6b7280';
  };

  const getStatusText = () => {
    if (activity.status === 'speaking') return '正在对话';
    if (activity.status === 'working') return '工作中';
    if (activity.status === 'active') return '活跃中';
    return '空闲';
  };

  return (
    <group position={position} onClick={onClick}>
      {/* 桌子 */}
      <RoundedBox args={[1.6, 0.08, 1]} radius={0.02} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1e293b" />
      </RoundedBox>
      
      {/* 桌腿 */}
      {[
        [-0.7, -0.35, 0.4],
        [0.7, -0.35, 0.4],
        [-0.7, -0.35, -0.4],
        [0.7, -0.35, -0.4]
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      ))}

      {/* 显示器 */}
      <RoundedBox args={[1.2, 0.75, 0.06]} radius={0.02} position={[0, 0.5, -0.3]}>
        <meshStandardMaterial color="#0f172a" />
      </RoundedBox>
      
      {/* 屏幕 */}
      <RoundedBox args={[1.1, 0.65, 0.01]} radius={0.01} position={[0, 0.5, -0.26]}>
        <meshStandardMaterial 
          color={getStatusColor()} 
          emissive={getStatusColor()} 
          emissiveIntensity={activity.status === 'idle' ? 0.1 : 0.5} 
        />
      </RoundedBox>

      {/* 显示器支架 */}
      <mesh position={[0, 0.15, -0.35]}>
        <cylinderGeometry args={[0.03, 0.05, 0.15, 8]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      <mesh position={[0, 0.06, -0.35]}>
        <boxGeometry args={[0.25, 0.02, 0.12]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>

      {/* 键盘 */}
      <RoundedBox args={[0.5, 0.02, 0.2]} radius={0.01} position={[0, 0.05, 0.2]}>
        <meshStandardMaterial color="#1e293b" />
      </RoundedBox>

      {/* 简化龙虾 Agent */}
      <LobsterIcon 
        position={[0, 0.15, 0.5]} 
        color={agent.color}
        scale={0.4}
        activity={activity}
      />

      {/* 名字标签 */}
      <Html position={[0, 1.1, 0]} center>
        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap cursor-pointer hover:scale-105 transition-transform">
          <span className="text-xl mr-1">{agent.emoji}</span>
          <span className="font-bold text-gray-800">{agent.name}</span>
          <div className="text-xs text-gray-500">{agent.role}</div>
          <div className="text-xs mt-1">
            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
              activity.status === 'speaking' ? 'bg-green-500' :
              activity.status === 'working' ? 'bg-yellow-500' :
              activity.status === 'active' ? 'bg-blue-500' : 'bg-gray-400'
            }`}></span>
            {getStatusText()}
          </div>
          {/* 实时消息 */}
          {activity.message && (
            <div className="mt-1 p-1 bg-purple-50 rounded text-xs text-purple-700 max-w-[150px] truncate">
              💬 {activity.message}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

// 3D 场景
function Scene({ 
  agents, 
  activities, 
  onAgentClick 
}: { 
  agents: Agent[]; 
  activities: Record<string, AgentActivity>;
  onAgentClick: (id: string) => void;
}) {
  return (
    <>
      {/* 全局光照 */}
      <ambientLight intensity={0.6} />
      <hemisphereLight 
        args={['#87CEEB', '#362312', 0.8]} 
        position={[0, 50, 0]} 
      />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight 
        position={[-10, 15, -10]} 
        intensity={0.8} 
        color="#6366f1" 
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#a855f7" />
      <pointLight position={[5, 3, 5]} intensity={0.3} color="#ff6b6b" />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#22c55e" />
      
      {/* 地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]}>
        <circleGeometry args={[15, 64]} />
        <meshStandardMaterial color="#0f0a1e" transparent opacity={0.8} />
      </mesh>
      
      {/* 网格 */}
      <gridHelper args={[30, 60, "#4f46e5", "#2e1065"]} position={[0, -0.69, 0]} />
      
      {/* 中心装饰 */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group position={[0, 3, 0]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.5}
            color="#a855f7"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            🦞 Claw Diary
          </Text>
          <Text
            position={[0, -0.4, 0]}
            fontSize={0.18}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            Agent 协作空间
          </Text>
        </group>
      </Float>
      
      {/* 中心 GLB 龙虾 - 实时状态 */}
      <Suspense fallback={null}>
        <GLBLobster activity={activities.lobster || defaultActivity} />
      </Suspense>
      
      {/* Agent 工位 - 圆形排列 */}
      {agents.map((agent, index) => {
        const angle = (index / agents.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <Workstation
            key={agent.id}
            position={[x, 0, z]}
            agent={agent}
            activity={activities[agent.id] || defaultActivity}
            onClick={() => onAgentClick(agent.id)}
          />
        );
      })}
      
      {/* 星星粒子效果 */}
      <Sparkles count={100} scale={15} size={2} speed={0.4} opacity={0.5} color="#a855f7" />
    </>
  );
}

// 加载中组件
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        <p className="mt-4 text-white">加载龙虾模型...</p>
      </div>
    </Html>
  );
}

// 主页面
export default function Agent3DPage() {
  const [agents] = useState<Agent[]>(defaultAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activities, setActivities] = useState<Record<string, AgentActivity>>({});
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [timeAgo, setTimeAgo] = useState<string>('未连接');

  // 轮询获取实时状态
  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch('/api/agent-activity');
      const data = await res.json();
      if (data.success) {
        setActivities(data.agents);
        setLastUpdate(data.lastUpdate);
        setIsConnected(true);
      }
    } catch (error) {
      setIsConnected(false);
    }
  }, []);

  // 每 2 秒轮询一次
  useEffect(() => {
    // 使用 setTimeout 避免在 effect 中同步调用 fetchActivity
    const timeoutId = setTimeout(() => fetchActivity(), 0);
    const interval = setInterval(fetchActivity, 2000);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [fetchActivity]);

  // 更新时间显示（避免在渲染期间调用 Date.now()）
  useEffect(() => {
    const updateTime = () => {
      if (!lastUpdate) {
        setTimeAgo('未连接');
        return;
      }
      const seconds = Math.floor((Date.now() - lastUpdate) / 1000);
      if (seconds < 60) setTimeAgo(`${seconds}秒前`);
      else setTimeAgo(`${Math.floor(seconds / 60)}分钟前`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  const handleAgentClick = (id: string) => {
    const agent = agents.find(a => a.id === id);
    if (agent) {
      setSelectedAgent(agent);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* 顶部导航 */}
      <div className="absolute top-4 left-4 z-10">
        <Link href="/agents" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-colors">
          <span>←</span>
          <span>返回列表</span>
        </Link>
      </div>
      
      {/* 标题和实时状态 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center">
        <h1 className="text-2xl font-bold text-white">🦞 Agent 3D 工位</h1>
        <p className="text-sm text-purple-300">点击 Agent 查看详情</p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
          <span className="text-xs text-gray-400">实时状态: {timeAgo}</span>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 8, 12], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={<Loader />}>
          <Scene agents={agents} activities={activities} onAgentClick={handleAgentClick} />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2.1}
          />
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* Agent 详情弹窗 */}
      {selectedAgent && (
        <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl max-w-xs">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {selectedAgent.emoji} {selectedAgent.name}
              </h3>
              <p className="text-sm text-gray-500">{selectedAgent.role}</p>
            </div>
            <button 
              onClick={() => setSelectedAgent(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          {/* 实时状态 */}
          {activities[selectedAgent.id] && (
            <div className="mb-3 p-2 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <span className={`inline-block w-2 h-2 rounded-full ${
                  activities[selectedAgent.id].status === 'speaking' ? 'bg-green-500' :
                  activities[selectedAgent.id].status === 'working' ? 'bg-yellow-500' :
                  activities[selectedAgent.id].status === 'active' ? 'bg-blue-500' : 'bg-gray-400'
                }`}></span>
                <span className="text-gray-600 capitalize">{activities[selectedAgent.id].status}</span>
              </div>
              {activities[selectedAgent.id].message && (
                <p className="text-xs text-purple-700 mt-1">💬 {activities[selectedAgent.id].message}</p>
              )}
            </div>
          )}
          
          <button 
            onClick={() => window.location.href = `/agents/${selectedAgent.id}`}
            className="mt-3 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            查看详情页
          </button>
        </div>
      )}

      {/* 操作提示 */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm">
        <p>🖱️ 拖拽旋转 | 滚轮缩放 | 点击 Agent 查看详情</p>
      </div>
    </div>
  );
}