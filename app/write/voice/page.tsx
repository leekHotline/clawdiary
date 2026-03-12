'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VoiceDiaryPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(0);
  const [processing, setProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('无法访问麦克风:', err);
      alert('无法访问麦克风，请检查权限设置');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const transcribeAudio = async () => {
    setProcessing(true);
    // Simulate transcription
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTranscript(`这是一个语音日记的转录示例。

今天我想记录一下我的想法和感受...

[AI 自动识别的内容会显示在这里]`);
    setProcessing(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/my/diaries');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            🎙️ 语音日记
          </h1>
          <p className="text-gray-600 mt-1">用声音记录你的想法</p>
        </div>

        {/* Recording Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* Recording Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {isRecording ? (
                <div className="text-white text-4xl">⏹</div>
              ) : (
                <div className="text-white text-4xl">🎤</div>
              )}
            </button>

            {/* Duration / Status */}
            <div className="mt-6 text-center">
              {isRecording ? (
                <div className="text-2xl font-mono text-red-500">{formatDuration(duration)}</div>
              ) : audioURL ? (
                <div className="text-lg text-gray-600">录制完成 ({formatDuration(duration)})</div>
              ) : (
                <div className="text-lg text-gray-500">点击开始录音</div>
              )}
            </div>

            {/* Audio Preview */}
            {audioURL && (
              <div className="mt-6 w-full">
                <audio
                  controls
                  src={audioURL}
                  className="w-full"
                />
              </div>
            )}

            {/* Transcribe Button */}
            {audioURL && !transcript && (
              <button
                onClick={transcribeAudio}
                disabled={processing}
                className="mt-6 px-6 py-3 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-colors disabled:opacity-50"
              >
                {processing ? '🔄 转录中...' : '✨ AI 转文字'}
              </button>
            )}
          </div>
        </div>

        {/* Transcription Result */}
        {transcript && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">📝 转录结果</h2>
              <button className="text-sm text-orange-600 hover:text-orange-800">
                ✏️ 编辑
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 prose prose-gray max-w-none">
              {transcript}
            </div>
            
            {/* Title */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                日记标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
                placeholder="为这篇语音日记起个标题"
              />
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-orange-50 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-orange-800 mb-3">💡 录音小技巧</h3>
          <ul className="space-y-2 text-sm text-orange-700">
            <li>• 在安静的环境下录音，效果更佳</li>
            <li>• 距离麦克风 10-20 厘米最佳</li>
            <li>• 可以暂停思考，AI 会自动去除静音部分</li>
            <li>• 录制完成后可以编辑转录文字</li>
          </ul>
        </div>

        {/* Actions */}
        {transcript && (
          <div className="flex gap-4">
            <button
              onClick={() => {
                setAudioURL(null);
                setTranscript('');
                setDuration(0);
                setTitle('');
              }}
              className="flex-1 px-6 py-4 border rounded-xl hover:bg-gray-50 transition-colors"
            >
              🔄 重新录制
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
            >
              💾 保存日记
            </button>
          </div>
        )}
      </div>
    </div>
  );
}