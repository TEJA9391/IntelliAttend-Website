"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { TrendingUp, AlertTriangle } from "lucide-react";

const areaData = [
  { name: "Week 1", attendance: 92, predicted: 90 },
  { name: "Week 2", attendance: 94, predicted: 91 },
  { name: "Week 3", attendance: 89, predicted: 93 },
  { name: "Week 4", attendance: 95, predicted: 92 },
  { name: "Week 5", attendance: 97, predicted: 94 },
  { name: "Week 6", attendance: 96, predicted: 96 },
  { name: "Week 7", attendance: 98, predicted: 97 },
];

const barData = [
  { department: "Computer Science", risk: 12 },
  { department: "Mechanical", risk: 24 },
  { department: "Civil", risk: 8 },
  { department: "Electrical", risk: 15 },
  { department: "Business", risk: 5 },
];

export function AnalyticsShowcase() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Predictive Analytics that <br />
              <span className="text-gradient">Drive Interventions</span>
            </h2>
            <p className="text-lg text-slate-400">
              Stop relying on reactive data. Our AI models predict attendance trends and flag at-risk students weeks before they drop out, allowing for timely academic interventions.
            </p>
            
            <div className="space-y-6 mt-4">
               <div className="flex gap-4 items-start">
                 <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                   <TrendingUp className="text-blue-400 w-6 h-6" />
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-white">Trend Forecasting</h4>
                   <p className="text-slate-400 mt-1">Machine learning algorithms forecast campus-wide attendance dips based on historical patterns, weather, and exam schedules.</p>
                 </div>
               </div>
               
               <div className="flex gap-4 items-start">
                 <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                   <AlertTriangle className="text-orange-400 w-6 h-6" />
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-white">Early Warning System</h4>
                   <p className="text-slate-400 mt-1">Automatically identify students exhibiting chronic absenteeism markers and alert their respective mentors.</p>
                 </div>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            {/* Area Chart */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-semibold text-white">Campus Attendance vs Predicted</h3>
                <div className="flex gap-4 text-xs font-medium">
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-3 h-3 rounded-full bg-blue-500" /> Actual
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-3 h-3 rounded-full border-2 border-cyan-400 border-dashed" /> Predicted
                  </div>
                </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="predicted" stroke="#22d3ee" strokeDasharray="5 5" fillOpacity={1} fill="transparent" />
                    <Area type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 flex gap-6">
               <div className="flex-1">
                 <h3 className="font-semibold text-white mb-6">At-Risk Students by Department</h3>
                 <div className="h-[150px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="department" type="category" hide />
                        <Tooltip 
                          cursor={{fill: 'rgba(255,255,255,0.05)'}}
                          contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                        <Bar dataKey="risk" radius={[0, 4, 4, 0]} barSize={12}>
                          {barData.map((entry, index) => (
                            <Cell key={"cell-" + index} fill={entry.risk > 15 ? '#ef4444' : entry.risk > 10 ? '#f59e0b' : '#3b82f6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
               </div>
               <div className="w-[120px] flex flex-col justify-between py-2">
                 {barData.map((d, i) => (
                   <div key={i} className="text-xs text-slate-400 text-right truncate">
                     {d.department}
                   </div>
                 ))}
               </div>
            </div>

          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
