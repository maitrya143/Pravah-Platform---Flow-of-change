import React, { useState } from 'react';
import { DiaryVolunteerEntry, User } from '../types';
import { DataService } from '../services/dataService';
import { Plus, Trash2, Save, FileText, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface DiaryProps { user: User; }

export const Diary: React.FC<DiaryProps> = ({ user }) => {
  const [entry, setEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    studentCount: 0,
    inTime: '16:00',
    outTime: '18:00',
    thought: '',
    subjectTaught: '',
    topicTaught: '',
  });

  const [volunteers, setVolunteers] = useState<DiaryVolunteerEntry[]>([
    { name: '', inTime: '16:00', outTime: '18:00', status: 'Present', classHandled: '', subject: '', topic: '' }
  ]);
  const [submitted, setSubmitted] = useState(false);

  const handleVolunteerChange = (index: number, field: keyof DiaryVolunteerEntry, value: string) => {
    const updated = [...volunteers];
    updated[index] = { ...updated[index], [field]: value };
    setVolunteers(updated);
  };

  const addVolunteer = () => setVolunteers([...volunteers, { name: '', inTime: '16:00', outTime: '18:00', status: 'Present', classHandled: '', subject: '', topic: '' }]);
  const removeVolunteer = (index: number) => setVolunteers(volunteers.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    DataService.saveDiary({ id: Date.now().toString(), ...entry, volunteers });
    setSubmitted(true);
  };

  const handleDownloadPDF = () => {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(234, 88, 12);
      doc.text('PRAVAH - UPAY Diary', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Center: ${user.centerName}`, 20, 35);
      doc.text(`Date: ${entry.date}`, 120, 35);
      doc.text(`Students Present: ${entry.studentCount}`, 20, 42);
      doc.text(`Timing: ${entry.inTime} - ${entry.outTime}`, 120, 42);
      doc.text(`Subject: ${entry.subjectTaught}`, 20, 52);
      doc.text(`Topic: ${entry.topicTaught}`, 20, 60);

      let y = 80;
      volunteers.forEach(v => {
          doc.text(`${v.name} (${v.status}) - ${v.subject}`, 20, y);
          y += 10;
      });
      doc.save(`Diary_${user.centerName}_${entry.date}.pdf`);
  };

  if (submitted) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-stone-200 text-center">
                <FileText className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-stone-800">Diary Logged!</h2>
                <div className="flex justify-center space-x-4 mt-6">
                    <button onClick={handleDownloadPDF} className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded">
                        <Download size={16} /> <span>Download PDF</span>
                    </button>
                    <button onClick={() => setSubmitted(false)} className="text-stone-600 px-4 py-2 border rounded">Back</button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-stone-800">UPAY Diary</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <h3 className="text-lg font-semibold text-stone-800 mb-4 border-b pb-2">Center Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                     <label className="block text-sm font-medium text-stone-700 mb-1">Center Name</label>
                     <div className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-emerald-800 font-semibold">{user.centerName}</div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-700">Date</label>
                    <input type="date" value={entry.date} onChange={e => setEntry({...entry, date: e.target.value})} className="w-full rounded-lg border-stone-300 shadow-sm p-2 border" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-700">Students Present</label>
                    <input type="number" value={entry.studentCount} onChange={e => setEntry({...entry, studentCount: parseInt(e.target.value) || 0})} className="w-full rounded-lg border-stone-300 shadow-sm p-2 border" required />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-4">
                 <div><label className="block text-sm font-medium text-stone-700">In Time</label><input type="time" value={entry.inTime} onChange={e => setEntry({...entry, inTime: e.target.value})} className="w-full rounded-lg border-stone-300 shadow-sm p-2 border" /></div>
                 <div><label className="block text-sm font-medium text-stone-700">Out Time</label><input type="time" value={entry.outTime} onChange={e => setEntry({...entry, outTime: e.target.value})} className="w-full rounded-lg border-stone-300 shadow-sm p-2 border" /></div>
            </div>

            <div className="mt-4">
                 <label className="block text-sm font-medium text-stone-700">Thought of the Day</label>
                 <input type="text" value={entry.thought} onChange={e => setEntry({...entry, thought: e.target.value})} className="w-full rounded-lg border-stone-300 shadow-sm p-2 border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                 <div><label className="block text-sm font-medium text-stone-700">Subject Taught</label><input type="text" value={entry.subjectTaught} onChange={e => setEntry({...entry, subjectTaught: e.target.value})} className="w-full rounded-lg border-stone-300 shadow-sm p-2 border" required /></div>
                 <div><label className="block text-sm font-medium text-stone-700">Topic Taught</label><input type="text" value={entry.topicTaught} onChange={e => setEntry({...entry, topicTaught: e.target.value})} className="w-full rounded-lg border-stone-300 shadow-sm p-2 border" required /></div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-semibold text-stone-800">Volunteer Attendance</h3>
                <button type="button" onClick={addVolunteer} className="text-emerald-600 hover:text-emerald-700 flex items-center text-sm font-medium"><Plus size={16} className="mr-1"/> Add Volunteer</button>
            </div>
            <div className="space-y-4">
                {volunteers.map((vol, idx) => (
                    <div key={idx} className="p-4 bg-stone-50 rounded-lg border border-stone-200 relative group">
                        <button type="button" onClick={() => removeVolunteer(idx)} className="absolute top-2 right-2 text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" placeholder="Volunteer Name" value={vol.name} onChange={e => handleVolunteerChange(idx, 'name', e.target.value)} className="rounded border-stone-300 text-sm p-2" required />
                            <select value={vol.status} onChange={e => handleVolunteerChange(idx, 'status', e.target.value)} className="rounded border-stone-300 text-sm p-2">
                                <option>Present</option><option>Absent</option>
                            </select>
                            <input type="text" placeholder="Class Handled" value={vol.classHandled} onChange={e => handleVolunteerChange(idx, 'classHandled', e.target.value)} className="rounded border-stone-300 text-sm p-2" />
                            <input type="text" placeholder="Subject" value={vol.subject} onChange={e => handleVolunteerChange(idx, 'subject', e.target.value)} className="rounded border-stone-300 text-sm p-2" />
                            <input type="text" placeholder="Topic" value={vol.topic} onChange={e => handleVolunteerChange(idx, 'topic', e.target.value)} className="rounded border-stone-300 text-sm p-2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-sm flex justify-center items-center">
             <Save size={20} className="mr-2" /> Submit Diary
        </button>
      </form>
    </div>
  );
};