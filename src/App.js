import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, BarChart3, CheckCircle2, Circle, Clock, AlertTriangle, Edit, Trash2, Bell, Repeat, Tag, ChevronDown, ChevronRight } from 'lucide-react';

// TaskItemコンポーネントをTaskManagerAppの外に定義
const TaskItem = ({ task, onToggleStatus, onEdit, onDelete, priorities, statuses }) => {
  const [expanded, setExpanded] = useState(false);
  
  const priorityInfo = priorities.find(p => p.value === task.priority);
  const statusInfo = statuses.find(s => s.value === task.status);
  
  const getDueDateColor = () => {
    if (!task.dueDate || task.status === 'completed') return 'text-gray-500';
    
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const timeDiff = dueDate - now;
    
    if (timeDiff < 0) return 'text-red-600'; // 期限切れ
    if (timeDiff <= 24 * 60 * 60 * 1000) return 'text-orange-600'; // 24時間以内
    if (timeDiff <= 7 * 24 * 60 * 60 * 1000) return 'text-yellow-600'; // 1週間以内
    return 'text-gray-500';
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubtaskProgress = () => {
    if (!task.subtasks || task.subtasks.length === 0) return null;
    const completed = task.subtasks.filter(st => st.completed).length;
    const total = task.subtasks.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const subtaskProgress = getSubtaskProgress();

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggleStatus(task.id)}
          className="mt-1 flex-shrink-0"
        >
          {task.status === 'completed' ? (
            <CheckCircle2 className="text-green-600" size={20} />
          ) : task.status === 'inprogress' ? (
            <Clock className="text-blue-600" size={20} />
          ) : (
            <Circle className="text-gray-400" size={20} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-4 mt-3 text-sm flex-wrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>
                  優先度: {priorityInfo.label}
                </span>

                {task.dueDate && (
                  <span className={`flex items-center gap-1 ${getDueDateColor()}`}>
                    <Clock size={14} />
                    {formatDueDate(task.dueDate)}
                  </span>
                )}

                {task.isRecurring && (
                  <span className="flex items-center gap-1 text-purple-600">
                    <Repeat size={14} />
                    繰り返し
                  </span>
                )}
              </div>

              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {task.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {subtaskProgress && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>サブタスク: {subtaskProgress.completed}/{subtaskProgress.total}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${subtaskProgress.percentage}%` }}
                      />
                    </div>
                    <span>{subtaskProgress.percentage}%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 ml-4">
              {(task.subtasks?.length > 0 || task.notes) && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              )}
              
              <button
                onClick={() => onEdit(task)}
                className="p-1 text-gray-400 hover:text-blue-600"
              >
                <Edit size={16} />
              </button>
              
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          {/* ▼▼▼ ここからが修正・追記した部分 ▼▼▼ */}
          {expanded && (
            <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
              {task.subtasks && task.subtasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">サブタスク</h4>
                  <div className="space-y-1">
                    {task.subtasks.map(subtask => (
                      <div key={subtask.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          readOnly
                          className="rounded"
                        />
                        <span className={subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {task.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">メモ</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                    {task.notes}
                  </p>
                </div>
              )}
            </div>
          )}
          {/* ▲▲▲ ここまでが修正・追記した部分 ▲▲▲ */}
        </div>
      </div>
    </div>
  );
};


const TaskManagerApp = () => {
// localStorageから初期値を読み込む
const [tasks, setTasks] = useState(() => {
  try {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error('タスクの読み込みに失敗しました:', error);
    return [];
  }
});

// tasksが変更されるたびにlocalStorageに保存
useEffect(() => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('タスクの保存に失敗しました:', error);
  }
}, [tasks]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [view, setView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);

  // フォームの状態
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo',
    tags: [],
    isRecurring: false,
    recurringType: 'weekly',
    subtasks: [],
    notes: ''
  });

  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  const priorities = [
    { value: 'low', label: '低', color: 'text-blue-600 bg-blue-50' },
    { value: 'medium', label: '中', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'high', label: '高', color: 'text-red-600 bg-red-50' }
  ];

  const statuses = [
    { value: 'todo', label: '未着手', color: 'text-gray-600 bg-gray-50' },
    { value: 'inprogress', label: '進行中', color: 'text-blue-600 bg-blue-50' },
    { value: 'completed', label: '完了', color: 'text-green-600 bg-green-50' }
  ];

  // タスク作成・更新
  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...formData, id: editingTask.id, updatedAt: now }
          : task
      ));
      setEditingTask(null);
    } else {
      const newTask = {
        ...formData,
        id: Date.now(),
        createdAt: now,
        updatedAt: now
      };
      setTasks([...tasks, newTask]);
    }
    
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'todo',
      tags: [],
      isRecurring: false,
      recurringType: 'weekly',
      subtasks: [],
      notes: ''
    });
  };

  // タスク削除
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // タスク編集
  const editTask = (task) => {
    setFormData(task);
    setEditingTask(task);
    setShowForm(true);
  };

  // ステータス切り替え
  const toggleStatus = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        let newStatus;
        switch (task.status) {
          case 'todo': newStatus = 'inprogress'; break;
          case 'inprogress': newStatus = 'completed'; break;
          case 'completed': newStatus = 'todo'; break;
          default: newStatus = 'todo';
        }
        return { ...task, status: newStatus, updatedAt: new Date() };
      }
      return task;
    }));
  };

  // サブタスク追加
  const addSubtask = () => {
    if (newSubtask.trim()) {
      setFormData({
        ...formData,
        subtasks: [...formData.subtasks, { 
          id: Date.now(), 
          title: newSubtask, 
          completed: false 
        }]
      });
      setNewSubtask('');
    }
  };

  // タグ追加
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag]
      });
      setNewTag('');
    }
  };

  // タグ削除
  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // フィルタリングされたタスク
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const showCompleted = showCompletedTasks || task.status !== 'completed';
    
    return matchesSearch && matchesStatus && matchesPriority && showCompleted;
  });

  // 期限チェック（通知用）
  const checkUpcomingDeadlines = () => {
    const now = new Date();
    const upcoming = tasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      const timeDiff = dueDate - now;
      return timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000; // 24時間以内
    });
    return upcoming;
  };

  // 統計情報
  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'inprogress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    
    return { total, completed, inProgress, todo };
  };

  const stats = getStats();
  const upcomingDeadlines = checkUpcomingDeadlines();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">タスク管理</h1>
            <div className="flex items-center gap-4">
              {upcomingDeadlines.length > 0 && (
                <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-sm">
                  <Bell size={16} />
                  <span>{upcomingDeadlines.length}件の期限間近タスク</span>
                </div>
              )}
              <button
                onClick={() => {
                  resetForm(); // 新規作成時にフォームをリセット
                  setShowForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                新しいタスク
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">総タスク数</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">完了済み</div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">進行中</div>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600">未着手</div>
            <div className="text-2xl font-bold text-gray-600">{stats.todo}</div>
          </div>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="タスクを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">すべてのステータス</option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">すべての優先度</option>
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>{priority.label}</option>
              ))}
            </select>

            <label className="flex items-center justify-end">
              <input
                type="checkbox"
                checked={showCompletedTasks}
                onChange={(e) => setShowCompletedTasks(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">完了タスクを表示</span>
            </label>
          </div>
        </div>

        {/* タスクリスト */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">タスク一覧 ({filteredTasks.length}件)</h2>
          </div>
          
          <div className="divide-y">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                条件に一致するタスクがありません
              </div>
            ) : (
              filteredTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleStatus={toggleStatus}
                  onEdit={editTask}
                  onDelete={deleteTask}
                  priorities={priorities}
                  statuses={statuses}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* タスク作成・編集モーダル */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingTask ? 'タスク編集' : '新しいタスク'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingTask(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="タスクのタイトルを入力"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  詳細
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="タスクの詳細を入力"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    期限
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    優先度
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ステータス
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* タグ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タグ
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="新しいタグを入力"
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    追加
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      <Tag size={14} />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* サブタスク */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  サブタスク
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="サブタスクを入力"
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                  />
                  <button
                    type="button"
                    onClick={addSubtask}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    追加
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            subtasks: formData.subtasks.map(st =>
                              st.id === subtask.id ? {...st, completed: e.target.checked} : st
                            )
                          });
                        }}
                      />
                      <span className={subtask.completed ? 'line-through text-gray-500' : ''}>
                        {subtask.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            subtasks: formData.subtasks.filter(st => st.id !== subtask.id)
                          });
                        }}
                        className="ml-auto text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 繰り返し設定 */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
                  />
                  <Repeat size={16} />
                  繰り返しタスク
                </label>
                {formData.isRecurring && (
                  <select
                    value={formData.recurringType}
                    onChange={(e) => setFormData({...formData, recurringType: e.target.value})}
                    className="mt-2 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="daily">毎日</option>
                    <option value="weekly">毎週</option>
                    <option value="monthly">毎月</option>
                  </select>
                )}
              </div>

              {/* メモ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メモ
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="追加のメモや資料リンクなど"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingTask ? '更新' : '作成'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTask(null);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagerApp;