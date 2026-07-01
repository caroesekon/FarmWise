import { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { getTasks, createTask, updateTask } from '../api/taskApi';
import { TASK_CATEGORIES } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import { Plus, CheckCircle, Circle } from 'lucide-react';
import clsx from 'clsx';

const priorityBadge = { low: 'info', medium: 'warning', high: 'warning', critical: 'danger' };

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'other', priority: 'medium', dueDate: '', description: '' });

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await getTasks({ limit: 100 });
      setTasks(res.data.data);
    } catch {} finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTask(form);
      setShowForm(false);
      setForm({ title: '', category: 'other', priority: 'medium', dueDate: '', description: '' });
      fetchTasks();
    } catch {} finally { setSubmitting(false); }
  };

  const handleToggle = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task._id, { status: newStatus });
    fetchTasks();
  };

  return (
    <div>
      <PageHeader title="Tasks" description="Manage farm activities" action={<Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />Add Task</Button>} />
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task._id} className={clsx('flex items-center gap-3 p-3 rounded-lg border', task.status === 'completed' ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800')}>
            <button onClick={() => handleToggle(task)}>
              {task.status === 'completed' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-gray-300" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={clsx('text-sm font-medium', task.status === 'completed' && 'line-through text-gray-400')}>{task.title}</p>
              {task.description && <p className="text-xs text-gray-400 truncate">{task.description}</p>}
            </div>
            <Badge variant={priorityBadge[task.priority]}>{task.priority}</Badge>
            <span className="text-xs text-gray-400">{task.dueDate ? formatDate(task.dueDate) : ''}</span>
          </div>
        ))}
      </div>
      {!loading && tasks.length === 0 && <p className="text-center py-12 text-gray-400">No tasks yet</p>}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Task">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                {TASK_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-field">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
              </select>
            </div>
            <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Add Task</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}