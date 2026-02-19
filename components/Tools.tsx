
import React, { useState, useMemo } from 'react';
import { StudentGroup } from '../types';
import { geminiService } from '../services/geminiService';

interface ToolsProps {
  group: StudentGroup;
}

const Tools: React.FC<ToolsProps> = ({ group }) => {
  const [activeTool, setActiveTool] = useState<'timeline' | 'pwn' | 'roadmap' | 'goal' | 'health' | 'marss'>('timeline');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  
  const [auditScore, setAuditScore] = useState(0);
  
  const isK12 = group === StudentGroup.K12;
  const accentColor = isK12 ? 'bg-red-600' : 'bg-teal-700';
  const textColor = isK12 ? 'text-red-700' : 'text-teal-800';
  const borderColor = isK12 ? 'border-red-200' : 'border-teal-200';
  const lightBg = isK12 ? 'bg-red-50' : 'bg-teal-50';

  const checkItems = useMemo(() => isK12 ? [
    'Signed Parent Consent for Evaluation',
    'Evaluation Report (ER) complete and current',
    'IEP/IIIP in place and current',
    'Service pages match SpEd Forms data',
    'Transition plan included (Age 14+)',
    'MARSS updates sent to coordinator'
  ] : [
    'Signed Parent Consent for Evaluation',
    'Initial IFSP meeting held within 45 days',
    'Natural Environment justification included',
    'Service coordinator assigned',
    'Transition plan discussed at every meeting',
    'MARSS updates sent to coordinator'
  ], [isK12]);

  // MARSS Data from Official Reference Guide FY 2025-26
  const marssEndCodes = [
    { code: '25', label: '25 - EC Eval Only, Child Not Eligible' },
    { code: '28', label: '28 - Not Eligible for Part B, Exiting Part C (w/ referrals)' },
    { code: '29', label: '29 - Not Eligible for Part B, Exiting Part C (no referrals)' },
    { code: '21', label: '21 - EC Withdrawal (Objectives Met)' },
    { code: '27', label: '27 - EC Transition @ Age 3, Part B Eligible' },
    { code: '03', label: '03 - Transferred to Nonpublic/Homeschool' },
    { code: '04', label: '04 - Moved outside district (transferred to another MN district)' },
    { code: '05', label: '05 - Moved out of state/country' },
    { code: '08', label: '08 - Graduated' },
    { code: '11', label: '11 - Deceased' },
    { code: '12', label: '12 - Excused for Physical/Mental Disability' },
    { code: '14', label: '14 - Withdrawn after 15 consecutive days' },
    { code: '99', label: '99 - Status change (re-enrollment required)' }
  ];

  const marssSettings = [
    { code: '11', label: '11 - Children with Dev Delays (B-2)', cat: 'Birth-2' },
    { code: '12', label: '12 - Typically developing children (B-2)', cat: 'Birth-2' },
    { code: '13', label: '13 - Home (B-2)', cat: 'Birth-2' },
    { code: '16', label: '16 - Service provider location (B-2)', cat: 'Birth-2' },
    { code: '31', label: '31 - EC program (majority SpEd in setting)', cat: '3-5' },
    { code: '32', label: '32 - EC program (majority SpEd another location)', cat: '3-5' },
    { code: '41', label: '41 - Separate Class', cat: '3-5' },
    { code: '45', label: '45 - Home (3-5)', cat: '3-5' },
    { code: '01', label: '01 - Regular Class < 21%', cat: 'K-12' },
    { code: '02', label: '02 - Resource Room 21-60%', cat: 'K-12' },
    { code: '03', label: '03 - Separate Class > 60%', cat: 'K-12' }
  ];

  const marssDisabilities = [
    { code: '01', label: '01 - Speech/Language Impaired' },
    { code: '02', label: '02 - DCD Mild-Moderate' },
    { code: '07', label: '07 - Specific Learning Disabilities' },
    { code: '08', label: '08 - Emotional/Behavioral Disorders (EBD)' },
    { code: '10', label: '10 - Other Health Disabilities' },
    { code: '11', label: '11 - Autism Spectrum Disorder' },
    { code: '12', label: '12 - Developmental Delay' }
  ];

  const [marssData, setMarssData] = useState({
    studentName: '',
    ssid: '',
    changeTypes: [] as string[],
    effectiveDate: '',
    details: '',
    evalHours: '',
    eligibilityStatus: 'Qualified',
    endCode: '25', // Updated default to Code 25 (Eligible Eval Only)
    newSettingCode: '',
    newDisabilityCode: ''
  });

  const marssOptions = [
    'Initial Evaluation Hours',
    'Setting Change',
    'Disability Change',
    'Exit / Termination',
    'Resident District Change'
  ];

  const toggleChangeType = (type: string) => {
    setMarssData(prev => ({
      ...prev,
      changeTypes: prev.changeTypes.includes(type)
        ? prev.changeTypes.filter(t => t !== type)
        : [...prev.changeTypes, type]
    }));
  };

  const getMarssEmailBody = () => {
    let specificSections = '';
    
    if (marssData.changeTypes.includes('Initial Evaluation Hours')) {
      specificSections += `--- INITIAL EVALUATION DATA ---\n`;
      specificSections += `Evaluation Hours: ${marssData.evalHours}\n`;
      specificSections += `Eligibility Result: ${marssData.eligibilityStatus}\n`;
      if (marssData.eligibilityStatus === 'Did Not Qualify') {
        const label = marssEndCodes.find(c => c.code === marssData.endCode)?.label || marssData.endCode;
        specificSections += `MARSS Status End Code: ${label}\n`;
      }
      specificSections += `Eval Completion / Service Start Date: ${marssData.effectiveDate}\n\n`;
    }

    if (marssData.changeTypes.includes('Setting Change')) {
      const label = marssSettings.find(s => s.code === marssData.newSettingCode)?.label || 'Not Specified';
      specificSections += `New Instructional Setting: ${label}\n`;
    }

    if (marssData.changeTypes.includes('Disability Change')) {
      const label = marssDisabilities.find(d => d.code === marssData.newDisabilityCode)?.label || 'Not Specified';
      specificSections += `New Disability Category: ${label}\n`;
    }

    if (marssData.changeTypes.includes('Exit / Termination')) {
        const label = marssEndCodes.find(c => c.code === marssData.endCode)?.label || 'Not Specified';
        specificSections += `Withdrawal Status End Code: ${label}\n`;
    }

    return `Hi MARSS Coordinator,

Please update the following student record for District 0277 reporting purposes:

Student Name: ${marssData.studentName}
SSID: ${marssData.ssid}
Changes Required: ${marssData.changeTypes.join(', ')}
Effective Date: ${marssData.effectiveDate}

${specificSections}
Specific Details for MARSS Entry:
${marssData.details}

Thank you,
SpEd Department Team`;
  };

  const handleMarssEmail = () => {
    const subject = `MARSS Update: ${marssData.studentName} - ${marssData.changeTypes.join(' & ')}`;
    const body = getMarssEmailBody();
    const mailtoLink = `mailto:marss@westonka.k12.mn.us?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const link = document.createElement('a');
    link.href = mailtoLink;
    link.click();
  };

  const copyToClipboard = () => {
    const content = `Subject: MARSS Update Required: ${marssData.studentName}\n\n${getMarssEmailBody()}`;
    navigator.clipboard.writeText(content);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const [startDate, setStartDate] = useState('');
  const [timelineResult, setTimelineResult] = useState<{ deadline: string; safeDate: string } | null>(null);

  const calculateTimeline = () => {
    if (!startDate) return;
    const date = new Date(startDate);
    const daysToAdd = isK12 ? 42 : 45; 
    const deadline = new Date(date);
    deadline.setDate(deadline.getDate() + daysToAdd);
    const safeDate = new Date(deadline);
    safeDate.setDate(safeDate.getDate() - 5);

    setTimelineResult({
      deadline: deadline.toLocaleDateString(),
      safeDate: safeDate.toLocaleDateString()
    });
  };

  const [pwnInput, setPwnInput] = useState('');
  const [pwnDraft, setPwnDraft] = useState('');
  const [isGeneratingPwn, setIsGeneratingPwn] = useState(false);

  const generatePwn = async () => {
    setIsGeneratingPwn(true);
    try {
      const prompt = `Draft a SpEd PWN for: ${pwnInput}. Tone: Official District 0277. Context: ${isK12 ? 'K-12' : 'Birth-3'}. Provide 4 sections: Proposed Action, Explanation, Basis (Data), Other options considered.`;
      const result = await geminiService.sendMessage(prompt);
      setPwnDraft(result || '');
    } finally {
      setIsGeneratingPwn(false);
    }
  };

  const [goalInput, setGoalInput] = useState('');
  const [goalFeedback, setGoalFeedback] = useState('');
  const [isTestingGoal, setIsTestingGoal] = useState(false);

  const testGoal = async () => {
    setIsTestingGoal(true);
    try {
      const result = await geminiService.sendMessage(`Critique this SpEd goal for SMART compliance: "${goalInput}". Score 0-10 and rewrite a compliant version using District 0277 standards.`);
      setGoalFeedback(result || '');
    } finally {
      setIsTestingGoal(false);
    }
  };

  const roadmapScenarios = useMemo(() => {
    if (isK12) {
      return [
        { id: 'transfer', title: 'Out-of-State Transfer', steps: ['Obtain IEP/ER.', 'Review MN criteria.', 'Complete Transfer PWN.', 'Evaluate within 30 days if needed.'] },
        { id: 'summer', title: 'Summer Expiration', steps: ['Audit by May 1st.', 'Hold review in May if expiring June-Aug.', 'Maintain Stay Put.'] }
      ];
    } else {
      return [
        { id: 'b3-transition', title: 'Transition at Age 3', steps: ['Hold conference 90 days before 3rd birthday.', 'Notify Lead Agency.', 'Determine Part B needs.', 'IEP in place by day child turns 3.'] }
      ];
    }
  }, [isK12]);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full min-h-[600px]">
      <div className="md:w-64 space-y-2">
        <h4 className="px-4 text-[12px] font-black text-slate-800 uppercase tracking-widest mb-4">Compliance Center</h4>
        {[
          { id: 'timeline', label: 'Timeline Calc', icon: '⏱️' },
          { id: 'marss', label: 'MARSS Notifier', icon: '📬' },
          { id: 'pwn', label: 'PWN Helper', icon: '📝' },
          { id: 'roadmap', label: 'Scenario Guides', icon: '🗺️' },
          { id: 'goal', label: 'Goal Tester', icon: '🎯' },
          { id: 'health', label: 'File Checkup', icon: '🩺' }
        ].map(tool => (
          <button
            key={tool.id}
            onClick={() => {
              setActiveTool(tool.id as any);
              setSelectedScenario(null);
            }}
            className={`w-full text-left px-5 py-4 rounded-2xl border font-bold text-sm transition-all flex items-center gap-4
              ${activeTool === tool.id 
                ? `${accentColor} text-white shadow-xl shadow-slate-200 border-transparent translate-x-1` 
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50'}
            `}
          >
            <span className="text-2xl filter drop-shadow-sm">{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-100 p-10 overflow-y-auto">
        
        {activeTool === 'marss' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">MARSS Change Notifier</h3>
                <p className="text-slate-800 mt-2 font-bold text-lg leading-relaxed tracking-tight">Generate District 0277 alerts using validated FY 2025-26 Reference Guide standards.</p>
              </div>
              <div className="bg-red-100 text-red-900 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest shrink-0 border-2 border-red-200">FY 25-26 Data</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[12px] font-black text-slate-800 uppercase tracking-widest ml-1">Student Legal Name</label>
                <input 
                  type="text" 
                  value={marssData.studentName}
                  onChange={(e) => setMarssData({...marssData, studentName: e.target.value})}
                  placeholder="Official Name"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-slate-900 outline-none font-black text-slate-900 shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[12px] font-black text-slate-800 uppercase tracking-widest ml-1">SSID Number</label>
                <input 
                  type="text" 
                  value={marssData.ssid}
                  onChange={(e) => setMarssData({...marssData, ssid: e.target.value})}
                  placeholder="13-digit State ID"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-slate-900 outline-none font-black text-slate-900 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[12px] font-black text-slate-800 uppercase tracking-widest ml-1">Select Reporting Categories</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {marssOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => toggleChangeType(option)}
                    className={`px-5 py-4 rounded-2xl border-2 font-black text-sm text-left transition-all flex items-center justify-between
                      ${marssData.changeTypes.includes(option)
                        ? `${accentColor} text-white border-transparent shadow-lg scale-[1.02]`
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-400'}
                    `}
                  >
                    {option}
                    {marssData.changeTypes.includes(option) && <span className="text-xl">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[12px] font-black text-slate-800 uppercase tracking-widest ml-1">Effective Date</label>
                <input 
                  type="date" 
                  value={marssData.effectiveDate}
                  onChange={(e) => setMarssData({...marssData, effectiveDate: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-slate-900 outline-none font-black text-slate-900 shadow-inner"
                />
              </div>

              {marssData.changeTypes.includes('Initial Evaluation Hours') && (
                <div className="space-y-4 p-8 bg-amber-50 rounded-[2.5rem] border-4 border-amber-200 shadow-xl animate-in slide-in-from-right duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📊</span>
                    <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest">Initial Eval Data</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-amber-800 uppercase ml-1">Total Hours</label>
                      <input 
                        type="number" step="0.1" value={marssData.evalHours}
                        onChange={(e) => setMarssData({...marssData, evalHours: e.target.value})}
                        className="w-full px-4 py-3 bg-white border-2 border-amber-200 rounded-xl font-black text-slate-900"
                        placeholder="Hours"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-amber-800 uppercase ml-1">Result</label>
                      <div className="flex gap-2">
                        {['Qualified', 'Did Not Qualify'].map(st => (
                          <button key={st} onClick={() => setMarssData({...marssData, eligibilityStatus: st})}
                            className={`flex-1 py-2 rounded-lg text-xs font-black border-2 transition-all ${marssData.eligibilityStatus === st ? 'bg-amber-600 text-white border-amber-600 shadow-lg' : 'bg-white text-amber-900 border-amber-200'}`}
                          >{st}</button>
                        ))}
                      </div>
                    </div>
                    {marssData.eligibilityStatus === 'Did Not Qualify' && (
                      <div className="animate-in fade-in">
                        <label className="text-[10px] font-black text-amber-800 uppercase ml-1">Official End Code (DNQ)</label>
                        <select value={marssData.endCode} onChange={(e) => setMarssData({...marssData, endCode: e.target.value})}
                          className="w-full px-4 py-3 bg-white border-2 border-amber-200 rounded-xl font-black text-slate-900 appearance-none shadow-sm"
                        >
                          {marssEndCodes.filter(c => ['25','28','29','12'].includes(c.code)).map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                        </select>
                        <p className="text-[10px] text-amber-700 mt-2 font-bold px-1 italic">Use Code 25 for most Preschool/EC evaluations where eligibility is not met.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {marssData.changeTypes.includes('Setting Change') && (
                <div className="space-y-3 animate-in fade-in">
                   <label className="text-[12px] font-black text-slate-800 uppercase tracking-widest ml-1">New Instructional Setting</label>
                   <select 
                      value={marssData.newSettingCode}
                      onChange={(e) => setMarssData({...marssData, newSettingCode: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-slate-900 outline-none font-black text-slate-900 appearance-none shadow-inner"
                    >
                      <option value="">Select Official Setting Code...</option>
                      {marssSettings.map(s => <option key={s.code} value={s.code}>{s.label}</option>)}
                   </select>
                </div>
              )}

              {marssData.changeTypes.includes('Disability Change') && (
                <div className="space-y-3 animate-in fade-in">
                   <label className="text-[12px] font-black text-slate-800 uppercase tracking-widest ml-1">New Disability Category</label>
                   <select 
                      value={marssData.newDisabilityCode}
                      onChange={(e) => setMarssData({...marssData, newDisabilityCode: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-slate-900 outline-none font-black text-slate-900 appearance-none shadow-inner"
                    >
                      <option value="">Select Official Disability Code...</option>
                      {marssDisabilities.map(d => <option key={d.code} value={d.code}>{d.label}</option>)}
                   </select>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-[12px] font-black text-slate-800 uppercase tracking-widest ml-1">Specific Details / Notes</label>
              <textarea 
                value={marssData.details}
                onChange={(e) => setMarssData({...marssData, details: e.target.value})}
                placeholder="Include additional context for the MARSS coordinator..."
                className="w-full h-32 px-6 py-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-slate-900 outline-none font-black text-slate-800 shadow-inner resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-6 border-t-2 border-slate-100">
              <button 
                onClick={handleMarssEmail}
                disabled={!marssData.studentName || !marssData.effectiveDate || marssData.changeTypes.length === 0}
                className={`flex-1 py-6 ${accentColor} text-white rounded-[2rem] font-black hover:scale-[1.01] transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 text-xl`}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Launch Mail Client
              </button>
              <button 
                onClick={copyToClipboard}
                disabled={!marssData.studentName || !marssData.effectiveDate || marssData.changeTypes.length === 0}
                className="flex-1 py-6 bg-slate-900 text-white rounded-[2rem] font-black hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 text-xl"
              >
                {copyFeedback ? (
                  <>✨ Email Text Copied!</>
                ) : (
                  <>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    Copy Notification
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTool === 'timeline' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Timeline Calculator</h3>
              <p className="text-slate-800 mt-2 font-bold text-lg">Calculate legal windows based on parent consent dates for District 0277.</p>
            </div>
            <div className={`p-10 rounded-[2.5rem] ${lightBg} border-4 ${borderColor} shadow-inner`}>
              <label className="block text-[12px] font-black text-slate-800 uppercase tracking-widest mb-4">Parent Consent Date</label>
              <div className="flex flex-col sm:flex-row gap-6">
                <input 
                  type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 px-8 py-5 bg-white border-2 border-slate-300 rounded-2xl focus:border-slate-900 outline-none font-black text-slate-900 text-xl"
                />
                <button onClick={calculateTimeline}
                  className={`px-12 py-5 ${accentColor} text-white rounded-2xl font-black hover:scale-102 transition-all shadow-2xl text-xl`}
                >Run Calc</button>
              </div>
            </div>
            {timelineResult && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                <div className="p-10 rounded-[3rem] border-4 border-slate-900 bg-white shadow-2xl">
                  <div className="text-xs font-black text-slate-500 uppercase mb-2">Legal Deadline</div>
                  <div className="text-5xl font-black text-slate-900">{timelineResult.deadline}</div>
                </div>
                <div className="p-10 rounded-[3rem] border-4 border-green-600 bg-green-50 shadow-2xl shadow-green-100">
                  <div className="text-xs font-black text-green-700 uppercase mb-2">Safe Target Date</div>
                  <div className="text-5xl font-black text-green-900">{timelineResult.safeDate}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTool === 'pwn' && (
           <div className="space-y-8 animate-in fade-in">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">PWN Helper</h3>
              <textarea value={pwnInput} onChange={(e) => setPwnInput(e.target.value)} placeholder="Describe the change..." className="w-full h-48 px-8 py-6 bg-slate-50 border-4 border-slate-100 rounded-[2rem] font-black text-slate-800 text-lg shadow-inner outline-none focus:border-slate-900"/>
              <button onClick={generatePwn} disabled={!pwnInput || isGeneratingPwn} className={`w-full py-6 ${accentColor} text-white rounded-[2rem] font-black hover:opacity-90 shadow-2xl text-xl disabled:opacity-50`}>
                {isGeneratingPwn ? 'Drafting Technical Details...' : 'Generate SpEd Forms Draft'}
              </button>
              {pwnDraft && <div className="mt-8 p-10 bg-slate-900 text-slate-50 rounded-[3rem] border-8 border-slate-800 font-mono text-base leading-relaxed whitespace-pre-wrap relative shadow-2xl">
                <div className="absolute -top-4 right-10 text-[11px] bg-red-600 text-white px-5 py-2 rounded-full font-black tracking-widest shadow-xl">AI-GENERATED DRAFT</div>
                {pwnDraft}
              </div>}
           </div>
        )}

        {activeTool === 'roadmap' && (
           <div className="space-y-8 animate-in fade-in">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Scenario Guides</h3>
              <div className="grid grid-cols-1 gap-5">
                {roadmapScenarios.map(s => (
                  <button key={s.id} onClick={() => setSelectedScenario(s.id)} className={`p-8 rounded-[2rem] border-4 text-left transition-all ${selectedScenario === s.id ? `${borderColor} ${lightBg} shadow-inner` : 'bg-white border-slate-100 hover:border-slate-300 shadow-lg'}`}>
                    <h4 className={`font-black text-2xl ${selectedScenario === s.id ? textColor : 'text-slate-900'} tracking-tight`}>{s.title}</h4>
                  </button>
                ))}
              </div>
              {selectedScenario && (
                <div className={`p-12 rounded-[3.5rem] ${lightBg} border-4 ${borderColor} shadow-2xl animate-in slide-in-from-bottom-8`}>
                   <h4 className={`text-xs font-black uppercase tracking-[0.4em] ${textColor} mb-12 text-center`}>Mandated Procedure</h4>
                   <div className="space-y-10 max-w-3xl mx-auto">
                      {roadmapScenarios.find(s => s.id === selectedScenario)?.steps.map((step, i) => (
                        <div key={i} className="flex gap-8 items-start">
                          <div className={`w-12 h-12 rounded-[1.25rem] ${accentColor} text-white flex shrink-0 items-center justify-center font-black text-xl shadow-xl`}>{i + 1}</div>
                          <p className="text-slate-900 font-black text-2xl leading-tight pt-1">{step}</p>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>
        )}

        {activeTool === 'goal' && (
           <div className="space-y-8 animate-in fade-in">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Goal Stress-Tester</h3>
              <textarea value={goalInput} onChange={(e) => setGoalInput(e.target.value)} placeholder="Paste goal here..." className="w-full h-40 px-8 py-6 bg-slate-50 border-4 border-slate-100 rounded-[2rem] font-black text-slate-800 text-lg shadow-inner outline-none focus:border-slate-900"/>
              <button onClick={testGoal} disabled={!goalInput || isTestingGoal} className={`w-full py-6 ${accentColor} text-white rounded-[2rem] font-black shadow-2xl text-xl`}>
                {isTestingGoal ? 'Critiquing Technical Standards...' : 'Validate SMART Criteria'}
              </button>
              {goalFeedback && <div className={`mt-10 p-12 rounded-[3.5rem] border-4 ${borderColor} ${lightBg} shadow-2xl text-slate-900 font-black text-xl whitespace-pre-wrap`}>{goalFeedback}</div>}
           </div>
        )}

        {activeTool === 'health' && (
           <div className="space-y-8 animate-in fade-in">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Due Process Checkup</h3>
              <div className="space-y-5">
                {checkItems.map((item, i) => (
                  <label key={i} className="flex items-center gap-6 p-8 bg-slate-50 border-4 border-slate-100 rounded-[2.5rem] cursor-pointer hover:border-slate-900 transition-all group shadow-sm hover:shadow-xl">
                    <input type="checkbox" onChange={(e) => setAuditScore(prev => e.target.checked ? prev + 1 : prev - 1)} className={`w-9 h-9 rounded-2xl border-slate-400 ${textColor} focus:ring-slate-900 cursor-pointer shadow-inner bg-white`}/>
                    <span className="text-slate-900 font-black text-2xl">{item}</span>
                  </label>
                ))}
              </div>
              <div className={`mt-12 p-12 rounded-[4rem] border-8 ${auditScore === checkItems.length ? 'border-green-500 bg-green-50 shadow-green-200' : 'border-slate-200 bg-slate-50'} flex flex-col sm:flex-row items-center justify-between gap-10 transition-all shadow-2xl`}>
                <div className="text-center sm:text-left">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Audit Status</span>
                  <div className="text-8xl font-black text-slate-900 mt-2 tracking-tighter">{auditScore} <span className="text-3xl text-slate-500 opacity-50">/ {checkItems.length}</span></div>
                </div>
                <div className={`px-12 py-6 rounded-[2rem] text-lg font-black uppercase tracking-[0.2em] ${auditScore === checkItems.length ? 'bg-green-600 text-white shadow-2xl' : 'bg-slate-300 text-slate-800'} transition-all scale-110`}>
                  {auditScore === checkItems.length ? '✅ Folder Ready' : '❌ Pending Data'}
                </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default Tools;
