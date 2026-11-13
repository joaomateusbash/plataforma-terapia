& "C:\Program Files\Git\bin\git.exe" initimport EspacoReflexao from './EspacoReflexao';
import React, { useState, useEffect } from 'react';
import {
  HeartHandshake, Calendar, Smile, ShieldCheck, ArrowRight,
  User, Mail, FileText, CheckCircle2, LogIn, LogOut, Lock, X
} from 'lucide-react';
import { db, auth } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser
} from 'firebase/auth';
export default function App() {
  // Estado do Usuário Logado
  const [usuario, setUsuario] = useState<FirebaseUser | null>(null);
  const [paginaAtual, setPaginaAtual] = useState<'home' | 'reflexao'>('home');
  // Estados do Modal de Login / Cadastro
  const [modalAberto, setModalAberto] = useState(false);
  const [modoCadastro, setModoCadastro] = useState(false);
  const [authNome, setAuthNome] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authSenha, setAuthSenha] = useState('');
  const [authErro, setAuthErro] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Estados da Plataforma
  const [humor, setHumor] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [terapiaTipo, setTerapiaTipo] = useState('Ansiedade e Estresse');
  const [relato, setRelato] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Observa se o usuário está logado em tempo real
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAtual) => {
      setUsuario(userAtual);
      if (userAtual) {
        setNome(userAtual.displayName || '');
        setEmail(userAtual.email || '');
      } else {
        setNome('');
        setEmail('');
      }
    });
    return () => unsubscribe();
  }, []);

  // Função para Login ou Criação de Conta
  const handleAutenticacao = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErro('');
    setAuthLoading(true);

    try {
      if (modoCadastro) {
        if (!authNome.trim()) {
          setAuthErro('Por favor, informe seu nome.');
          setAuthLoading(false);
          return;
        }
        const credencial = await createUserWithEmailAndPassword(auth, authEmail, authSenha);
        await updateProfile(credencial.user, { displayName: authNome });
        // Força atualização do estado com o nome recém-salvo
        setUsuario({ ...credencial.user, displayName: authNome } as FirebaseUser);
        setNome(authNome);
        setEmail(authEmail);
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authSenha);
      }
      setModalAberto(false);
      setAuthNome('');
      setAuthEmail('');
      setAuthSenha('');
    } catch (err: any) {
      console.error("Detalhes do erro Firebase:", err);
      if (err.code === 'auth/email-already-in-use') {
        setAuthErro('Este e-mail já está cadastrado.');
      } else if (err.code === 'auth/weak-password') {
        setAuthErro('A senha deve ter pelo menos 6 caracteres.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setAuthErro('Ative o login por E-mail/Senha no painel do Firebase.');
      } else if (err.code === 'auth/invalid-api-key') {
        setAuthErro('Chave API inválida. Verifique o arquivo src/firebase.ts.');
      } else {
        setAuthErro(`Erro: ${err.code || err.message}`);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Função para Sair da Conta
  const handleLogout = async () => {
    await signOut(auth);
  };

  // Função para salvar agendamento no Firestore
  const handleSubmitAgendamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email) {
      alert('Por favor, preencha seu nome e e-mail.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "agendamentos"), {
        uid: usuario ? usuario.uid : 'visitante',
        nome,
        email,
        terapiaTipo,
        relato,
        humorDoDia: humor || 'Não informado',
        dataCriacao: new Date().toISOString()
      });
      setSucesso(true);
      setRelato('');
    } catch (error) {
      console.error("Erro ao salvar no Firebase: ", error);
      alert('Erro ao salvar os dados. Verifique a configuração do Firebase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header / Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-700">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-emerald-900 tracking-tight">Equilíbrio & Mente</span>
          </div>

          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
  <button onClick={() => setPaginaAtual('home')} className={`transition ${paginaAtual === 'home' ? 'text-emerald-700 font-bold' : 'hover:text-emerald-700'}`}>
    Início & Agendamento
  </button>
  <button onClick={() => setPaginaAtual('reflexao')} className={`transition ${paginaAtual === 'reflexao' ? 'text-emerald-700 font-bold' : 'hover:text-emerald-700'}`}>
    ✨ Espaço de Reflexão
  </button>
</nav>

          {/* Área de Usuário Logado ou Botão de Login */}
          <div className="flex items-center gap-3">
            {usuario ? (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl">
                <span className="text-sm font-semibold text-emerald-900">
                  Olá, {usuario.displayName || 'Paciente'}
                </span>
                <button
                  onClick={handleLogout}
                  title="Sair da conta"
                  className="text-slate-500 hover:text-red-600 transition p-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setModoCadastro(false); setModalAberto(true); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-sm shadow-emerald-200 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Entrar / Cadastrar
              </button>
            )}
          </div>
        </div>
      </header>

      {paginaAtual === 'reflexao' ? (
  <EspacoReflexao />
) : (
  <>
    {/* Aqui continuam a Hero Section, o Diário de Humor e o Formulário de Agendamento */}
  </>
)}

      {/* Hero Section */}
      <section id="inicio" className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4" /> Ambiente Seguro e Confidencial
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Cuidado emocional humanizado e <span className="text-emerald-600">conectado</span>.
          </h1>
          <p className="text-lg text-slate-600">
            Plataforma desenvolvida para acolhimento terapêutico com registro seguro de pacientes e agendamentos em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {!usuario ? (
              <button
                onClick={() => { setModoCadastro(true); setModalAberto(true); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
              >
                Criar Minha Conta <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <a href="#cadastro" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
                Agendar Minha Sessão <ArrowRight className="w-4 h-4" />
              </a>
            )}
            <a href="#humor" className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium px-6 py-3 rounded-xl transition flex items-center justify-center gap-2">
              Check-in de Humor
            </a>
          </div>
        </div>

        {/* Card Dinâmico */}
        <div className="bg-gradient-to-br from-emerald-100 to-teal-50 p-8 rounded-3xl border border-emerald-200/60 shadow-xl relative overflow-hidden">
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="bg-emerald-500 text-white p-3 rounded-xl">
                <Smile className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">
                  {usuario?.displayName
                    ? `Como você está hoje, ${usuario.displayName}?`
                    : 'Como você está se sentindo hoje?'}
                </h3>
                <p className="text-xs text-slate-500">
                  {usuario
                    ? 'Seu perfil está ativo. Registre seu humor ou agende uma consulta.'
                    : 'Faça login ou cadastre-se para personalizar sua experiência.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diário de Humor */}
      <section id="humor" className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Diário Rápido de Bem-Estar</h2>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {[
              { label: 'Tranquilo(a)', emoji: '🌿', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
              { label: 'Animado(a)', emoji: '☀️', color: 'bg-amber-50 border-amber-200 text-amber-800' },
              { label: 'Pensativo(a)', emoji: '🌊', color: 'bg-blue-50 border-blue-200 text-blue-800' },
              { label: 'Cansado(a)', emoji: '🌙', color: 'bg-purple-50 border-purple-200 text-purple-800' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setHumor(item.label)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition font-medium text-sm ${
                  humor === item.label ? 'ring-2 ring-emerald-600 shadow-md ' + item.color : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-xl">{item.emoji}</span> {item.label}
              </button>
            ))}
          </div>
          {humor && (
            <div className="mt-4 p-4 bg-emerald-50 text-emerald-900 rounded-xl max-w-md mx-auto text-sm border border-emerald-200">
              Humor registrado: <strong>{humor}</strong>. Ele será anexado caso você agende uma sessão abaixo!
            </div>
          )}
        </div>
      </section>

      {/* Seção de Agendamento (Firestore) */}
      <section id="cadastro" className="max-w-3xl mx-auto px-6 py-20">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 space-y-8">
          <div className="space-y-2 text-center">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Agendamento & Triagem
            </span>
            <h2 className="text-3xl font-bold text-slate-900">Solicitar Atendimento</h2>
            <p className="text-slate-500 text-sm">
              Preencha os dados abaixo para registrar sua solicitação no banco de dados.
            </p>
          </div>

          {sucesso ? (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-900">Solicitação Enviada com Sucesso! 🎉</h3>
              <p className="text-xs text-emerald-700">Seus dados foram gravados no Firebase Firestore.</p>
              <button
                onClick={() => setSucesso(false)}
                className="mt-4 bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-medium hover:bg-emerald-700 transition"
              >
                Fazer Novo Agendamento
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitAgendamento} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" /> Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Digite seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-600" /> E-mail de Contato
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" /> Foco do Atendimento
                </label>
                <select
                  value={terapiaTipo}
                  onChange={(e) => setTerapiaTipo(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm bg-white"
                >
                  <option value="Ansiedade e Estresse">Ansiedade e Estresse</option>
                  <option value="Autoconhecimento">Autoconhecimento</option>
                  <option value="Produtividade e Foco nos Estudos">Produtividade e Foco nos Estudos</option>
                  <option value="Apoio Emocional Geral">Apoio Emocional Geral</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" /> Breve Relato ou Expectativa (Opcional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Escreva um pouco sobre o que te traz aqui hoje..."
                  value={relato}
                  onChange={(e) => setRelato(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
              >
                {loading ? 'Salvando...' : 'Confirmar Agendamento'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Modal de Login / Cadastro */}
      {modalAberto && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setModalAberto(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-2xl font-bold text-slate-900">
                {modoCadastro ? 'Criar Nova Conta' : 'Acessar Plataforma'}
              </h3>
              <p className="text-xs text-slate-500">
                {modoCadastro
                  ? 'Cadastre-se para personalizar seu acompanhamento'
                  : 'Entre com seu e-mail e senha cadastrados'}
              </p>
            </div>

            {authErro && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 text-center">
                {authErro}
              </div>
            )}

            <form onSubmit={handleAutenticacao} className="space-y-4">
              {modoCadastro && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" /> Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Como gostaria de ser chamado(a)?"
                    value={authNome}
                    onChange={(e) => setAuthNome(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" /> E-mail
                </label>
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> Senha
                </label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={authSenha}
                  onChange={(e) => setAuthSenha(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-md text-sm"
              >
                {authLoading ? 'Aguarde...' : modoCadastro ? 'Finalizar Cadastro' : 'Entrar'}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              {modoCadastro ? (
                <>
                  Já tem uma conta?{' '}
                  <button
                    onClick={() => { setModoCadastro(false); setAuthErro(''); }}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Fazer Login
                  </button>
                </>
              ) : (
                <>
                  Ainda não tem conta?{' '}
                  <button
                    onClick={() => { setModoCadastro(true); setAuthErro(''); }}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Cadastre-se agora
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <p>Plataforma de Terapia & Bem-Estar 💚</p>
      </footer>
    </div>
  );
}