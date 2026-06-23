import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dsrSchema } from '../schemas/dsrSchema';
import { dsrAPI, projectAPI, authAPI } from '../services/api';

const EditDSRPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dsrLoading, setDsrLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);

  // Date helpers
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const yesterday = new Date();
  // yesterday.setDate(today.getDate() - 1);
  yesterday.setUTCDate(today.getUTCDate() - 1);
  const dayBeforeYesterday = new Date();
  // dayBeforeYesterday.setDate(today.getDate() - 2);
  dayBeforeYesterday.setUTCDate(today.getUTCDate() - 2);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(dsrSchema),
    defaultValues: {
      dsr_date: new Date(),
      project_id: '',
      tasks_today: '',
      tasks_tomorrow: '',
      blockers: '',
      notes: ''
    },
  });

  useEffect(() => {
    fetchProjects();
    fetchDSR();
  }, [id]);

  const fetchDSR = async () => {
    try {
      setDsrLoading(true);
      const response = await dsrAPI.getById(id);
      const dsr = response.data;
      
      // Set form values
      setValue('project_id', dsr.project_id?._id || '');
      setValue('tasks_today', dsr.tasks_today?.join('\n') || '');
      setValue('tasks_tomorrow', dsr.tasks_tomorrow?.join('\n') || '');
      setValue('blockers', dsr.blockers?.join('\n') || '');
      setValue('notes', dsr.notes || '');
      setSelectedDate(new Date(dsr.dsr_date));
    } catch (error) {
      console.error('Error fetching DSR:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        alert('Failed to load DSR');
        navigate('/history');
      }
    } finally {
      setDsrLoading(false);
    }
  };

  const normalizeDate = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // const fetchProjects = async () => {
  //   try {
  //     const response = await projectAPI.getAll();
  //     setProjects(response.data || []);
  //   } catch (error) {
  //     console.error('Error fetching projects:', error);
  //   }
  // };

  const fetchProjects = async () => {
  try {
    const response = await projectAPI.getMyProjects();
    const data = Array.isArray(response) ? response : [];  // ← guard
    setProjects(data);

    if (data.length === 0) {
      alert('No projects are currently assigned to you. Please contact your manager.');
    } else if (data.length === 1) {
      reset((prev) => ({ ...prev, project_id: data[0]._id }));
    }
  } catch (error) {
    console.error('Fetch projects error:', error);
    if (error.response?.status === 401) navigate('/login');
    else alert('Failed to load projects. Check console.');
  }
};

    const formatDate = (date) =>
    date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const handleDateSelect = (date) => {
    const normalized = normalizeDate(date);

    const isToday = normalized.getTime() === normalizeDate(today).getTime();
    const isYesterday = normalized.getTime() === normalizeDate(yesterday).getTime();
    const isDayBeforeYesterday = normalized.getTime() === normalizeDate(dayBeforeYesterday).getTime();

    if (isToday || isYesterday || isDayBeforeYesterday) {
      setSelectedDate(normalized);
      setShowCalendar(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        project_id: data.project_id,
        dsr_date: selectedDate,
        tasks_today: data.tasks_today.split('\n').filter(t => t.trim()),
        tasks_tomorrow: data.tasks_tomorrow.split('\n').filter(t => t.trim()),
        blockers: data.blockers ? data.blockers.split('\n').filter(b => b.trim()) : [],
        notes: data.notes || ''
      };

      await dsrAPI.update(id, payload);
      alert('DSR updated successfully!');
      navigate('/history');
    } catch (error) {
      console.error('Error updating DSR:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        navigate('/login');
      } else {
        alert(error.response?.data?.message || 'Failed to update DSR. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (dsrLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading DSR...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-sans">Edit Daily Status Report</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-sans">Update your daily progress and planned tasks.</p>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm font-sans"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to History
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Date and Project Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Date Picker */}
                {/* <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} /> */}

                                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase mb-2">
                    Date
                  </label>

                  <div className="relative">
                    <input
                      readOnly
                      value={formatDate(selectedDate)}
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full px-4 py-2.5 cursor-pointer border bg-slate-50 dark:bg-slate-800 rounded-lg"
                    />
                  </div>

                  {showCalendar && (
                    <div className="mt-3 p-4 border bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3">
                      <button
                        type="button"
                        onClick={() => handleDateSelect(today)}
                        className={`w-full py-2 text-sm font-semibold border rounded-lg ${
                          normalizeDate(selectedDate).getTime() === normalizeDate(today).getTime()
                            ? 'bg-primary text-white'
                            : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        Today ({formatDate(today)})
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDateSelect(yesterday)}
                        className={`w-full py-2 text-sm font-semibold border rounded-lg ${
                          normalizeDate(selectedDate).getTime() === normalizeDate(yesterday).getTime()
                            ? 'bg-primary text-white'
                            : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        Yesterday ({formatDate(yesterday)})
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDateSelect(dayBeforeYesterday)}
                        className={`w-full py-2 text-sm font-semibold border rounded-lg ${
                          normalizeDate(selectedDate).getTime() === normalizeDate(dayBeforeYesterday).getTime()
                            ? 'bg-primary text-white'
                            : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        Day Before Yesterday ({formatDate(dayBeforeYesterday)})
                      </button>

                      <p className="text-xs text-slate-400 text-center">
                        Only today, yesterday, and the day before yesterday are allowed
                      </p>
                    </div>
                  )}
                </div>

                {/* Project Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-sans">Project Selection</label>
                  <select
                    {...register('project_id')}
                    disabled={projects.length === 0}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none rounded-lg font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {projects.length === 0 ? 'No projects assigned' : 'Select a Project'}
                    </option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  
                  {projects.length === 0 ? (
                    <p className="text-amber-500 text-xs mt-1">
                      You have no assigned projects. Please contact your manager.
                    </p>
                  ) : (
                    errors.project_id && (
                      <p className="text-red-500 text-xs mt-1">{errors.project_id.message}</p>
                    )
                  )}
                </div>
              </div>

              {/* Tasks Accomplished */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">Tasks Accomplished</label>
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest font-sans">Required</span>
                </div>
                <textarea 
                  {...register('tasks_today')}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none font-sans" 
                  placeholder="List the major milestones or tickets resolved today..." 
                  rows="4"
                ></textarea>
                {errors.tasks_today && <p className="text-red-500 text-xs mt-1">{errors.tasks_today.message}</p>}
              </div>

              {/* Planned for Next Working Day */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">Planned for Next Working Day</label>
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest font-sans">Required</span>
                </div>
                <textarea 
                  {...register('tasks_tomorrow')}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none font-sans" 
                  placeholder="What are your goals for tomorrow?" 
                  rows="3"
                ></textarea>
                {errors.tasks_tomorrow && <p className="text-red-500 text-xs mt-1">{errors.tasks_tomorrow.message}</p>}
              </div>

              {/* Impediments / Dependencies */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-sans">Impediments / Dependencies</label>
                <textarea 
                  {...register('blockers')}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none font-sans" 
                  placeholder="Are there any blockers or things you're waiting for?" 
                  rows="3"
                ></textarea>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-sans">Additional Notes</label>
                <textarea 
                  {...register('notes')}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none font-sans" 
                  placeholder="Any other relevant details..." 
                  rows="2"
                ></textarea>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end items-center gap-3">
              <button 
                type="button"
                onClick={() => navigate('/history')}
                className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-sans"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="bg-primary hover:opacity-95 text-white px-6 py-2.5 font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 font-sans disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">save</span>
                {loading ? 'Updating...' : 'Update DSR'}
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <footer className="mt-12 text-center pb-8">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-sans">
            © 2026 Delivery Pulse. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default EditDSRPage;