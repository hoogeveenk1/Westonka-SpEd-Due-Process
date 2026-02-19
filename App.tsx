
import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import Assistant from './components/Assistant';
import Tools from './components/Tools';
import { AppRoute, StudentGroup, PlaybookSection } from './types';
import { PLAYBOOK_SECTIONS } from './constants';

const Dashboard: React.FC<{ 
  onNavigate: (route: AppRoute) => void, 
  group: StudentGroup, 
  setGroup: (g: StudentGroup) => void 
}> = ({ onNavigate, group, setGroup }) => {
  const isK12 = group === StudentGroup.K12;
  const themeClass = isK12 ? 'from-red-600 to-red-800 shadow-red-100' : 'from-blue-700 to-blue-900 shadow-blue-100';
  const accentText = isK12 ? 'text-red-700' : 'text-blue-800';
  const buttonClass = isK12 ? 'text-red-700' : 'text-blue-900';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className={`bg-gradient-to-br ${themeClass} rounded-[2.5rem] p-12 text-white shadow-2xl transition-all duration-500 border border-white/10 relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-5xl font-black mb-4 tracking-tighter">Westonka SpEd Playbook</h2>
              <p className="text-white font-bold max-w-2xl text-xl leading-relaxed opacity-95">
                District 0277 Centralized Compliance Hub for {isK12 ? 'K-12 (Part B)' : 'Birth to 3 (Part C)'}.
              </p>
            </div>
            <div className="bg-black/30 p-2 rounded-[2rem] backdrop-blur-xl border border-white/30 flex shrink-0 shadow-2xl">
              <button 
                onClick={() => setGroup(StudentGroup.K12)}
                className={`px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all ${isK12 ? 'bg-white text-red-700 shadow-2xl scale-105' : 'text-white/90 hover:text-white hover:bg-white/10'}`}
              >
                K-12
              </button>
              <button 
                onClick={() => setGroup(StudentGroup.BIRTH_TO_3)}
                className={`px-8 py-4 rounded-[1.5rem] text-sm font-black transition-all ${!isK12 ? 'bg-white text-blue-900 shadow-2xl scale-105' : 'text-white/90 hover:text-white hover:bg-white/10'}`}
              >
                Birth to 3
              </button>
            </div>
          </div>
          
          <div className="mt-12 flex flex-wrap gap-6">
            <button 
              onClick={() => onNavigate(AppRoute.PLAYBOOK)}
              className={`bg-white ${buttonClass} px-10 py-5 rounded-2xl font-black hover:scale-105 transition-all flex items-center gap-3 shadow-xl text-lg`}
            >
              Procedures Guide
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button 
              onClick={() => onNavigate(AppRoute.TOOLS)}
              className="bg-white/20 text-white border-2 border-white/40 px-10 py-5 rounded-2xl font-black hover:bg-white/30 transition-all flex items-center gap-3 shadow-xl text-lg backdrop-blur-sm"
            >
              Compliance Tools
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-lg group">
          <div className={`w-16 h-16 ${isK12 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'} rounded-[1.5rem] flex items-center justify-center text-4xl mb-8 shadow-inner transition-transform group-hover:rotate-3`}>⏱️</div>
          <h3 className="font-black text-slate-900 text-2xl mb-6 tracking-tight">Key Timelines</h3>
          <ul className="space-y-6 font-black">
            {isK12 ? (
              <>
                <li className="flex justify-between border-b-2 border-slate-50 pb-4">
                  <span className="text-slate-600 uppercase text-[10px] tracking-widest mt-1">Initial Eval</span>
                  <span className="text-slate-900 text-lg font-black">30 School Days</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600 uppercase text-[10px] tracking-widest mt-1">IEP Review</span>
                  <span className="text-slate-900 text-lg font-black">365 Days</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex justify-between border-b-2 border-slate-50 pb-4">
                  <span className="text-slate-600 uppercase text-[10px] tracking-widest mt-1">Referral Clock</span>
                  <span className="text-slate-900 text-lg font-black">45 Calendar Days</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600 uppercase text-[10px] tracking-widest mt-1">Periodic Review</span>
                  <span className="text-slate-900 text-lg font-black">6 Months</span>
                </li>
              </>
            )}
          </ul>
        </div>
        
        <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-lg cursor-pointer hover:border-slate-900 transition-all group relative overflow-hidden" onClick={() => onNavigate(AppRoute.TOOLS)}>
          <div className={`w-16 h-16 ${isK12 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'} rounded-[1.5rem] flex items-center justify-center text-4xl mb-8 shadow-inner`}>🛠️</div>
          <h3 className="font-black text-slate-900 text-2xl mb-4 tracking-tight">Compliance Tools</h3>
          <p className="text-slate-700 font-bold text-lg leading-relaxed mb-6">Calculate deadlines, test goals, and notify MARSS in seconds.</p>
          <div className={`inline-flex items-center gap-3 font-black text-sm uppercase tracking-[0.2em] ${accentText} group-hover:translate-x-4 transition-transform`}>
            Launch Tools →
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-lg group">
          <div className={`w-16 h-16 ${isK12 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'} rounded-[1.5rem] flex items-center justify-center text-4xl mb-8 shadow-inner`}>📊</div>
          <h3 className="font-black text-slate-900 text-2xl mb-4 tracking-tight">Official Records</h3>
          <p className="text-slate-700 font-bold text-lg mb-8 leading-relaxed">Direct gateway for District 0277 student records.</p>
          <a href="https://15.spedforms.org/0277/" target="_blank" rel="noreferrer" className={`block w-full text-center py-5 rounded-2xl border-4 border-slate-900 bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl`}>SpEd Forms Login</a>
        </div>
      </div>
    </div>
  );
};

const Playbook: React.FC<{ group: StudentGroup, setGroup: (g: StudentGroup) => void }> = ({ group, setGroup }) => {
  const isK12 = group === StudentGroup.K12;
  const filteredSections = useMemo(() => {
    return PLAYBOOK_SECTIONS.filter(s => s.group === group);
  }, [group]);

  const [activeSection, setActiveSection] = useState(filteredSections[0]);

  React.useEffect(() => {
    setActiveSection(filteredSections[0]);
  }, [filteredSections]);

  const accentBorder = isK12 ? 'border-red-600 ring-red-600 text-red-700' : 'border-blue-700 ring-blue-700 text-blue-800';

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex justify-center">
        <div className="bg-slate-200 p-2 rounded-[2.5rem] flex w-fit shadow-inner border border-slate-300">
          <button 
            onClick={() => setGroup(StudentGroup.K12)}
            className={`px-10 py-4 rounded-[2rem] text-sm font-black transition-all ${isK12 ? 'bg-white text-red-700 shadow-2xl scale-105' : 'text-slate-700 hover:text-slate-900'}`}
          >
            K-12 (Part B)
          </button>
          <button 
            onClick={() => setGroup(StudentGroup.BIRTH_TO_3)}
            className={`px-10 py-4 rounded-[2rem] text-sm font-black transition-all ${!isK12 ? 'bg-white text-blue-800 shadow-2xl scale-105' : 'text-slate-700 hover:text-slate-900'}`}
          >
            Birth to 3 (Part C)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {filteredSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section)}
              className={`
                w-full text-left p-6 rounded-[2.5rem] border-2 transition-all group
                ${activeSection?.id === section.id 
                  ? `bg-white ${accentBorder} shadow-2xl ring-4 ring-opacity-10 scale-[1.03]` 
                  : 'bg-white border-slate-100 hover:border-slate-400 text-slate-900 font-bold'}
              `}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl group-hover:scale-110 transition-transform">{section.icon}</span>
                <div>
                  <h4 className="font-black text-sm tracking-tight">{section.title}</h4>
                  <p className="text-[9px] uppercase font-black tracking-[0.1em] text-slate-500 mt-1">Procedural Unit</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl flex flex-col overflow-hidden">
          {activeSection ? (
            <>
              <div className="p-12 border-b-4 border-slate-50 bg-slate-50/30">
                <div className="flex items-center gap-8 mb-8">
                  <span className="text-7xl drop-shadow-xl">{activeSection.icon}</span>
                  <div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{activeSection.title}</h2>
                      <div className={`mt-2 inline-block px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] border-2 shadow-sm ${isK12 ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-800 border-blue-100'}`}>
                        {isK12 ? 'WPS Part B Requirements' : 'WPS Part C Requirements'}
                      </div>
                  </div>
                </div>
                <p className="text-xl text-slate-800 font-bold leading-relaxed">{activeSection.description}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-12 space-y-16">
                <section>
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.3em] mb-8 border-b-2 border-slate-100 pb-2 w-fit">Mandated Procedures</h3>
                    <ul className="space-y-8">
                      {activeSection.content.map((item, i) => (
                        <li key={i} className="flex gap-6 text-slate-900 font-black text-xl leading-snug items-start">
                          <span className={`${isK12 ? 'text-red-600' : 'text-blue-700'} text-2xl`}>{i+1}.</span>
                          <span className="pt-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                </section>

                <section className={`p-10 rounded-[3rem] border-4 shadow-xl ${isK12 ? 'border-red-100 bg-red-50/20 shadow-red-900/5' : 'border-blue-100 bg-blue-50/20 shadow-blue-900/5'}`}>
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.3em] mb-8">Compliance Checkup</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeSection.checklists.map((item, i) => (
                        <label key={i} className="flex items-center gap-5 p-5 bg-white rounded-3xl border-2 border-slate-100 cursor-pointer hover:border-slate-900 transition-all shadow-md group">
                          <input type="checkbox" className={`w-8 h-8 rounded-xl ${isK12 ? 'text-red-600' : 'text-blue-700'} border-slate-300 focus:ring-slate-900 shadow-inner`} />
                          <span className="text-base text-slate-900 font-black leading-tight group-hover:text-black">{item}</span>
                        </label>
                      ))}
                    </div>
                </section>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 font-black uppercase tracking-[0.5em] animate-pulse">
              Select Module
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Resources: React.FC<{ onNavigate: (route: AppRoute) => void }> = ({ onNavigate }) => {
    const resources = [
        { title: "Due Process Playbook", desc: "Digital procedure guide & timelines", internal: true, route: AppRoute.PLAYBOOK },
        { title: "Compliance Tools", desc: "Calculators, MARSS & Draft Helpers", internal: true, route: AppRoute.TOOLS },
        { title: "SpEd Forms Portal", desc: "District 0277 Secure Records System", link: "https://15.spedforms.org/0277/" },
        { title: "MN Dept of Education", desc: "Official State Compliance Rules", link: "https://education.mn.gov" }
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Resource Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {resources.map((res, i) => (
                    res.internal ? (
                      <button 
                        key={i} 
                        onClick={() => onNavigate(res.route!)}
                        className="text-left p-10 bg-slate-900 border-4 border-slate-800 rounded-[3rem] hover:scale-[1.02] transition-all group shadow-2xl relative overflow-hidden"
                      >
                        <h4 className="font-black text-white text-2xl mb-3 group-hover:text-red-400 flex items-center justify-between">
                          {res.title}
                          <span className="bg-red-600 text-white text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest font-black shadow-lg">INTERNAL UNIT</span>
                        </h4>
                        <p className="text-slate-400 font-bold text-lg">{res.desc}</p>
                      </button>
                    ) : (
                      <a 
                          key={i} 
                          href={res.link}
                          target="_blank"
                          rel="noreferrer"
                          className="p-10 bg-white border-2 border-slate-100 rounded-[3rem] hover:border-slate-900 hover:shadow-2xl transition-all group flex flex-col justify-between shadow-lg"
                      >
                          <div>
                            <h4 className="font-black text-slate-900 text-2xl mb-3 group-hover:text-red-600 flex items-center justify-between">
                              {res.title}
                              <svg className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </h4>
                            <p className="text-slate-700 font-bold text-lg">{res.desc}</p>
                          </div>
                          <div className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-900 transition-colors">Official External Link</div>
                      </a>
                    )
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
      case AppRoute.TOOLS:
        return <Tools group={currentGroup} />;
      case AppRoute.ASSISTANT:
        return <Assistant onNavigate={setActiveRoute} />;
      case AppRoute.RESOURCES:
        return <Resources onNavigate={setActiveRoute} />;
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
