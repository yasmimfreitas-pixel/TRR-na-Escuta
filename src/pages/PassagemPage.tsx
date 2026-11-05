import React, { useState } from 'react';

// types etc...

export const PassagemPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [form, setForm] = useState<FormState>(initialState);
  const [admissoesList, setAdmissoesList] = useState<AdmissionItem[]>([createEmptyAdmission()]);
  const [isSaving, setIsSaving] = useState(false);

  const admissoesPreenchidas = admissoesList.filter(
    (item) => item.postoLeito.trim() || item.detalhes.trim()
  );
  const totalAdmissoes = admissoesPreenchidas.length;

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const textInput = (field: TextFieldKey, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input
      type="text"
      value={form[field]}
      onChange={(e) => updateField(field, e.target.value)}
      className={inputClass}
      {...extra}
    />
  );

  const numberInput = (field: TextFieldKey) =>
    textInput(field, { inputMode: 'numeric', placeholder: '0' });

  const toggleComunicacao = (key: keyof Comunicacoes) => {
    setForm((prev) => ({
      ...prev,
      comunicacoes: { ...prev.comunicacoes, [key]: !prev.comunicacoes[key] },
    }));
  };

  const addAdmission = () => setAdmissoesList((prev) => [...prev, createEmptyAdmission()]);

  const updateAdmission = (id: string, field: 'postoLeito' | 'detalhes', value: string) => {
    setAdmissoesList((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeAdmission = (id: string) => {
    setAdmissoesList((prev) =>
      prev.length === 1 ? [createEmptyAdmission()] : prev.filter((item) => item.id !== id)
    );
  };

  const comunicacoesRealizadas = (Object.keys(form.comunicacoes) as (keyof Comunicacoes)[])
    .filter((key) => form.comunicacoes[key])
    .map((key) => COMUNICACAO_LABEL[key]);

  const admissoesTexto = admissoesPreenchidas
    .map((item, index) => `${index + 1}. ${item.postoLeito || '-'}: ${item.detalhes || '-'}`)
    .join(' | ');

  const buildShareText = () =>
    [
      '*TRR - Passagem de Plantão*',
      `Data: ${form.dataPlantao || '-'}`,
      `Médico: ${form.medico || '-'}`,
      `Turno: ${form.turno || '-'}`,
      '',
      '*Acionamentos*',
      `SPA: ${form.spa || '0'} | UTE: ${form.ute || '0'} | Posto 5: ${form.posto5 || '0'} | Posto 6: ${form.posto6 || '0'} | Posto 7: ${form.posto7 || '0'}`,
      `Outros: ${form.outros || 'Nenhum'}`,
      `Reavaliações sem novo acionamento: ${form.reavaliacoes || '0'}`,
      '',
      `*Admissões (${totalAdmissoes})*`,
      admissoesTexto || 'Nenhuma',
      '',
      '*Sala do TRR*',
      `Encaminhados à sala: ${form.pacientesEncaminhadosSala || '0'}`,
      `Na sala ao encerramento: ${form.pacientesNaSala || '0'}`,
      `Permanência ≥12h: ${form.pacientes12h || '0'}`,
      `Detalhe: ${form.permanenciaDetalhe || 'Nenhum'}`,
      '',
      '*Destino dos pacientes*',
      `UTI: ${form.encaminhadosUti || '0'} | Enfermaria: ${form.retornoEnfermaria || '0'} | Transf. externas: ${form.transferenciasExternas || '0'} | Óbitos: ${form.obitosAssistencia || '0'}`,
      '',
      '*Aguardando destino*',
      `Há paciente: ${form.pacienteEmEspera || '-'}`,
      `Local/leito: ${form.localLeito || '-'} | Destino: ${form.destino || '-'}`,
      `Comunicações: ${comunicacoesRealizadas.join(', ') || 'Nenhuma'}`,
      `Pendência: ${form.pendenciaDestino || 'Nenhuma'}`,
      '',
      '*Próximo plantão*',
      `Pendência: ${form.pendenciaProximoPlantao || '-'}`,
      `Descrição: ${form.pendenciaDescricao || 'Nenhuma'}`,
      '',
      '*Segurança*',
      `Situação crítica: ${SITUACAO_LABEL[form.situacaoCritica] || '-'}`,
      `Detalhe: ${form.situacaoCriticaDetalhe || 'Nenhum'}`,
      '',
      `Horário do registro: ${form.horarioRegistro || '-'}`,
    ].join('\n');

  const buildPayload = () => ({
    dataPlantao: form.dataPlantao,
    medico: form.medico,
    turno: form.turno,
    spa: form.spa,
    ute: form.ute,
    posto5: form.posto5,
    posto6: form.posto6,
    posto7: form.posto7,
    outros: form.outros,
    reavaliacoes: form.reavaliacoes,
    totalAdmissoes,
    admissoesTexto,
    pacientesEncaminhadosSala: form.pacientesEncaminhadosSala,
    pacientesNaSala: form.pacientesNaSala,
    pacientes12h: form.pacientes12h,
    permanenciaDetalhe: form.permanenciaDetalhe,
    encaminhadosUti: form.encaminhadosUti,
    retornoEnfermaria: form.retornoEnfermaria,
    transferenciasExternas: form.transferenciasExternas,
    obitosAssistencia: form.obitosAssistencia,
    pacienteEmEspera: form.pacienteEmEspera,
    localLeito: form.localLeito,
    destino: form.destino,
    comunicacoes: comunicacoesRealizadas.join(', '),
    pendenciaDestino: form.pendenciaDestino,
    pendenciaProximoPlantao: form.pendenciaProximoPlantao,
    pendenciaDescricao: form.pendenciaDescricao,
    situacaoCritica: SITUACAO_LABEL[form.situacaoCritica],
    situacaoCriticaDetalhe: form.situacaoCriticaDetalhe,
    horarioRegistro: form.horarioRegistro,
    salvoEm: new Date().toLocaleString('pt-BR'),
    admissoes: admissoesPreenchidas.map(({ postoLeito, detalhes }) => ({ postoLeito, detalhes })),
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
      comunicacoesRealizadas,
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
  });

  const handleSave = async () => {
    setIsSaving(true);
    const body = JSON.stringify(buildPayload());

    try {
      const response = await fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-store',
        redirect: 'follow',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const raw = await response.text();
      let result: { ok?: boolean; error?: string } = {};

      try {
        result = raw ? JSON.parse(raw) : { ok: response.ok };
      } catch {
        result = { ok: response.ok };
      }

      if (!response.ok || result.ok === false) {
        throw new Error(result.error || `Erro ao salvar na planilha (${response.status}).`);
      }

      alert('Passagem salva com sucesso na planilha!');
    } catch (error) {
      console.error(error);
      alert(
        'Não foi possível salvar na planilha. Verifique a URL do Apps Script e se o projeto está publicado com acesso "Qualquer pessoa" e retornando JSON.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(buildShareText())}`, '_blank', 'noopener');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSave();
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <span aria-hidden="true">←</span>
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
            <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">PASSAGEM DE PLANTÃO – TRR</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-50">
              Informar 0 quando não houver ocorrência. Marcar os turnos efetivamente trabalhados. Preencher
              apenas os campos aplicáveis e assinalar somente as comunicações realizadas.
            </p>
          </div>

          <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
            <Section number={1} title="Identificação">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Data do plantão">{textInput('dataPlantao', { placeholder: 'dd/mm/aa' })}</Field>
                <Field label="Médico">{textInput('medico', { placeholder: 'Nome do médico' })}</Field>
              </div>

              <OptionGroup legend="Plantão encerrado">
                {TURNOS.map((turno) => (
                  <OptionPill
                    key={turno}
                    type="radio"
                    name="turno"
                    label={turno}
                    checked={form.turno === turno}
                    onChange={() => updateField('turno', turno)}
                  />
                ))}
              </OptionGroup>
            </Section>

            <Section number={2} title="Atuação do TRR">
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-700">Acionamentos recebidos</p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  <Field label="SPA">{numberInput('spa')}</Field>
                  <Field label="UTE">{numberInput('ute')}</Field>
                  <Field label="Posto 5">{numberInput('posto5')}</Field>
                  <Field label="Posto 6">{numberInput('posto6')}</Field>
                  <Field label="Posto 7">{numberInput('posto7')}</Field>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Outros (informar local e número)">{textInput('outros')}</Field>
                <Field label="Reavaliações sem novo acionamento">{numberInput('reavaliacoes')}</Field>
              </div>
            </Section>

            <Section number={3} title="Admissões">
              <div className="flex flex-col gap-4">
                {admissoesList.map((item, index) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Posto - Leito">
                        <input
                          type="text"
                          value={item.postoLeito}
                          onChange={(e) => updateAdmission(item.id, 'postoLeito', e.target.value)}
                          className={inputClass}
                          placeholder="Ex: URR L. 436"
                        />
                      </Field>
                      <Field label="Detalhes">
                        <input
                          type="text"
                          value={item.detalhes}
                          onChange={(e) => updateAdmission(item.id, 'detalhes', e.target.value)}
                          className={inputClass}
                          placeholder="Ex: vigilância neurológica"
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={addAdmission}
                  className="inline-flex items-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  + Adicionar item
                </button>
                <p className="text-sm font-semibold text-slate-700">
                  Total final: <span className="text-sky-700">{totalAdmissoes}</span>
                </p>
              </div>
            </Section>

            <Section number={4} title="Sala do TRR">
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Encaminhados à sala durante o plantão">{numberInput('pacientesEncaminhadosSala')}</Field>
                <Field label="Pacientes na sala ao encerramento">{numberInput('pacientesNaSala')}</Field>
                <Field label="Pacientes com permanência ≥12 horas">{numberInput('pacientes12h')}</Field>
              </div>

              <Field label="Se ≥12h, informar leito, tempo e motivo">
                <textarea
                  value={form.permanenciaDetalhe}
                  onChange={(e) => updateField('permanenciaDetalhe', e.target.value)}
                  className={textareaClass}
                />
              </Field>
            </Section>

            <Section number={5} title="Destino dos pacientes">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Encaminhados à UTI">{numberInput('encaminhadosUti')}</Field>
                <Field label="Retorno/encaminhamento à enfermaria">{numberInput('retornoEnfermaria')}</Field>
                <Field label="Transferências externas/vaga zero">{numberInput('transferenciasExternas')}</Field>
                <Field label="Óbitos durante assistência do TRR">{numberInput('obitosAssistencia')}</Field>
              </div>
            </Section>

            <Section number={6} title="Pacientes aguardando destino">
              <OptionGroup legend="Há paciente nessa situação?">
                {(['Não', 'Sim'] as const).map((item) => (
                  <OptionPill
                    key={item}
                    type="radio"
                    name="pacienteEmEspera"
                    label={item}
                    checked={form.pacienteEmEspera === item}
                    onChange={() => updateField('pacienteEmEspera', item)}
                  />
                ))}
              </OptionGroup>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Local/leito">{textInput('localLeito')}</Field>
                <Field label="Destino">
                  <select
                    value={form.destino}
                    onChange={(e) => updateField('destino', e.target.value as Destino)}
                    className={inputClass}
                  >
                    <option value="">Selecione</option>
                    <option value="UTI">UTI</option>
                    <option value="Enfermaria">Enfermaria</option>
                    <option value="Transferência externa">Transferência externa</option>
                  </select>
                </Field>
              </div>

              <OptionGroup legend="Comunicações realizadas">
                {COMUNICACOES.map((item) => (
                  <OptionPill
                    key={item.key}
                    type="checkbox"
                    label={item.label}
                    checked={form.comunicacoes[item.key]}
                    onChange={() => toggleComunicacao(item.key)}
                  />
                ))}
              </OptionGroup>

              <Field label="Pendência (se houver)">{textInput('pendenciaDestino')}</Field>
            </Section>

            <Section number={7} title="Pendências para o próximo plantão">
              <OptionGroup legend="Há paciente ou situação que precisa de acompanhamento ou resolução?">
                {(['Não', 'Sim'] as const).map((item) => (
                  <OptionPill
                    key={item}
                    type="radio"
                    name="pendenciaProximoPlantao"
                    label={item}
                    checked={form.pendenciaProximoPlantao === item}
                    onChange={() => updateField('pendenciaProximoPlantao', item)}
                  />
                ))}
              </OptionGroup>

              <Field label="Se sim, informar local/leito e o que precisa ser feito">
                <textarea
                  value={form.pendenciaDescricao}
                  onChange={(e) => updateField('pendenciaDescricao', e.target.value)}
                  className={textareaClass}
                />
              </Field>
            </Section>

            <Section number={8} title="Segurança na passagem">
              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-slate-700">
                  Há situação crítica ou pendência que exige ação imediata?
                </legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {SITUACOES_CRITICAS.map((item) => (
                    <OptionPill
                      key={item.value}
                      type="radio"
                      name="situacaoCritica"
                      label={item.label}
                      checked={form.situacaoCritica === item.value}
                      onChange={() => updateField('situacaoCritica', item.value)}
                      className="h-full"
                    />
                  ))}
                </div>
              </fieldset>

              <Field label="Se sim, informar local/leito e situação">
                <textarea
                  value={form.situacaoCriticaDetalhe}
                  onChange={(e) => updateField('situacaoCriticaDetalhe', e.target.value)}
                  className={textareaClass}
                />
              </Field>
            </Section>

            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-3 text-sm text-slate-600">
                <span className="font-semibold">Horário do registro:</span>
                <input
                  type="text"
                  value={form.horarioRegistro}
                  onChange={(e) => updateField('horarioRegistro', e.target.value)}
                  className="w-28 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500"
                  placeholder="Ex: 20h"
                />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                  Compartilhar no WhatsApp
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(14,165,233,0.4)] transition hover:brightness-105 disabled:opacity-70"
                >
                  {isSaving ? 'Salvando...' : 'Salvar na planilha'}
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
