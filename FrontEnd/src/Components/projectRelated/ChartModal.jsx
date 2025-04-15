import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './chart.css'
function ChartModal() {
  // Sample data for pie chart (student performance by category)
  const pieData = [
    { name: 'Assignments', value: 35 },
    { name: 'Quizzes', value: 25 },
    { name: 'Projects', value: 30 },
    { name: 'Participation', value: 10 },
  ];
// Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  // Sample data for Gantt chart (student project timeline)
  const ganttData = [
    { name: 'Research', start: 0, duration: 8 },
    { name: 'Planning', start: 8, duration: 5 },
    { name: 'Development', start: 13, duration: 12 },
    { name: 'Testing', start: 25, duration: 6 },
    { name: 'Deployment', start: 31, duration: 4 },
  ];

  // Prepare data for Gantt chart visualization
  const ganttChartData = ganttData.map(item => ({
    name: item.name,
    start: item.start,
    duration: item.duration,
  }));

  const [activeChart, setActiveChart] = useState('pie');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Student Analysis Dashboard</h2>
      
      <div className="flex justify-center mb-6">
      <button 
            onClick={() => setActiveChart('pie')}
            className={`chart-button ${activeChart === 'pie' ? 'active' : 'inactive'}`}
            >
            Performance Distribution
            </button>
            <button 
            onClick={() => setActiveChart('gantt')}
            className={`chart-button ${activeChart === 'gantt' ? 'active' : 'inactive'}`}
            >
            Project Timeline
    </button>

      </div>

      {activeChart === 'pie' && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeChart === 'gantt' && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-center">Project Timeline (Gantt)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={ganttChartData}
              margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
            >
              <XAxis type="number" domain={[0, 35]} />
              <YAxis type="category" dataKey="name" />
              <Tooltip
                formatter={(value, name, props) => {
                  if (name === 'start') return `Start: Week ${value}`;
                  if (name === 'duration') return `Duration: ${value} weeks`;
                  return value;
                }}
              />
              <Legend />
              <Bar dataKey="duration" stackId="a" fill="#8884d8" />
              <Bar dataKey="start" stackId="a" fill="transparent" stroke="transparent" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center text-sm text-gray-600">
            Timeline shown in weeks. Hover over bars to see details.
          </div>
        </div>
      )}
    </div>
  );
}

export default ChartModal;