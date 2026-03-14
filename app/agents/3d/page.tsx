'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
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
interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  status: 'online' | 'busy' | 'idle' | 'offline';
  position: [number, number, number];
  color: string;
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

// GLB 龙虾模型 - 只加载一次，放在中心
function GLBLobster({ isWorking }: { isWorking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/3dmodel/space-lobster.glb');
  
  // 动画
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    
    if (isWorking) {
      // 工作状态：轻微晃动
      groupRef.current.rotation.z = Math.sin(time * 8) * 0.03;
      groupRef.current.position.y = Math.sin(time * 2) * 0.05;
    } else {
      // 闲逛状态：缓慢旋转
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
    }
  });

  // 克隆场景避免污染原始资源
  const clonedScene = scene.clone(true);
  
  // 调整模型朝向和缩放
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = -Math.PI / 2; // 调整朝向
      groupRef.current.scale.set(2, 2, 2); // 调整大小
    }
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

// 简化龙虾图标（用于工位）
function LobsterIcon({ 
  position, 
  color = '#ff6b6b',
  scale = 0.5,
  status
}: { 
  position: [number, number, number];
  color?: string;
  scale?: number;
  status: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    
    // 根据状态显示不同动画
    if (status === 'online' || status === 'busy') {
      groupRef.current.rotation.z = Math.sin(time * 8) * 0.05;
      groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.02;
    } else if (status === 'idle') {
      groupRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.05;
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.3;
    }
  });

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
          color={status === 'online' ? '#22c55e' : status === 'busy' ? '#f59e0b' : '#6b7280'}
          emissive={status === 'online' ? '#22c55e' : status === 'busy' ? '#f59e0b' : '#6b7280'}
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
  onClick 
}: { 
  position: [number, number, number];
  agent: Agent;
  onClick: () => void;
}) {
  const getStatusColor = () => {
    switch (agent.status) {
      case 'online': return '#22c55e';
      case 'busy': return '#f59e0b';
      case 'idle': return '#6b7280';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
    }
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
          emissiveIntensity={agent.status === 'offline' ? 0.1 : 0.4} 
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
        status={agent.status}
      />

      {/* 名字标签 */}
      <Html position={[0, 1.1, 0]} center>
        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap cursor-pointer hover:scale-105 transition-transform">
          <span className="text-xl mr-1">{agent.emoji}</span>
          <span className="font-bold text-gray-800">{agent.name}</span>
          <div className="text-xs text-gray-500">{agent.role}</div>
          <div className="text-xs mt-1">
            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
              agent.status === 'online' ? 'bg-green-500' :
              agent.status === 'busy' ? 'bg-yellow-500' :
              agent.status === 'idle' ? 'bg-gray-400' : 'bg-red-500'
            }`}></span>
            {agent.status === 'online' ? '在线工作' :
             agent.status === 'busy' ? '忙碌中' :
             agent.status === 'idle' ? '闲逛中' : '离线'}
          </div>
        </div>
      </Html>
    </group>
  );
}

// 3D 场景
function Scene({ agents, onAgentClick }: { agents: Agent[]; onAgentClick: (id: string) => void }) {
  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#6366f1" />
      <spotLight position={[0, 20, 0]} intensity={0.5} angle={0.5} penumbra={1} />
      
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
      
      {/* 中心 GLB 龙虾 */}
      <Suspense fallback={null}>
        <GLBLobster isWorking={true} />
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
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

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
        <a href="/agents" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-colors">
          <span>←</span>
          <span>返回列表</span>
        </a>
      </div>
      
      {/* 标题 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center">
        <h1 className="text-2xl font-bold text-white">🦞 Agent 3D 工位</h1>
        <p className="text-sm text-purple-300">点击 Agent 查看详情</p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 8, 12], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={<Loader />}>
          <Scene agents={agents} onAgentClick={handleAgentClick} />
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
          <div className="flex items-center gap-2 text-sm">
            <span className={`inline-block w-3 h-3 rounded-full ${
              selectedAgent.status === 'online' ? 'bg-green-500' :
              selectedAgent.status === 'busy' ? 'bg-yellow-500' :
              selectedAgent.status === 'idle' ? 'bg-gray-400' : 'bg-red-500'
            }`}></span>
            <span className="text-gray-600">
              {selectedAgent.status === 'online' ? '在线工作中' :
               selectedAgent.status === 'busy' ? '忙碌中...' :
               selectedAgent.status === 'idle' ? '闲逛休息中' : '离线'}
            </span>
          </div>
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