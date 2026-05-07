import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getProjects, createProject, updateProject, deleteProject, toggleProjectActive, reorderProjects,
  getSkills, createSkill, deleteSkill,
  getMessages, deleteMessage,
  getProfile, saveProfile,
  getEducations, createEducation, updateEducation, deleteEducation, reorderEducations
} from '../services/api';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('projects');
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [educations, setEducations] = useState([]);
  const [profile, setProfile] = useState({ fullName: '', title: '', titleEn: '', bio: '', bioEn: '', email: '', githubLink: '', linkedinLink: '' });

  const [newProject, setNewProject] = useState({ title: '', titleEn: '', description: '', descriptionEn: '', technologies: '', duration: '', githubUrl: '', liveUrl: '' });
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [newSkill, setNewSkill] = useState({ name: '', category: '', orderIndex: 0 });
  const [newEducation, setNewEducation] = useState({ schoolName: '', schoolNameEn: '', department: '', departmentEn: '', startDate: '', endDate: '', description: '', descriptionEn: '', educationType: 'Üniversite', orderIndex: 0 });
  const [editingEducationId, setEditingEducationId] = useState(null);
  const [isEducationContinuing, setIsEducationContinuing] = useState(false);

  const dragItem = useRef();
  const dragOverItem = useRef();

  // --- Veri Yükleme ---
  const loadProjects = useCallback(async () => {
    try { const d = await getProjects(); if (d.success) setProjects(d.data.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))); } catch (e) { console.error(e); }
  }, []);
  const loadSkills = useCallback(async () => {
    try { const d = await getSkills(); if (d.success) setSkills(d.data); } catch (e) { console.error(e); }
  }, []);
  const loadMessages = useCallback(async () => {
    try { const d = await getMessages(); if (d.success) setMessages(d.data); } catch (e) { console.error(e); }
  }, []);
  const loadEducations = useCallback(async () => {
    try { const d = await getEducations(); if (d.success) setEducations(d.data.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))); } catch (e) { console.error(e); }
  }, []);
  const loadProfile = useCallback(async () => {
    try {
      const d = await getProfile();
      if (d.success && d.data && d.data.length > 0) setProfile(d.data[0]);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'null') { navigate('/login'); return; }
    loadProjects(); loadSkills(); loadMessages(); loadEducations(); loadProfile();
  }, [navigate, loadProjects, loadSkills, loadMessages, loadEducations, loadProfile]);

  // --- İşlemler ---
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title?.trim()) return alert('Hata: Proje başlığı boş olamaz!');
    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, newProject);
        alert('Proje başarıyla güncellendi! ✨');
      } else {
        await createProject(newProject);
        alert('Proje başarıyla eklendi! ✨');
      }
      setNewProject({ title: '', titleEn: '', description: '', descriptionEn: '', technologies: '', duration: '', githubUrl: '', liveUrl: '' });
      setEditingProjectId(null);
      await loadProjects();
    } catch (err) { alert(`Hata: ${err.message}`); }
  };

  const handleEditProject = (p) => {
    setNewProject({ ...p });
    setEditingProjectId(p.id);
    document.querySelector('.flex-1.p-12').scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleDeleteProject = async (id) => {
    if (!window.confirm('Projeyi silmek istiyor musun?')) return;
    try { await deleteProject(id); await loadProjects(); } catch (err) { alert(`Hata: ${err.message}`); }
  };
  const handleToggleProjectActive = async (id) => {
    try { await toggleProjectActive(id); await loadProjects(); } catch (err) { alert(`Hata: ${err.message}`); }
  };
  const handleSortProjects = async () => {
    const _projects = [...projects];
    const draggedItemContent = _projects.splice(dragItem.current, 1)[0];
    _projects.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;

    const updatedProjects = _projects.map((p, i) => ({ ...p, orderIndex: i }));
    setProjects(updatedProjects);

    const requestList = updatedProjects.map(p => ({ id: p.id, orderIndex: p.orderIndex }));
    try {
      await reorderProjects(requestList);
    } catch (err) {
      alert(`Sıralama güncellenemedi: ${err.message}`);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.name?.trim() || !newSkill.category) return alert('Hata: Yetenek adı ve kategori zorunludur!');
    if (skills.some(s => s.name?.toLowerCase() === newSkill.name.trim().toLowerCase())) return alert('Bu yetenek zaten mevcut!');
    try {
      await createSkill(newSkill);
      setNewSkill({ name: '', category: '', orderIndex: 0 });
      await loadSkills();
      alert('Yetenek başarıyla eklendi! ✨');
    } catch (err) { alert(`Hata: ${err.message}`); }
  };
  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Yeteneği silmek istiyor musun?')) return;
    try { await deleteSkill(id); await loadSkills(); } catch (err) { alert(`Hata: ${err.message}`); }
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    if (!newEducation.schoolName?.trim()) return alert('Hata: Okul adı boş olamaz!');
    try {
      if (editingEducationId) {
        await updateEducation(editingEducationId, newEducation);
        alert('Eğitim bilgisi başarıyla güncellendi! ✨');
      } else {
        await createEducation({ ...newEducation, orderIndex: educations.length });
        alert('Eğitim bilgisi eklendi! ✨');
      }
      setNewEducation({ schoolName: '', schoolNameEn: '', department: '', departmentEn: '', startDate: '', endDate: '', description: '', descriptionEn: '', educationType: 'Üniversite', orderIndex: 0 });
      setEditingEducationId(null);
      setIsEducationContinuing(false);
      await loadEducations();
    } catch (err) { alert(`Hata: ${err.message}`); }
  };

  const handleEditEducation = (ed) => {
    setNewEducation({ ...ed });
    setEditingEducationId(ed.id);
    setIsEducationContinuing(ed.endDate === 'Devam Ediyor');
    document.querySelector('.flex-1.p-12').scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleDeleteEducation = async (id) => {
    if (!window.confirm('Eğitim bilgisini silmek istiyor musun?')) return;
    try { await deleteEducation(id); await loadEducations(); } catch (err) { alert(`Hata: ${err.message}`); }
  };

  const handleSortEducations = async () => {
    const _educations = [...educations];
    const draggedItemContent = _educations.splice(dragItem.current, 1)[0];
    _educations.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;

    const updatedEducations = _educations.map((ed, i) => ({ ...ed, orderIndex: i }));
    setEducations(updatedEducations);

    const requestList = updatedEducations.map(ed => ({ id: ed.id, orderIndex: ed.orderIndex }));
    try {
      await reorderEducations(requestList);
    } catch (err) {
      alert(`Sıralama güncellenemedi: ${err.message}`);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Mesajı silmek istiyor musun?')) return;
    try { await deleteMessage(id); await loadMessages(); } catch (err) { alert(`Hata: ${err.message}`); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try { await saveProfile(profile); await loadProfile(); alert('Profil başarıyla güncellendi! ✨'); }
    catch (err) { alert(`Hata: ${err.message}`); }
  };

  const tabs = [
    { id: 'projects', label: '📁 Projeler' },
    { id: 'skills', label: '⚡ Yetenekler' },
    { id: 'education', label: '🎓 Eğitim' },
    { id: 'messages', label: '📩 Mesajlar' },
    { id: 'profile', label: '👤 Profil' },
  ];

  const inputCls = "w-full bg-[#0A0510] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-[#8b5cf6]/50 transition-all";

  return (
    <div className="min-h-screen bg-[#050208] text-[#E2DCE7] flex font-sans">
      {/* SIDEBAR */}
      <div className="w-64 bg-white/[0.02] border-r border-white/5 p-8 flex flex-col gap-8 shadow-2xl">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic">Admin <span className="text-[#8b5cf6]">Panel</span></h1>
        <nav className="flex flex-col gap-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`text-left px-4 py-3 rounded-xl transition-all uppercase text-[10px] font-mono tracking-widest ${activeTab === tab.id ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-500/20' : 'hover:bg-white/5 text-[#7a7085]'}`}>
              {tab.label}
            </button>
          ))}
        </nav>
        <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="mt-auto text-[10px] font-mono text-red-500 hover:bg-red-500/10 p-3 rounded-xl transition-all text-center">ÇIKIŞ YAP</button>
      </div>

      <div className="flex-1 p-12 overflow-y-auto h-screen">

        {/* PROJELER */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-[fadeInUp_0.4s_ease-out]">
            <div className="lg:col-span-1 bg-white/[0.02] border border-white/10 p-8 rounded-3xl h-fit shadow-xl">
              <h2 className="text-lg font-bold mb-6 italic">{editingProjectId ? 'Projeyi Düzenle' : 'Yeni Proje Yayınla'}</h2>
              <form onSubmit={handleAddProject} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input className={inputCls} placeholder="Başlık (TR)" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} required />
                  <input className={inputCls} placeholder="Başlık (EN)" value={newProject.titleEn} onChange={e => setNewProject({ ...newProject, titleEn: e.target.value })} />
                </div>
                <textarea className={`${inputCls} h-20 resize-none`} placeholder="Açıklama (TR)" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} required></textarea>
                <textarea className={`${inputCls} h-20 resize-none`} placeholder="Açıklama (EN)" value={newProject.descriptionEn} onChange={e => setNewProject({ ...newProject, descriptionEn: e.target.value })}></textarea>
                <input className={inputCls} placeholder="Teknolojiler (virgülle)" value={newProject.technologies} onChange={e => setNewProject({ ...newProject, technologies: e.target.value })} />
                <input className={inputCls} placeholder="Geliştirme Süresi (Örn: 3 hafta)" value={newProject.duration || ''} onChange={e => setNewProject({ ...newProject, duration: e.target.value })} />
                <input className={inputCls} placeholder="GitHub URL" value={newProject.githubUrl} onChange={e => setNewProject({ ...newProject, githubUrl: e.target.value })} />
                <input className={inputCls} placeholder="Canlı Site URL" value={newProject.liveUrl} onChange={e => setNewProject({ ...newProject, liveUrl: e.target.value })} />
                <button type="submit" className="w-full bg-[#8b5cf6] py-4 rounded-xl font-bold hover:scale-[1.01] transition-all">
                  {editingProjectId ? 'Projeyi Güncelle' : 'Projeyi Kaydet'}
                </button>
                {editingProjectId && (
                  <button type="button" onClick={() => { setEditingProjectId(null); setNewProject({ title: '', titleEn: '', description: '', descriptionEn: '', technologies: '', duration: '', githubUrl: '', liveUrl: '' }); }} className="w-full bg-white/10 py-4 rounded-xl font-bold hover:scale-[1.01] transition-all mt-2">İptal Et</button>
                )}
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold mb-4 italic">Projeler ({projects.length})</h2>
              {projects.map((p, index) => (
                <div key={p.id}
                     draggable
                     onDragStart={() => (dragItem.current = index)}
                     onDragEnter={() => (dragOverItem.current = index)}
                     onDragEnd={handleSortProjects}
                     onDragOver={(e) => e.preventDefault()}
                     className={`bg-white/[0.02] border p-6 rounded-2xl flex justify-between items-center group transition-all border-l-2 cursor-grab active:cursor-grabbing ${p.isActive !== false ? 'border-white/5 border-l-[#8b5cf6] hover:border-white/20' : 'border-red-500/10 border-l-red-500 hover:border-red-500/30'}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[#F8F7F9]">{p.title} <span className="text-[10px] text-[#8b5cf6] font-mono ml-2">{p.titleEn ? 'TR/EN' : 'TR'}</span></h3>
                      {p.isActive === false && <span className="text-[10px] font-mono text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">Pasif</span>}
                    </div>
                    <p className="text-xs text-[#7a7085] mt-1">{p.technologies}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleToggleProjectActive(p.id)} className={`p-3 rounded-xl text-xs ${p.isActive !== false ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'}`}>
                      {p.isActive !== false ? 'Pasife Al' : 'Aktife Al'}
                    </button>
                    <button onClick={() => handleEditProject(p)} className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white text-xs">Düzenle</button>
                    <button onClick={() => handleDeleteProject(p.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white text-xs">Sil</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* YETENEKLER */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-[fadeInUp_0.4s_ease-out]">
            <div className="lg:col-span-1 bg-white/[0.02] border border-white/10 p-8 rounded-3xl h-fit shadow-xl">
              <h2 className="text-lg font-bold mb-6 italic">Yeni Yetenek</h2>
              <form onSubmit={handleAddSkill} className="space-y-3">
                <input className={inputCls} placeholder="Yetenek Adı" value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} required />
                <select className={inputCls} value={newSkill.category} onChange={e => setNewSkill({ ...newSkill, category: e.target.value })} required>
                  <option value="">Kategori Seç</option>
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Mobil">Mobil</option>
                  <option value="Genel">Genel</option>
                </select>
                <input type="number" className={inputCls} placeholder="Sıralama No" value={newSkill.orderIndex} onChange={e => setNewSkill({ ...newSkill, orderIndex: parseInt(e.target.value) || 0 })} />
                <button type="submit" className="w-full bg-[#8b5cf6] py-4 rounded-xl font-bold hover:scale-[1.01] transition-all">Sisteme Ekle</button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-2">
              <h2 className="text-lg font-bold mb-4 italic">Yayındaki Yetenekler</h2>
              {skills.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)).map(s => (
                <div key={s.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex justify-between items-center group hover:border-white/10">
                  <span className="text-sm italic"><span className="text-[#8b5cf6] font-mono mr-3">#{s.orderIndex}</span>{s.name} <small className="text-[#7a7085] ml-2">[{s.category || 'Belirsiz'}]</small></span>
                  <button onClick={() => handleDeleteSkill(s.id)} className="text-red-500 opacity-0 group-hover:opacity-100 text-xs hover:underline">SİL</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EĞİTİM */}
        {activeTab === 'education' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-[fadeInUp_0.4s_ease-out]">
            <div className="lg:col-span-1 bg-white/[0.02] border border-white/10 p-8 rounded-3xl h-fit shadow-xl">
              <h2 className="text-lg font-bold mb-6 italic">{editingEducationId ? 'Eğitimi Düzenle' : 'Yeni Eğitim Ekle'}</h2>
              <form onSubmit={handleAddEducation} className="space-y-3">
                <select className={inputCls} value={newEducation.educationType} onChange={e => setNewEducation({ ...newEducation, educationType: e.target.value })} required>
                  <option value="Üniversite">🎓 Üniversite</option>
                  <option value="Lise">🏫 Lise</option>
                  <option value="Sertifika">📜 Sertifika / Kurs</option>
                  <option value="Diğer">📌 Diğer</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input className={inputCls} placeholder="Okul / Kurum Adı (TR)" value={newEducation.schoolName} onChange={e => setNewEducation({ ...newEducation, schoolName: e.target.value })} required />
                  <input className={inputCls} placeholder="Okul / Kurum Adı (EN)" value={newEducation.schoolNameEn || ''} onChange={e => setNewEducation({ ...newEducation, schoolNameEn: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className={inputCls} placeholder="Bölüm / Program (TR)" value={newEducation.department} onChange={e => setNewEducation({ ...newEducation, department: e.target.value })} />
                  <input className={inputCls} placeholder="Bölüm / Program (EN)" value={newEducation.departmentEn || ''} onChange={e => setNewEducation({ ...newEducation, departmentEn: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className={inputCls} placeholder="Başlangıç (Örn: 2020)" value={newEducation.startDate} onChange={e => setNewEducation({ ...newEducation, startDate: e.target.value })} />
                  <div>
                    <input className={inputCls} placeholder="Bitiş (Örn: 2024)" value={newEducation.endDate} onChange={e => setNewEducation({ ...newEducation, endDate: e.target.value })} disabled={isEducationContinuing} />
                    <div className="flex items-center gap-2 mt-2 ml-1">
                      <input type="checkbox" id="continuing" checked={isEducationContinuing} onChange={(e) => {
                          setIsEducationContinuing(e.target.checked);
                          setNewEducation({ ...newEducation, endDate: e.target.checked ? 'Devam Ediyor' : '' });
                      }} className="w-4 h-4 accent-[#8b5cf6] cursor-pointer" />
                      <label htmlFor="continuing" className="text-xs text-[#7a7085] cursor-pointer hover:text-white transition-colors">Hala devam ediyor musunuz?</label>
                    </div>
                  </div>
                </div>
                <textarea className={`${inputCls} h-20 resize-none`} placeholder="Açıklama / Başarılar (TR)" value={newEducation.description} onChange={e => setNewEducation({ ...newEducation, description: e.target.value })}></textarea>
                <textarea className={`${inputCls} h-20 resize-none`} placeholder="Açıklama / Başarılar (EN)" value={newEducation.descriptionEn || ''} onChange={e => setNewEducation({ ...newEducation, descriptionEn: e.target.value })}></textarea>
                <button type="submit" className="w-full bg-[#8b5cf6] py-4 rounded-xl font-bold hover:scale-[1.01] transition-all">
                  {editingEducationId ? 'Eğitimi Güncelle' : 'Eğitimi Kaydet'}
                </button>
                {editingEducationId && (
                  <button type="button" onClick={() => { setEditingEducationId(null); setIsEducationContinuing(false); setNewEducation({ schoolName: '', schoolNameEn: '', department: '', departmentEn: '', startDate: '', endDate: '', description: '', descriptionEn: '', educationType: 'Üniversite', orderIndex: 0 }); }} className="w-full bg-white/10 py-4 rounded-xl font-bold hover:scale-[1.01] transition-all mt-2">İptal Et</button>
                )}
              </form>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold mb-4 italic">Eğitim Bilgileri ({educations.length})</h2>
              {educations.length === 0 ? <p className="text-[#50455e]">Henüz eğitim bilgisi yok.</p> :
                educations.map((ed, index) => (
                  <div key={ed.id} 
                       draggable
                       onDragStart={() => (dragItem.current = index)}
                       onDragEnter={() => (dragOverItem.current = index)}
                       onDragEnd={handleSortEducations}
                       onDragOver={(e) => e.preventDefault()}
                       className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl relative group hover:border-white/20 transition-all border-l-2 border-l-[#8b5cf6] cursor-grab active:cursor-grabbing">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-[#F8F7F9]">{ed.schoolName}</h3>
                          {ed.educationType && <span className="text-[10px] font-mono text-[#8b5cf6] bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 px-2 py-0.5 rounded-full">{ed.educationType}</span>}
                        </div>
                        {ed.department && <p className="text-sm text-[#928b9c]">{ed.department}</p>}
                        <p className="text-xs text-[#7a7085] mt-1">{ed.startDate}{ed.endDate ? ` — ${ed.endDate}` : ''}</p>
                        {ed.description && <p className="text-xs text-[#928b9c] mt-2 line-clamp-2">{ed.description}</p>}
                        {ed.descriptionEn && <p className="text-xs text-[#8b5cf6]/60 mt-1 line-clamp-1 italic">{ed.descriptionEn}</p>}
                      </div>
                      <div className="flex gap-4 ml-4">
                        <button onClick={() => handleEditEducation(ed)} className="text-blue-500 text-xs opacity-0 group-hover:opacity-100 transition-all hover:underline">DÜZENLE</button>
                        <button onClick={() => handleDeleteEducation(ed.id)} className="text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-all hover:underline">SİL</button>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* MESAJLAR */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-[fadeInUp_0.4s_ease-out]">
            <h2 className="text-2xl font-bold mb-8 italic">Gelen Mesajlar ({messages.length})</h2>
            {messages.length === 0
              ? <p className="text-[#50455e]">Henüz mesajınız yok.</p>
              : messages.map(m => (
                <div key={m.id} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl relative group border-l-2 border-l-[#8b5cf6]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-[#F8F7F9]">{m.senderName}</h4>
                      <p className="text-[#7a7085] text-xs">{m.senderEmail}</p>
                      {m.subject && <p className="text-[#8b5cf6] text-xs mt-1 font-mono">{m.subject}</p>}
                    </div>
                    <div className="text-right">
                      {m.sentAt && <p className="text-[#50455e] text-[10px] mb-2">{new Date(m.sentAt).toLocaleString('tr-TR')}</p>}
                      <button onClick={() => handleDeleteMessage(m.id)} className="text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-all hover:underline">SİL</button>
                    </div>
                  </div>
                  <p className="text-[#928b9c] text-sm leading-relaxed italic">"{m.content}"</p>
                </div>
              ))
            }
          </div>
        )}

        {/* PROFİL */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl bg-white/[0.02] border border-white/10 p-10 rounded-3xl animate-[fadeInUp_0.4s_ease-out] shadow-xl">
            <h2 className="text-xl font-bold mb-8 italic">Site Metinlerini ve Linkleri Güncelle</h2>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase text-[#7a7085] font-mono mb-2 block tracking-widest">Ad Soyad</label>
                <input type="text" className={inputCls + ' p-4'} value={profile.fullName || ''} onChange={e => setProfile({ ...profile, fullName: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase text-[#7a7085] font-mono mb-2 block tracking-widest">Unvan (TR)</label>
                  <input type="text" className={inputCls + ' p-4'} value={profile.title || ''} onChange={e => setProfile({ ...profile, title: e.target.value })} required />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-[#7a7085] font-mono mb-2 block tracking-widest">Unvan (EN)</label>
                  <input type="text" className={inputCls + ' p-4'} value={profile.titleEn || ''} onChange={e => setProfile({ ...profile, titleEn: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase text-[#7a7085] font-mono mb-2 block tracking-widest">Hakkımda (TR)</label>
                  <textarea className={inputCls + ' h-40 resize-none p-4'} value={profile.bio || ''} onChange={e => setProfile({ ...profile, bio: e.target.value })} required></textarea>
                </div>
                <div>
                  <label className="text-[10px] uppercase text-[#7a7085] font-mono mb-2 block tracking-widest">Hakkımda (EN)</label>
                  <textarea className={inputCls + ' h-40 resize-none p-4'} value={profile.bioEn || ''} onChange={e => setProfile({ ...profile, bioEn: e.target.value })}></textarea>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-6">
                <div>
                  <label className="text-[10px] uppercase text-[#7a7085] font-mono mb-2 block tracking-widest">GitHub</label>
                  <input type="text" className={`${inputCls} p-3 text-xs`} value={profile.githubLink || ''} onChange={e => setProfile({ ...profile, githubLink: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-[#7a7085] font-mono mb-2 block tracking-widest">LinkedIn</label>
                  <input type="text" className={`${inputCls} p-3 text-xs`} value={profile.linkedinLink || ''} onChange={e => setProfile({ ...profile, linkedinLink: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-[#7a7085] font-mono mb-2 block tracking-widest">Email</label>
                  <input type="email" className={`${inputCls} p-3 text-xs`} value={profile.email || ''} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#8b5cf6] py-4 rounded-xl font-bold hover:scale-[1.01] transition-all mt-4">Değişiklikleri Kaydet</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;