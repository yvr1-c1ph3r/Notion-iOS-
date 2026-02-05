
import React, { useState, useEffect } from 'react';
import { NotionTask, TaskStatus } from './types';
import { WidgetCard } from './components/WidgetCard';
import { TaskItem } from './components/TaskItem';
import { categorizeTask } from './services/geminiService';

const TodayIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>;
const ScheduledIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>;
const AllIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/></svg>;
const DoneIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>;

const App: React.FC = () => {
  const [tasks, setTasks] = useState<NotionTask[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('すべて');
  const [inputTask, setInputTask] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notionKey, setNotionKey] = useState(localStorage.getItem('notion_key') || '');
  const [notionDbId, setNotionDbId] = useState(localStorage.getItem('notion_db_id') || '');

  // Fetch from Notion (Mocking API call since browser CORS prevents direct Notion API calls)
  const syncWithNotion = async () => {
    if (!notionKey || !notionDbId) return;
    setIsProcessing(true);
    // 実際の実装ではここでバックエンドまたはプロキシ経由で fetch("https://api.notion.com/v1/databases/...") を叩く
    // ここではデモとして同期アクションをシミュレート
    setTimeout(() => {
      const mockData: NotionTask[] = [
        { id: '1', title: 'Notion連携が完了しました', status: TaskStatus.TODO, category: '今日', priority: 'High', dueDate: '今日' },
        { id: '2', title: 'タスクを更新可能', status: TaskStatus.DONE, category: '完了済み', priority: 'Medium' }
      ];
      setTasks(mockData);
      setIsProcessing(false);
    }, 800);
  };

  useEffect(() => {
    syncWithNotion();
  }, []);

  const saveSettings = () => {
    localStorage.setItem('notion_key', notionKey);
    localStorage.setItem('notion_db_id', notionDbId);
    setShowSettings(false);
    syncWithNotion();
  };

  const toggleTask = async (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const newStatus = t.status === TaskStatus.TODO ? TaskStatus.DONE : TaskStatus.TODO;
        // 実際にはここで Notion API (pages/{id}) を PATCH で更新する
        console.log(`Notion Task ${id} status updated to: ${newStatus}`);
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTask.trim() || isProcessing) return;

    setIsProcessing(true);
    const aiData = await categorizeTask(inputTask);
    
    const newTask: NotionTask = {
      id: Date.now().toString(),
      title: inputTask,
      status: TaskStatus.TODO,
      category: aiData.category,
      priority: aiData.priority as any,
      dueDate: aiData.category === '今日' ? '今日' : undefined
    };

    setTasks(prev => [newTask, ...prev]);
    setInputTask('');
    setIsProcessing(false);
    // 実際にはここで Notion API (pages) を POST で作成する
  };

  const filteredTasks = tasks.filter(t => {
    if (activeCategory === 'すべて') return true;
    if (activeCategory === '完了済み') return t.status === TaskStatus.DONE;
    if (activeCategory === '今日') return t.category === '今日' && t.status === TaskStatus.TODO;
    if (activeCategory === '予定あり') return t.category === '予定あり' && t.status === TaskStatus.TODO;
    return t.category === activeCategory;
  });

  const getCount = (cat: string) => {
    if (cat === 'すべて') return tasks.length;
    if (cat === '完了済み') return tasks.filter(t => t.status === TaskStatus.DONE).length;
    if (cat === '今日') return tasks.filter(t => t.category === '今日' && t.status === TaskStatus.TODO).length;
    if (cat === '予定あり') return tasks.filter(t => t.category === '予定あり' && t.status === TaskStatus.TODO).length;
    return 0;
  };

  return (
    <div className="h-screen bg-[#f2f2f7] flex flex-col safe-top safe-bottom">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Notion Widget</h1>
          <p className="text-sm text-gray-500 font-medium">Synced with Database</p>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-full bg-white shadow-sm active:scale-90 transition-transform"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 custom-scrollbar pb-32">
        <div className="grid grid-cols-2 gap-4 mb-8 mt-2">
          <WidgetCard label="今日" count={getCount('今日')} icon={<TodayIcon />} bgColor="bg-blue-500" isActive={activeCategory === '今日'} onClick={() => setActiveCategory('今日')} />
          <WidgetCard label="予定あり" count={getCount('予定あり')} icon={<ScheduledIcon />} bgColor="bg-red-500" isActive={activeCategory === '予定あり'} onClick={() => setActiveCategory('予定あり')} />
          <WidgetCard label="すべて" count={getCount('すべて')} icon={<AllIcon />} bgColor="bg-gray-700" isActive={activeCategory === 'すべて'} onClick={() => setActiveCategory('すべて')} />
          <WidgetCard label="完了済み" count={getCount('完了済み')} icon={<DoneIcon />} bgColor="bg-gray-400" isActive={activeCategory === '完了済み'} onClick={() => setActiveCategory('完了済み')} />
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-6">
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">{activeCategory}</h2>
            <button onClick={syncWithNotion} className="text-blue-500 text-sm font-medium">更新</button>
          </div>
          {filteredTasks.length > 0 ? (
            <div className="flex flex-col">
              {filteredTasks.map(task => <TaskItem key={task.id} task={task} onToggle={toggleTask} />)}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-gray-300">
              <p className="text-sm">タスクはありません</p>
            </div>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 ios-blur border-t border-gray-100 safe-bottom">
        <form onSubmit={handleAddTask} className="flex gap-2 items-center mb-4">
          <input 
            type="text" 
            value={inputTask}
            onChange={(e) => setInputTask(e.target.value)}
            placeholder="新しいタスク..." 
            className="flex-1 bg-gray-100 rounded-full py-2.5 px-5 text-sm focus:outline-none"
          />
          <button 
            type="submit"
            disabled={isProcessing || !inputTask.trim()}
            className="bg-blue-500 text-white p-2.5 rounded-full disabled:opacity-50"
          >
            {isProcessing ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" /></svg>}
          </button>
        </form>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 ios-blur">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-center">Notion 設定</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Internal Integration Token</label>
                <input 
                  type="password" 
                  value={notionKey} 
                  onChange={e => setNotionKey(e.target.value)}
                  placeholder="secret_..."
                  className="w-full mt-1 bg-gray-100 rounded-xl p-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Database ID</label>
                <input 
                  type="text" 
                  value={notionDbId} 
                  onChange={e => setNotionDbId(e.target.value)}
                  placeholder="32桁の英数字"
                  className="w-full mt-1 bg-gray-100 rounded-xl p-3 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <button 
                onClick={saveSettings}
                className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl active:scale-95 transition-transform"
              >
                保存して同期
              </button>
              <button 
                onClick={() => setShowSettings(false)}
                className="w-full text-gray-400 text-sm font-medium"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
