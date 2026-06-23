import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dsrAPI, authAPI } from '../services/api';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [dsrs, setDsrs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyDSRs();
  }, []);

  const fetchMyDSRs = async () => {
    try {
      setLoading(true);
      const response = await dsrAPI.getMyDSRs();
      setDsrs(response.data || []);
    } catch (error) {
      console.error('Error fetching DSRs:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleEdit = (dsrId) => {
    navigate(`/dsr/edit/${dsrId}`);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-sans">My DSR History</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-sans">View and manage your submitted reports.</p>
          </div>
          <button
            onClick={() => navigate('/dsr')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:opacity-90 transition-all shadow-sm font-sans"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New DSR
          </button>
        </div>

        {/* DSR List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
          </div>
        ) : dsrs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-12 text-center">
            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-6xl mb-4">description</span>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No DSRs Yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">You haven't submitted any daily status reports yet.</p>
            <button
              onClick={() => navigate('/dsr')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold hover:opacity-90 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Submit Your First DSR
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {dsrs.map((dsr) => (
              <div
                key={dsr._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      {formatDate(dsr.dsr_date)}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Project: <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {dsr.project_id?.name || 'N/A'}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(dsr._id)}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                      Edit
                    </button>

                  </div>
                </div>

                <div className="space-y-3">
                  {/* Tasks Today */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Tasks Accomplished
                    </h4>
                    {dsr.tasks_today && dsr.tasks_today.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 space-y-1">
                        {dsr.tasks_today.map((task, idx) => (
                          <li key={idx}>{task}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-400">No tasks recorded</p>
                    )}
                  </div>

                  {/* Tasks Tomorrow */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Planned for Next Day
                    </h4>
                    {dsr.tasks_tomorrow && dsr.tasks_tomorrow.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 space-y-1">
                        {dsr.tasks_tomorrow.map((task, idx) => (
                          <li key={idx}>{task}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-400">No tasks planned</p>
                    )}
                  </div>

                  {/* Blockers */}
                  {dsr.blockers && dsr.blockers.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Blockers
                      </h4>
                      <ul className="list-disc list-inside text-sm text-slate-700 dark:text-slate-300 space-y-1">
                        {dsr.blockers.map((blocker, idx) => (
                          <li key={idx}>{blocker}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Notes */}
                  {dsr.notes && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Additional Notes
                      </h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{dsr.notes}</p>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-400">
                    Submitted on {new Date(dsr.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

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

export default HistoryPage;