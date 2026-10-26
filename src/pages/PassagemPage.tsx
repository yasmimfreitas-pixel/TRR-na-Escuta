import React, { useState } from 'react';

type Turno = 'Manhã' | 'Tarde' | 'Noite' | 'Manhã e Tarde';

type AdmissionItem = {
  id: string;
  postoLeito: string;
  detalhes: string;
};

type FormState = {
  dataPlantao: string;
  medico: string;
  turno: Turno;
  spa: string;
  ute: string;
  posto5: string;
  posto6: string;
  posto7: string;
  outros: string;
  reavaliacoes: string;
  pacientesEncaminhadosSala: string;
  pacientesNaSala: string;
  pacientes12h: string;
  permanenciaDetalhe: string;
  encaminhadosUti: string;
  retornoEnfermaria: string;
  transferenciasExternas: string;
  obitosAssistencia: string;
  pacienteEmEspera: 'Sim' | 'Não';
  localLeito: string;
  destino: 'UTI' | 'Enfermaria' | 'Transferência externa' | '';
  comunicacoes: {
    uti: boolean;
    enfermaria: boolean;
    nir: boolean;
    samu: boolean;
  };
  pendenciaDestino: string;
  pendenciaProximoPlantao: 'Sim' | 'Não';
  pendenciaDescricao: string;
  situacaoCritica: 'NaoHa' | 'SimComunicada' | 'SimPendente';
  situacaoCriticaDetalhe: string;
  horarioRegistro: string;
};

const GOOGLE_SHEET_WEB_APP_URL = 
  'https://script.google.com/macros/s/AKfycbz1GiYwQpcu0cvnMCqsLi_k3ttZTU1Ng2KRckhG1o97vrZ6j1gsc8bxd7x5GUVannz0XA/exec';

const createEmptyAdmission = (): AdmissionItem => ({
  id: `${Date.now()}-${Math.random()}`,
  postoLeito: '',
  detalhes: '',
});

const initialState: FormState = {
  dataPlantao: '02/10/26',
  medico: 'Yasmim Freitas',
  turno: 'Tarde',
  spa: '2',
  ute: '0',
  posto5: '0',
  posto6: '0',
  posto7: '2',
  outros: '',
  reavaliacoes: '1',
  pacientesEncaminhadosSala: '01',
  pacientesNaSala: '0',
  pacientes12h: '1',
  permanenciaDetalhe:
    'URR L. 436: Vigilância Neurológica, clinicamente estável, fora do perfil UTI no momento.',
  encaminhadosUti: '00',
  retornoEnfermaria: '01',
  transferenciasExternas: 'zero',
  obitosAssistencia: 'zero',
  pacienteEmEspera: 'Não',
  localLeito: '',
  destino: '',
  comunicacoes: {
    uti: false,
    enfermaria: false,
    nir: false,
    samu: false,
  },
  pendenciaDestino: '',
  pendenciaProximoPlantao: 'Não',
  pendenciaDescricao: '',
  situacaoCritica: 'NaoHa',
  situacaoCriticaDetalhe: '',
  horarioRegistro: '20h',
};

export const PassagemPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [form, setForm] = useState<FormState>(initialState);
  const [admissoesList, setAdmissoesList] = useState<AdmissionItem[]>([
    createEmptyAdmission(),
  ]);

  const totalAdmissoes = admissoesList.length;

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateCommunicacao = (key: keyof FormState['comunicacoes']) => {
    setForm((prev) => ({
      ...prev,
      comunicacoes: {
        ...prev.comunicacoes,
        [key]: !prev.comunicacoes[key],
      },
    }));
  };

  const addAdmission = () => {
    setAdmissoesList((prev) => [...prev, createEmptyAdmission()]);
  };

  const updateAdmission = (id: string, field: keyof AdmissionItem, value: string) => {
    setAdmissoesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeAdmission = (id: string) => {
    setAdmissoesList((prev) => {
      if (prev.length === 1) {
        return [createEmptyAdmission()];
      }

      return prev.filter((item) => item.id !== id);
    });
  };

  const buildShareText = () => {
    const linhas = [
      'TRR - Passagem de Plantão',
      `Data: ${form.dataPlantao}`,
      `Médico: ${form.medico}`,
      `Turno: ${form.turno}`,
      `SPA: ${form.spa}`,
      `UTE: ${form.ute}`,
      `Posto 5: ${form.posto5}`,
      `Posto 6: ${form.posto6}`,
      `Posto 7: ${form.posto7}`,
      `Outros: ${form.outros || 'Nenhum'}`,
      `Reavaliações sem novo acionamento: ${form.reavaliacoes}`,
      `Admissões: ${admissoesList.length}`,
      `Pacientes encaminhados à sala: ${form.pacientesEncaminhadosSala}`,
      `Pacientes na sala ao encerramento: ${form.pacientesNaSala}`,
      `Pacientes >= 12h: ${form.pacientes12h}`,
      `Det. permanência: ${form.permanenciaDetalhe || 'Nenhuma'}`,
      `Encaminhados à UTI: ${form.encaminhadosUti}`,
      `Retorno enfermaria: ${form.retornoEnfermaria}`,
      `Transferências externas: ${form.transferenciasExternas}`,
      `Óbitos: ${form.obitosAssistencia}`,
      `Paciente aguardando destino: ${form.pacienteEmEspera}`,
      `Local/leito: ${form.localLeito || 'Nenhum'}`,
      `Destino: ${form.destino || 'Nenhum'}`,
      `Pendência para próximo plantão: ${form.pendenciaProximoPlantao}`,
      `Descrição: ${form.pendenciaDescricao || 'Nenhuma'}`,
      `Situação crítica: ${form.situacaoCritica === 'NaoHa' ? 'Não' : form.situacaoCritica === 'SimComunicada' ? 'Sim, comunicada' : 'Sim, pendente'}`,
      `Detalhe: ${form.situacaoCriticaDetalhe || 'Nenhum'}`,
      `Horário: ${form.horarioRegistro}`,
    ];

    return linhas.join('\n');
  };

  const handleSave = async () => {
    const payload = {
      dataPlantao: form.dataPlantao,
      medico: form.medico,
      turno: form.turno,
      atuacaoTRR: {
        acionamentosRecebidos: {
          SPA: form.spa,
          UTE: form.ute,
          Posto5: form.posto5,
          Posto6: form.posto6,
          Posto7: form.posto7,
          Outros: form.outros,
        },
        reavaliacoesSemNovoAcionamento: form.reavaliacoes,
      },
      admissoes: admissoesList,
      totalAdmissoes,
      salaTRR: {
        pacientesEncaminhados: form.pacientesEncaminhadosSala,
        pacientesNaSalaAoEncerramento: form.pacientesNaSala,
        pacientesPermanencia12h: form.pacientes12h,
        detalhePermanencia: form.permanenciaDetalhe,
      },
      destinoDosPacientes: {
        encaminhadosUti: form.encaminhadosUti,
        retornoEnfermaria: form.retornoEnfermaria,
        transferenciasExternas: form.transferenciasExternas,
        obitosDuranteAssistencia: form.obitosAssistencia,
      },
      pacientesAguardandoDestino: {
        haPaciente: form.pacienteEmEspera === 'Sim',
        localLeito: form.localLeito,
        destino: form.destino,
        comunicacoesRealizadas: Object.entries(form.comunicacoes)
          .filter(([, value]) => value)
          .map(([key]) => key),
        pendencia: form.pendenciaDestino,
      },
      pendenciasProximoPlantao: {
        haPendencia: form.pendenciaProximoPlantao === 'Sim',
        descricao: form.pendenciaDescricao,
      },
      segurancaNaPassagem: {
        situacaoCritica: form.situacaoCritica,
        detalhe: form.situacaoCriticaDetalhe,
      },
      horarioRegistro: form.horarioRegistro,
      salvoEm: new Date().toLocaleString('pt-BR'),
    };

    try {
      const response = await fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Erro ao salvar na planilha.');
      }

      alert('Passagem salva com sucesso na planilha!');
    } catch (error) {
      console.error(error);
      alert('Não foi possível salvar na planilha. Verifique a URL do Apps Script.');
    }
  };

  const handleShare = async () => {
    const text = buildShareText();

    try {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error(error);
      alert('Não foi possível abrir o WhatsApp.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave();
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <span>←</span>
            Voltar
          </button>

          <div className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 shadow-sm">
            TRR
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_18px_50px_rgba(59,130,246,0.08)]"
        >
          <div className="bg-gradient-to-r from-[#1f5ecc] via-[#3d9af7] to-[#71d8d0] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-100">TRR na Escuta</p>
            <h1 className="mt-3 text-3xl font-black text-white">PASSAGEM DE PLANTÃO – TRR</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-50">
              Informar 0 quando não houver ocorrência. Marcar os turnos efetivamente trabalhados.
              Preencher apenas os campos aplicáveis e assinalar somente as comunicações realizadas.
            </p>
          </div>

          <div className="space-y-8 p-4 sm:p-6 lg:p-8">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-bold text-slate-900">Identificação</h2>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Data do plantão</span>
                  <input
                    type="text"
                    value={form.dataPlantao}
                    onChange={(e) => updateField('dataPlantao', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Médico</span>
                  <input
                    type="text"
                    value={form.medico}
                    onChange={(e) => updateField('medico', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500"
                  />
                </label>
              </div>

              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-slate-700">Plantão encerrado</p>
                <div className="flex flex-wrap gap-4">
                  {(['Manhã', 'Tarde', 'Noite', 'Manhã e Tarde'] as Turno[]).map((turno) => (
                    <label key={turno} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="radio"
                        name="turno"
                        value={turno}
                        checked={form.turno === turno}
                        onChange={() => updateField('turno', turno)}
                        className="h-4 w-4 accent-sky-600"
                      />
                      {turno}
                    </label>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-bold text-slate-900">Atuação do TRR</h2>

              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-slate-700">Acionamentos recebidos</p>
                <div className="grid gap-4 md:grid-cols-5">
                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-600">SPA</span>
                    <input
                      type="number"
                      value={form.spa}
                      onChange={(e) => updateField('spa', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-600">UTE</span>
                    <input
                      type="number"
                      value={form.ute}
                      onChange={(e) => updateField('ute', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-600">Posto 5</span>
                    <input
                      type="number"
                      value={form.posto5}
                      onChange={(e) => updateField('posto5', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-600">Posto 6</span>
                    <input
                      type="number"
                      value={form.posto6}
                      onChange={(e) => updateField('posto6', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm text-slate-600">Posto 7</span>
                    <input
                      type="number"
                      value={form.posto7}
                      onChange={(e) => updateField('posto7', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                    />
                  </label>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Outros (informar local e número)
                    </span>
                    <input
                      type="text"
                      value={form.outros}
                      onChange={(e) => updateField('outros', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Reavaliações sem novo acionamento
                  </span>
                  <input
                    type="text"
                    value={form.reavaliacoes}
                    onChange={(e) => updateField('reavaliacoes', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-bold text-slate-900">Admissões</h2>

              <div className="mt-5 space-y-4">
                {admissoesList.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-700">Item {index + 1}</p>

                      <button
                        type="button"
                        onClick={() => removeAdmission(item.id)}
                        className="text-xs font-semibold text-red-600 transition hover:text-red-700"
                      >
                        Remover
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-700">
                          Posto - Leito
                        </span>
                        <input
                          type="text"
                          value={item.postoLeito}
                          onChange={(e) => updateAdmission(item.id, 'postoLeito', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                          placeholder="Ex: URR L. 436"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-700">Detalhes</span>
                        <input
                          type="text"
                          value={item.detalhes}
                          onChange={(e) => updateAdmission(item.id, 'detalhes', e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                          placeholder="Ex: vigilância neurológica"
                        />
                      </label>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addAdmission}
                  className="inline-flex items-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  + Adicionar item
                </button>
              </div>

              <div className="mt-4 text-sm font-semibold text-slate-700">
                Total final: <span className="text-sky-700">{totalAdmissoes}</span>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-bold text-slate-900">Sala do TRR</h2>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Pacientes encaminhados à sala durante o plantão
                  </span>
                  <input
                    type="text"
                    value={form.pacientesEncaminhadosSala}
                    onChange={(e) => updateField('pacientesEncaminhadosSala', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Pacientes na sala ao encerramento
                  </span>
                  <input
                    type="text"
                    value={form.pacientesNaSala}
                    onChange={(e) => updateField('pacientesNaSala', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Pacientes com permanência ≥12 horas
                  </span>
                  <input
                    type="text"
                    value={form.pacientes12h}
                    onChange={(e) => updateField('pacientes12h', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                  />
                </label>

                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Se ≥12h, informar leito, tempo e motivo
                  </span>
                  <textarea
                    value={form.permanenciaDetalhe}
                    onChange={(e) => updateField('permanenciaDetalhe', e.target.value)}
                    className="min-h-[110px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-bold text-slate-900">Destino dos pacientes</h2>

              <div className="mt-5 grid gap-5 md:grid-cols-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Encaminhados à UTI
                  </span>
                  <input
                    type="text"
                    value={form.encaminhadosUti}
                    onChange={(e) => updateField('encaminhadosUti', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Retorno/encaminhamento à enfermaria
                  </span>
                  <input
                    type="text"
                    value={form.retornoEnfermaria}
                    onChange={(e) => updateField('retornoEnfermaria', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Transferências externas/vaga zero
                  </span>
                  <input
                    type="text"
                    value={form.transferenciasExternas}
                    onChange={(e) => updateField('transferenciasExternas', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Óbitos durante assistência do TRR
                  </span>
                  <input
                    type="text"
                    value={form.obitosAssistencia}
                    onChange={(e) => updateField('obitosAssistencia', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-bold text-slate-900">Pacientes aguardando destino</h2>

              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-slate-700">Há paciente nessa situação?</p>
                <div className="flex flex-wrap gap-4">
                  {(['Não', 'Sim'] as const).map((item) => (
                    <label key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="radio"
                        name="pacienteEmEspera"
                        value={item}
                        checked={form.pacienteEmEspera === item}
                        onChange={() => updateField('pacienteEmEspera', item)}
                        className="h-4 w-4 accent-sky-600"
                      />
                      {item}
                    </label>
                  ))}
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Local/leito</span>
                    <input
                      type="text"
                      value={form.localLeito}
                      onChange={(e) => updateField('localLeito', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Destino</span>
                    <select
                      value={form.destino}
                      onChange={(e) => updateField('destino', e.target.value as FormState['destino'])}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                    >
                      <option value="">Selecione</option>
                      <option value="UTI">UTI</option>
                      <option value="Enfermaria">Enfermaria</option>
                      <option value="Transferência externa">Transferência externa</option>
                    </select>
                  </label>
                </div>

                <div className="mt-5">
                  <p className="mb-3 text-sm font-semibold text-slate-700">Comunicações realizadas</p>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { key: 'uti', label: 'Médico da UTI' },
                      { key: 'enfermaria', label: 'Equipe da enfermaria' },
                      { key: 'nir', label: 'NIR' },
                      { key: 'samu', label: 'SAMU' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={form.comunicacoes[item.key as keyof typeof form.comunicacoes]}
                          onChange={() => updateCommunicacao(item.key as keyof typeof form.comunicacoes)}
                          className="h-4 w-4 accent-sky-600"
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Pendência (se houver)
                    </span>
                    <input
                      type="text"
                      value={form.pendenciaDestino}
                      onChange={(e) => updateField('pendenciaDestino', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                    />
                  </label>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-bold text-slate-900">Pendências para o próximo plantão</h2>

              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  Há paciente ou situação que precisa de acompanhamento ou resolução?
                </p>
                <div className="flex flex-wrap gap-4">
                  {(['Não', 'Sim'] as const).map((item) => (
                    <label key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="radio"
                        name="pendenciaProximoPlantao"
                        value={item}
                        checked={form.pendenciaProximoPlantao === item}
                        onChange={() => updateField('pendenciaProximoPlantao', item)}
                        className="h-4 w-4 accent-sky-600"
                      />
                      {item}
                    </label>
                  ))}
                </div>

                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Se sim, informar local/leito e o que precisa ser feito
                  </span>
                  <textarea
                    value={form.pendenciaDescricao}
                    onChange={(e) => updateField('pendenciaDescricao', e.target.value)}
                    className="min-h-[110px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-xl font-bold text-slate-900">Segurança na passagem</h2>

              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  Há situação crítica ou pendência que exige ação imediata?
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { value: 'NaoHa', label: 'Não' },
                    { value: 'SimComunicada', label: 'Sim, comunicada diretamente ao próximo médico' },
                    { value: 'SimPendente', label: 'Sim, comunicação ainda pendente' },
                  ].map((item) => (
                    <label key={item.value} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="radio"
                        name="situacaoCritica"
                        value={item.value}
                        checked={form.situacaoCritica === item.value}
                        onChange={() => updateField('situacaoCritica', item.value)}
                        className="h-4 w-4 accent-sky-600"
                      />
                      {item.label}
                    </label>
                  ))}
                </div>

                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Se sim, informar local/leito e situação
                  </span>
                  <textarea
                    value={form.situacaoCriticaDetalhe}
                    onChange={(e) => updateField('situacaoCriticaDetalhe', e.target.value)}
                    className="min-h-[110px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500"
                  />
                </label>
              </div>
            </section>

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <span className="font-semibold">Horário do registro:</span>
                <input
                  type="text"
                  value={form.horarioRegistro}
                  onChange={(e) => updateField('horarioRegistro', e.target.value)}
                  className="w-28 rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none transition focus:border-sky-500"
                  placeholder="20h"
                />
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                  Compartilhar no WhatsApp
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(14,165,233,0.35)] transition hover:opacity-90"
                >
                  Salvar passagem
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default PassagemPage;
