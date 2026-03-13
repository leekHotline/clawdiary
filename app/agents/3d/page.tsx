"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Box, OrbitControls, Html, Cylinder, Sphere, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";

interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  status: 'online' | 'busy' | 'idle' | 'offline';
  currentTask?: {
    id: string;
    title: string;
    progress: number;
  };
  capabilities: string[];
}

// Agent 3D 形象组件
function AgentAvatar({ agent, position, onClick }: { agent: Agent; position: [number, number, number]; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const agentRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // 根据状态设置颜色
  const getStatusColor = () => {
    switch (agent.status) {
      case 'online': return '#22c55e';
      case 'busy': return '#eab308';
      case 'idle': return '#9ca3af';
      case 'offline': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  // 动画
  useFrame((state) => {
    if (groupRef.current && agentRef.current) {
      // 忙碌时：坐在桌前，轻微晃动（打字效果）
      if (agent.status === 'busy') {
        agentRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.05;
        agentRef.current.position.x = 0;
        agentRef.current.position.z = 0.3;
      }
      // 空闲时：站起来在旁边走动
      else if (agent.status === 'idle') {
        const walkAngle = state.clock.elapsedTime * 0.5;
        const walkRadius = 1.5;
        agentRef.current.position.x = Math.sin(walkAngle) * walkRadius;
        agentRef.current.position.z = Math.cos(walkAngle) * walkRadius + 0.5;
        agentRef.current.rotation.y = walkAngle + Math.PI;
        // 走路时的上下浮动
        agentRef.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * 4)) * 0.05;
      }
      // 在线时：坐在桌前工作
      else if (agent.status === 'online') {
        agentRef.current.position.x = 0;
        agentRef.current.position.z = 0.3;
        agentRef.current.position.y = 0;
        agentRef.current.rotation.y = 0;
      }
      // 离线：不在场景中（或者躺在桌子上）
      else {
        agentRef.current.position.y = -0.5; // 隐藏到地下
      }
    }
  });

  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      {/* 办公桌 */}
      <RoundedBox args={[2, 0.1, 1.2]} radius={0.05} position={[0, 0, 0]}>
        <meshStandardMaterial color={hovered ? "#6366f1" : "#1e293b"} />
      </RoundedBox>
      
      {/* 桌腿 */}
      <Cylinder args={[0.05, 0.05, 0.7]} position={[-0.8, -0.35, 0.4]}>
        <meshStandardMaterial color="#374151" />
      </Cylinder>
      <Cylinder args={[0.05, 0.05, 0.7]} position={[0.8, -0.35, 0.4]}>
        <meshStandardMaterial color="#374151" />
      </Cylinder>
      <Cylinder args={[0.05, 0.05, 0.7]} position={[-0.8, -0.35, -0.4]}>
        <meshStandardMaterial color="#374151" />
      </Cylinder>
      <Cylinder args={[0.05, 0.05, 0.7]} position={[0.8, -0.35, -0.4]}>
        <meshStandardMaterial color="#374151" />
      </Cylinder>

      {/* 显示器 */}
      <RoundedBox args={[1.4, 0.9, 0.08]} radius={0.02} position={[0, 0.55, -0.35]}>
        <meshStandardMaterial color="#1e293b" />
      </RoundedBox>
      
      {/* 屏幕内容 - 根据状态显示 */}
      <RoundedBox args={[1.3, 0.8, 0.01]} radius={0.01} position={[0, 0.55, -0.3]}>
        <meshStandardMaterial 
          color={getStatusColor()} 
          emissive={getStatusColor()} 
          emissiveIntensity={agent.status === 'offline' ? 0.1 : 0.5} 
        />
      </RoundedBox>

      {/* 显示器支架 */}
      <Cylinder args={[0.05, 0.08, 0.2]} position={[0, 0.15, -0.4]}>
        <meshStandardMaterial color="#4b5563" />
      </Cylinder>
      <Box args={[0.3, 0.02, 0.15]} position={[0, 0.05, -0.4]}>
        <meshStandardMaterial color="#4b5563" />
      </Box>

      {/* Agent 身体 - 根据状态有不同行为 */}
      <group ref={agentRef} position={[0, 0.6, 0.3]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        {/* 头部 */}
        <Sphere args={[0.25]} position={[0, 0.4, 0]}>
          <meshStandardMaterial color="#6366f1" />
        </Sphere>
        
        {/* 眼睛 */}
        <Sphere args={[0.05]} position={[-0.08, 0.45, 0.2]}>
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.8} />
        </Sphere>
        <Sphere args={[0.05]} position={[0.08, 0.45, 0.2]}>
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.8} />
        </Sphere>
        
        {/* 身体 */}
        <Cylinder args={[0.2, 0.25, 0.4]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#8b5cf6" />
        </Cylinder>
        
        {/* 手臂 - 空闲时摆动 */}
        <Cylinder args={[0.05, 0.05, 0.3]} position={[-0.35, 0.05, 0]} rotation={[agent.status === 'idle' ? Math.sin(Date.now() * 0.001) * 0.3 : 0, 0, Math.PI / 6]}>
          <meshStandardMaterial color="#a78bfa" />
        </Cylinder>
        <Cylinder args={[0.05, 0.05, 0.3]} position={[0.35, 0.05, 0]} rotation={[agent.status === 'idle' ? -Math.sin(Date.now() * 0.001) * 0.3 : 0, 0, -Math.PI / 6]}>
          <meshStandardMaterial color="#a78bfa" />
        </Cylinder>
        
        {/* 腿 - 空闲走动时可见 */}
        {agent.status === 'idle' && (
          <>
            <Cylinder args={[0.06, 0.06, 0.4]} position={[-0.1, -0.35, 0]}>
              <meshStandardMaterial color="#a78bfa" />
            </Cylinder>
            <Cylinder args={[0.06, 0.06, 0.4]} position={[0.1, -0.35, 0]}>
              <meshStandardMaterial color="#a78bfa" />
            </Cylinder>
          </>
        )}
      </group>

      {/* 状态指示灯 */}
      <mesh position={[0.85, 0.55, -0.28]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial 
          color={getStatusColor()} 
          emissive={getStatusColor()} 
          emissiveIntensity={0.8} 
        />
      </mesh>

      {/* 名字标签 */}
      <Html position={[0, 1.3, 0]} center>
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg whitespace-nowrap">
          <span className="text-lg mr-1">{agent.emoji}</span>
          <span className="font-bold text-gray-800">{agent.name}</span>
          <div className="text-xs text-gray-500">{agent.role}</div>
          {agent.status === 'idle' && <div className="text-xs text-gray-400">🚶 闲逛中...</div>}
        </div>
      </Html>
    </group>
  );
}

// 3D 场景
function Scene({ agents, onAgentClick }: { agents: Agent[]; onAgentClick: (id: string) => void }) {
  // 计算 Agent 位置（圆形排列）
  const getAgentPosition = (index: number, total: number): [number, number, number] => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const radius = 5;
    return [
      Math.cos(angle) * radius,
      0.35, // 桌子高度
      Math.sin(angle) * radius
    ];
  };

  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#6366f1" />
      <spotLight position={[0, 15, 0]} intensity={0.3} angle={0.5} />
      
      {/* 地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]}>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial color="#1e1b4b" transparent opacity={0.3} />
      </mesh>
      
      {/* 地板网格 */}
      <gridHelper args={[20, 40, "#4f46e5", "#312e81"]} position={[0, -0.34, 0]} />
      
      {/* 中心装饰 */}
      <group position={[0, 0, 0]}>
        <Cylinder args={[1.5, 1.5, 0.1, 32]} position={[0, -0.3, 0]}>
          <meshStandardMaterial color="#4f46e5" transparent opacity={0.5} />
        </Cylinder>
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.4}
          color="#a855f7"
          anchorX="center"
          anchorY="middle"
        >
          🦞 Claw Diary
        </Text>
        <Text
          position={[0, 1.1, 0]}
          fontSize={0.15}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          Agent 协作空间
        </Text>
      </group>
      
      {/* Agent 工位 */}
      {agents.map((agent, index) => (
        <AgentAvatar
          key={agent.id}
          agent={agent}
          position={getAgentPosition(index, agents.length)}
          onClick={() => onAgentClick(agent.id)}
        />
      ))}
      
      {/* 相机控制 */}
      <OrbitControls 
        enablePan={true}
        minDistance={5}
        maxDistance={20}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
      />
    </>
  );
}

export default function Agent3DPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 5000); // 每5秒刷新
    return () => clearInterval(interval);
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agents');
      const data = await res.json();
      if (data.success) {
        setAgents(data.data.agents);
        setLastUpdate(new Date().toLocaleTimeString('zh-CN'));
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
      {/* 头部导航 */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white hover:text-indigo-300 transition-colors">
              ← 返回首页
            </Link>
            <div className="h-4 w-px bg-gray-600" />
            <span className="text-gray-400 text-sm">实时状态</span>
            <span className="text-green-400 text-sm">{lastUpdate && `更新于 ${lastUpdate}`}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/agents/dashboard" className="text-gray-300 hover:text-white text-sm bg-white/10 px-3 py-1 rounded-lg">
              📊 仪表盘
            </Link>
            <Link href="/workflows" className="text-gray-300 hover:text-white text-sm bg-white/10 px-3 py-1 rounded-lg">
              🔄 工作流
            </Link>
          </div>
        </div>
      </div>

      {/* 3D 画布 */}
      <div className="h-screen">
        <Canvas
          camera={{ position: [0, 8, 12], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <Scene 
            agents={agents} 
            onAgentClick={(id) => {
              const agent = agents.find(a => a.id === id);
              setSelectedAgent(agent || null);
            }}
          />
        </Canvas>
      </div>

      {/* Agent 详情面板 */}
      {selectedAgent && (
        <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{selectedAgent.emoji}</span>
              <div>
                <h3 className="text-white text-xl font-bold">{selectedAgent.name}</h3>
                <p className="text-indigo-400">{selectedAgent.role}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedAgent(null)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* 状态 */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-slate-700/50 rounded-xl">
            <span className={`w-3 h-3 rounded-full ${
              selectedAgent.status === 'online' ? 'bg-green-500 animate-pulse' :
              selectedAgent.status === 'busy' ? 'bg-yellow-500 animate-pulse' :
              selectedAgent.status === 'idle' ? 'bg-gray-400' : 'bg-red-500'
            }`} />
            <span className="text-white font-medium">
              {selectedAgent.status === 'online' ? '🟢 在线工作中' :
               selectedAgent.status === 'busy' ? '🟡 忙碌中' :
               selectedAgent.status === 'idle' ? '⚪ 空闲等待' : '🔴 离线'}
            </span>
          </div>
          
          {/* 当前任务 */}
          {selectedAgent.currentTask && (
            <div className="mb-4 p-3 bg-indigo-900/30 rounded-xl border border-indigo-500/30">
              <div className="text-sm text-gray-400 mb-1">当前任务</div>
              <div className="text-white font-medium mb-2">{selectedAgent.currentTask.title}</div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${selectedAgent.currentTask.progress}%` }}
                />
              </div>
              <div className="text-right text-sm text-gray-400 mt-1">{selectedAgent.currentTask.progress}%</div>
            </div>
          )}
          
          {/* 能力标签 */}
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-2">能力标签</div>
            <div className="flex flex-wrap gap-2">
              {selectedAgent.capabilities.map((cap) => (
                <span key={cap} className="text-sm px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                  {cap}
                </span>
              ))}
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Link 
              href={`/agents/workspace?id=${selectedAgent.id}`}
              className="flex-1 py-2 text-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              查看详情
            </Link>
            <button 
              onClick={() => setSelectedAgent(null)}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 底部提示 */}
      <div className="absolute bottom-6 left-6 text-gray-500 text-xs flex items-center gap-4">
        <span>🖱️ 拖动旋转</span>
        <span>🔍 滚轮缩放</span>
        <span>👆 点击工位查看详情</span>
      </div>
    </div>
  );
}