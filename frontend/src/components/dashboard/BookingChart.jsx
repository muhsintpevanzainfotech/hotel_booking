import { useSelector } from 'react-redux';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const BookingChart = () => {
  const { analytics } = useSelector(state => state.stats);
  
  const chartData = analytics.length > 0 ? analytics : [
    { name: 'Jan', bookings: 0, revenue: 0 },
    { name: 'Feb', bookings: 0, revenue: 0 },
    { name: 'Mar', bookings: 0, revenue: 0 },
    { name: 'Apr', bookings: 0, revenue: 0 },
    { name: 'May', bookings: 0, revenue: 0 },
    { name: 'Jun', bookings: 0, revenue: 0 },
  ];

  return (
    <div className="glass-card p-4 md:p-6 h-[320px] md:h-[400px] flex flex-col">
      <div className="mb-[16px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
              <h3 className="text-[16px] md:text-[18px] font-semibold text-text-primary tracking-tight">Reservation Pulse</h3>
              <p className="text-[10px] md:text-[12px] font-normal text-text-secondary uppercase tracking-widest mt-0.5 md:mt-1">Live metrics</p>
          </div>
          <div className="flex gap-1.5 md:gap-2">
              {['Daily', 'Weekly', 'Monthly'].map((t) => (
                  <button key={t} className={`px-2.5 py-1 md:px-3 md:py-1 rounded-lg text-[9px] md:text-[11px] font-bold uppercase tracking-wider transition-all ${t === 'Monthly' ? 'active-teal-gradient text-white shadow-lg' : 'bg-bg-subtle text-text-secondary hover:text-white'}`}>
                      {t}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 w-full min-h-[250px] overflow-hidden" style={{ minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9FBFBF', fontSize: 9, fontWeight: 500}} 
                  dy={10}
              />
              <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9FBFBF', fontSize: 9, fontWeight: 500}} 
              />
              <Tooltip 
                cursor={{ stroke: 'rgba(20, 184, 166, 0.2)', strokeWidth: 1 }}
                contentStyle={{ 
                  backgroundColor: '#132F2F',
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                  padding: '10px'
                }} 
                itemStyle={{ color: '#E6F7F7', fontSize: '12px', fontWeight: '600' }}
                labelStyle={{ color: '#14B8A6', marginBottom: '4px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}
              />
              <Area 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#14B8A6" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorBookings)" 
                  animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
};

export const RevenueChart = () => {
  const { analytics } = useSelector(state => state.stats);
  
  const chartData = analytics.length > 0 ? analytics : [
    { name: 'Jan', bookings: 0, revenue: 0 },
    { name: 'Feb', bookings: 0, revenue: 0 },
    { name: 'Mar', bookings: 0, revenue: 0 },
    { name: 'Apr', bookings: 0, revenue: 0 },
    { name: 'May', bookings: 0, revenue: 0 },
    { name: 'Jun', bookings: 0, revenue: 0 },
  ];

  return (
    <div className="glass-card p-4 md:p-6 h-[320px] md:h-[400px] flex flex-col">
      <div className="mb-[16px]">
          <h3 className="text-[16px] md:text-[18px] font-semibold text-text-primary tracking-tight">Revenue Flow</h3>
          <p className="text-[10px] md:text-[12px] font-normal text-text-secondary uppercase tracking-widest mt-0.5 md:mt-1">Yield analytics</p>
      </div>
      <div className="flex-1 w-full min-h-[250px] overflow-hidden" style={{ minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%" debounce={1}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9FBFBF', fontSize: 9, fontWeight: 500}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9FBFBF', fontSize: 9, fontWeight: 500}} tickFormatter={(val) => `₹${val > 999 ? (val/1000).toFixed(1) + 'k' : val}`} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.03)'}}
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{ 
                  backgroundColor: '#132F2F',
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                  padding: '10px'
                }} 
                itemStyle={{ color: '#E6F7F7', fontSize: '12px', fontWeight: '600' }}
                labelStyle={{ color: '#14B8A6', marginBottom: '4px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase' }}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]} barSize={16}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#14B8A6' : 'rgba(20, 184, 166, 0.15)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
};

