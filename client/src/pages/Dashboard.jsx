import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard({ user, setUser }) {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api/tasks/';

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL, config);
        setTasks(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTasks();
  }, [user.token]);

  const onLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;

    try {
      const response = await axios.post(API_URL, { title: text }, config);
      setTasks([...tasks, response.data]);
      setText('');
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(API_URL + id, config);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTask = async (task) => {
      try {
          const response = await axios.put(API_URL + task._id, { isCompleted: !task.isCompleted }, config);
          setTasks(tasks.map(t => t._id === task._id ? response.data : t));
      } catch (error) {
          console.log(error);
      }
  }

  const filteredTasks = tasks.filter(task => {
      if (filter === 'completed') return task.isCompleted;
      if (filter === 'pending') return !task.isCompleted;
      return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow mb-8">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Task Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.name}</span>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={onSubmit} className="flex gap-4">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
            >
              Add
            </button>
          </form>
        </div>

        <div className="flex gap-2 mb-4">
            <button onClick={() => setFilter('all')} className={`px-4 py-1 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>All</button>
            <button onClick={() => setFilter('pending')} className={`px-4 py-1 rounded ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Pending</button>
            <button onClick={() => setFilter('completed')} className={`px-4 py-1 rounded ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Completed</button>
        </div>

        <div className="grid gap-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        checked={task.isCompleted} 
                        onChange={() => toggleTask(task)}
                        className="w-5 h-5 text-blue-600"
                    />
                    <span className={`text-lg ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.title}
                    </span>
                </div>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;