import React, { useState } from 'react';
import { Sparkles, Compass, CloudSun, Backpack, RotateCcw } from 'lucide-react';

export default function EspacoReflexao() {
  const [subAba, setSubAba] = useState<'cartas' | 'clima' | 'mochila'>('cartas');

  // --- Cartas Terapêuticas ---
  const cartas = [
    {
      pergunta: "O que você tem exigido de si mesmo hoje que jamais exigiria de um amigo querido?",
      dica: "Permita-se ser tão compassivo consigo mesmo quanto é com os outros."
    },
    {
      pergunta: "Qual pequeno gesto de descanso você pode se permitir nos próximos 15 minutos?",
      dica: "Pausas curtas ajudam a restaurar a clareza mental."
    },
    {
      pergunta: "Se o seu corpo pudesse falar agora, o que ele pediria?",
      dica: "Ouça os sinais físicos de tensão e tente soltar os ombros e a mandíbula."
    },
    {
      pergunta: "Qual preocupação atual está realmente sob o seu controle neste exato momento?",
      dica: "Foque a sua energia apenas no que você pode transformar agora."
    }
  ];
  const [cartaVirada, setCartaVirada] = useState<number | null>(null);

  // --- Clima Interno ---
  const climas = [
    {
      nome: 'Céu Nublado',
      emoji: '☁️',
      leitura: 'Dias nublados pedem introspecção e calma. Não force o sol a aparecer; acolha o ritmo mais lento de hoje.'
    },
    {
      nome: 'Tempestade',
      emoji: '⛈️',
      leitura: 'Quando há muitas emoções agitadas, o melhor abrigo é respirar fundo e lembrar que toda tempestade perde força.'
    },
    {
      nome: 'Sol entre Nuvens',
      emoji: '⛅',
      leitura: 'Mesmo com alguns desafios, existem pontos de clareza e esperança. Valorize essas pequenas brechas de luz.'
    },
    {
      nome: 'Brisa Calma',
      emoji: '🍃',
      leitura: 'Um estado de equilíbrio e presença. Aproveite essa serenidade para organizar seus pensamentos com leveza.'
    }
  ];
  const [climaEscolhido, setClimaEscolhido] = useState<number | null>(null);

  // --- Mochila de Peso Mental ---
  const [pedras, setPedras] = useState([
    'Cobrança com os estudos / TCC',
    'Medo de não dar conta',
    'Querer agradar a todos',
    'Cansaço acumulado da semana',
    'Excesso de comparações'
  ]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          Autoconhecimento & Reflexão
        </span>
        <h2 className="text-3xl font-bold text-slate-900">Espaço de Insights</h2>
        <p className="text-slate-600 text-sm max-w-lg mx-auto">
          Ferramentas visuais e reflexivas para ajudar a organizar o que você está sentindo com total leveza.
        </p>
      </div>

      {/* Navegação Interna */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setSubAba('cartas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            subAba === 'cartas' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4" /> Cartas Terapêuticas
        </button>
        <button
          onClick={() => setSubAba('clima')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            subAba === 'clima' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CloudSun className="w-4 h-4" /> Clima Interno
        </button>
        <button
          onClick={() => setSubAba('mochila')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
            subAba === 'mochila' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Backpack className="w-4 h-4" /> Peso Mental
        </button>
      </div>

      {/* Conteúdo da Sub-Aba Selecionada */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 min-h-[360px] flex flex-col items-center justify-center">
        
        {/* 1. CARTAS TERAPÊUTICAS */}
        {subAba === 'cartas' && (
          <div className="w-full max-w-2xl text-center space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Oráculo da Reflexão</h3>
            <p className="text-xs text-slate-500">Escolha uma carta abaixo para revelar uma pergunta de acolhimento.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {cartas.map((carta, idx) => {
                const virada = cartaVirada === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setCartaVirada(idx)}
                    className={`h-48 rounded-2xl p-4 transition-all duration-300 flex flex-col items-center justify-center text-center shadow-md ${
                      virada
                        ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 text-xs font-medium space-y-2'
                        : 'bg-gradient-to-br from-emerald-800 to-teal-900 text-emerald-100 hover:-translate-y-1'
                    }`}
                  >
                    {virada ? (
                      <>
                        <p className="font-bold">“{carta.pergunta}”</p>
                        <span className="text-[10px] text-emerald-700 block pt-1">{carta.dica}</span>
                      </>
                    ) : (
                      <Sparkles className="w-8 h-8 opacity-80" />
                    )}
                  </button>
                );
              })}
            </div>
            {cartaVirada !== null && (
              <button
                onClick={() => setCartaVirada(null)}
                className="text-xs text-emerald-700 font-bold underline pt-2"
              >
                Escolher outra carta
              </button>
            )}
          </div>
        )}

        {/* 2. MAPEIADOR DE CLIMA INTERNO */}
        {subAba === 'clima' && (
          <div className="w-full max-w-xl text-center space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Como está o seu clima interno neste momento?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {climas.map((c, idx) => (
                <button
                  key={c.nome}
                  onClick={() => setClimaEscolhido(idx)}
                  className={`p-4 rounded-2xl border transition flex flex-col items-center gap-2 ${
                    climaEscolhido === idx
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-3xl">{c.emoji}</span>
                  <span className="text-xs font-bold text-slate-700">{c.nome}</span>
                </button>
              ))}
            </div>
            {climaEscolhido !== null && (
              <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-sm text-emerald-950 leading-relaxed animate-fade-in">
                {climas[climaEscolhido].leitura}
              </div>
            )}
          </div>
        )}

        {/* 3. ORGANIZADOR DE PESO MENTAL */}
        {subAba === 'mochila' && (
          <div className="w-full max-w-lg text-center space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Organizador de Peso Mental</h3>
            <p className="text-xs text-slate-500">
              Clique nas pedras abaixo para deixá-las no chão e aliviar o peso que você está carregando hoje.
            </p>
            <div className="flex flex-wrap justify-center gap-3 min-h-[120px] items-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              {pedras.length === 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-emerald-700 font-bold">
                    Sua mochila está leve agora. Respire fundo e aproveite esse momento de alívio! 🍃
                  </p>
                  <button
                    onClick={() => setPedras([
                      'Cobrança com os estudos / TCC',
                      'Medo de não dar conta',
                      'Querer agradar a todos',
                      'Cansaço acumulado da semana',
                      'Excesso de comparações'
                    ])}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Colocar pedras de volta
                  </button>
                </div>
              ) : (
                pedras.map((pedra) => (
                  <button
                    key={pedra}
                    onClick={() => setPedras(pedras.filter((p) => p !== pedra))}
                    className="bg-slate-700 hover:bg-slate-800 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow transition flex items-center gap-2 group"
                  >
                    🪨 {pedra} <span className="text-emerald-400 text-[10px] group-hover:underline">(deixar no chão)</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}