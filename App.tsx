
import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import Assistant from './components/Assistant';
import { AppRoute, StudentGroup, PlaybookSection } from './types';
import { PLAYBOOK_SECTIONS } from './constants';

const Dashboard: React.FC<{ 
  onNavigate: (route: AppRoute) => void, 
  group: StudentGroup, 
  setGroup: (g: StudentGroup) => void 
}> = ({ onNavigate, group, setGroup }) => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 text-white shadow-xl shadow-red-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">Westonka SpEd Playbook</h2>
            <p className="text-red-100 max-w-2xl text-lg">
              Centralized compliance hub for District 0277.
            </p>
          </div>
          <div className="bg-white/10 p-1 rounded-2xl backdrop-blur-sm border border-white/20 flex shrink-0">
            <button 
              onClick={() => setGroup(StudentGroup.K12)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${group === StudentGroup.K12 ? 'bg-white text-red-700 shadow-sm' : 'text-white hover:bg-white/10'}`}
            >
              K-12 (Part B)
            </button>
            <button 
              onClick={() => setGroup(StudentGroup.BIRTH_TO_3)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${group === StudentGroup.BIRTH_TO_3 ? 'bg-white text-red-700 shadow-sm' : 'text-white hover:bg-white/10'}`}
            >
              Birth to 3 (Part C)
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap gap-4">
          <button 
            onClick={() => onNavigate(AppRoute.PLAYBOOK)}
            className="bg-white text-red-700 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            Explore {group === StudentGroup.K12 ? 'K-12' : 'B-3'} Procedures
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <a 
             href="https://15.spedforms.org/0277/"
             target="_blank"
             rel="noreferrer"
             className="bg-red-500/30 text-white border border-red-400/50 px-6 py-3 rounded-xl font-bold hover:bg-red-500/40 transition-colors flex items-center gap-2"
          >
            SpEd Forms Login
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-2xl mb-4">⏱️</div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">Key Timelines ({group === StudentGroup.K12 ? 'Part B' : 'Part C'})</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            {group === StudentGroup.K12 ? (
              <>
                <li className="flex justify-between border-b border-slate-50 pb-1">
                  <span>Initial Eval</span>
                  <span className="font-semibold text-slate-800">30 School Days</span>
                </li>
                <li className="flex justify-between border-b border-slate-50 pb-1">
                  <span>IEP Review</span>
                  <span className="font-semibold text-slate-800">365 Days</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex justify-between border-b border-slate-50 pb-1">
                  <span>Referral to IFSP</span>
                  <span className="font-semibold text-slate-800">45 Calendar Days</span>
                </li>
                <li className="flex justify-between border-b border-slate-50 pb-1">
                  <span>Periodic Review</span>
                  <span className="font-semibold text-slate-800">6 Months</span>
                </li>
              </>
            )}
            <li className="flex justify-between">
              <span>{group === StudentGroup.K12 ? 'Re-eval' : 'Annual Review'}</span>
              <span className="font-semibold text-slate-800">{group === StudentGroup.K12 ? '3 Years' : '1 Year'}</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-2xl mb-4">✅</div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">Essential Tasks</h3>
          <ul className="text-sm text-slate-600 space-y-2">
             <li>• Draft PWNs before all changes</li>
             <li>• {group === StudentGroup.K12 ? 'Maintain updated PLAAFPs' : 'Document outcomes & family priorities'}</li>
             <li>• Ensure parents receive procedural safeguards</li>
             {group === StudentGroup.BIRTH_TO_3 && <li>• Focus on Natural Environments</li>}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-2xl mb-4">📎</div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">SpEd Forms (0277)</h3>
          <p className="text-sm text-slate-600">
            Access student {group === StudentGroup.K12 ? 'IEPs' : 'IFSPs'} and compliance dashboard directly.
          </p>
          <a href="https://15.spedforms.org/0277/" target="_blank" rel="noreferrer" className="text-purple-600 text-xs font-bold mt-4 uppercase tracking-wider block">Go to Login →</a>
        </div>
      </div>
    </div>
  );
};

const Playbook: React.FC<{ group: StudentGroup, setGroup: (g: StudentGroup) => void }> = ({ group, setGroup }) => {
  const filteredSections = useMemo(() => {
    return PLAYBOOK_SECTIONS.filter(s => s.group === group);
  }, [group]);

  const [activeSection, setActiveSection] = useState(filteredSections[0]);

  // Update active section if group changes
  React.useEffect(() => {
    setActiveSection(filteredSections[0]);
  }, [filteredSections]);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex justify-center">
        <div className="bg-slate-200 p-1 rounded-2xl flex w-fit">
          <button 
            onClick={() => setGroup(StudentGroup.K12)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${group === StudentGroup.K12 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            K-12 (Part B)
          </button>
          <button 
            onClick={() => setGroup(StudentGroup.BIRTH_TO_3)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${group === StudentGroup.BIRTH_TO_3 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Birth to 3 (Part C)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-1 space-y-3 overflow-y-auto pr-2">
          {filteredSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section)}
              className={`
                w-full text-left p-4 rounded-xl border transition-all
                ${activeSection?.id === section.id 
                  ? 'bg-white border-red-600 shadow-md ring-1 ring-red-600 ring-opacity-10' 
                  : 'bg-slate-50 border-transparent hover:bg-slate-100'}
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{section.icon}</span>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{section.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{section.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          {activeSection ? (
            <>
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{activeSection.icon}</span>
                  <div>
                      <h2 className="text-2xl font-bold text-slate-900">{activeSection.title}</h2>
                      <p className="text-slate-500">{activeSection.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Key Procedures</h3>
                    <ul className="space-y-3">
                      {activeSection.content.map((item, i) => (
                        <li key={i} className="flex gap-3 text-slate-700">
                          <span className="text-red-600 font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                </section>

                <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Due Process Checklist</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeSection.checklists.map((item, i) => (
                        <label key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-red-300 transition-colors">
                          <input type="checkbox" className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300" />
                          <span className="text-sm text-slate-700">{item}</span>
                        </label>
                      ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Mandated Timelines</h3>
                    <div className="flex flex-wrap gap-4">
                      {activeSection.timelines.map((t, i) => (
                        <div key={i} className="px-6 py-4 bg-red-50 border border-red-100 rounded-xl">
                          <div className="text-xs text-red-600 font-bold uppercase mb-1">{t.label}</div>
                          <div className="text-lg font-bold text-slate-800">{t.duration}</div>
                        </div>
                      ))}
                    </div>
                </section>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              Select a section to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Resources: React.FC = () => {
    const resources = [
        { title: "SpEd Forms Login (0277)", desc: "Primary portal for student IEPs and evaluations", link: "https://15.spedforms.org/0277/" },
        { title: "Westonka Staff Directory", desc: "Official contact directory for district leads and coordinators", link: "https://www.westonka.k12.mn.us/academics/special-education" },
        { title: "MDE Website", desc: "Minnesota Department of Education SpEd Resources", link: "https://education.mn.gov" }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Resource Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((res, i) => (
                    <a 
                        key={i} 
                        href={res.link}
                        target="_blank"
                        rel="noreferrer"
                        className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-red-600 hover:shadow-lg transition-all group"
                    >
                        <h4 className="font-bold text-slate-800 mb-1 group-hover:text-red-600 flex items-center justify-between">
                          {res.title}
                          <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </h4>
                        <p className="text-sm text-slate-500">{res.desc}</p>
                    </a>
                ))}
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<AppRoute>(AppRoute.DASHBOARD);
  const [currentGroup, setCurrentGroup] = useState<StudentGroup>(StudentGroup.K12);

  const renderContent = () => {
    switch (activeRoute) {
      case AppRoute.DASHBOARD:
        return <Dashboard onNavigate={setActiveRoute} group={currentGroup} setGroup={setCurrentGroup} />;
      case AppRoute.PLAYBOOK:
        return <Playbook group={currentGroup} setGroup={setCurrentGroup} />;
      case AppRoute.ASSISTANT:
        return <Assistant />;
      case AppRoute.RESOURCES:
        return <Resources />;
      default:
        return <Dashboard onNavigate={setActiveRoute} group={currentGroup} setGroup={setCurrentGroup} />;
    }
  };

  return (
    <Layout activeRoute={activeRoute} setActiveRoute={setActiveRoute}>
      {renderContent()}
    </Layout>
  );
};

export default App;
