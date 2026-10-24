import React, { useState } from 'react';

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  type?: 'text' | 'number';
  className?: string;
}

const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  type = 'text',
  className = '',
}) => {
  const commonClassName =
    'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-slate-50 focus:ring-2 focus:ring-blue-100';

  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`${commonClassName} ${className} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${commonClassName} ${className}`}
        />
      )}
    </label>
  );
};

interface RadioGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, options, value, onChange }) => (
  <div className="block text-sm font-medium text-slate-700">
    <span>{label}</span>
    <div className="mt-2 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700">
          <input
            type="radio"
            name={label}
            value={option}
            checked={value === option}
            onChange={(event) => onChange(event.target.value)}
            className="h-4 w-4 border-slate-300 text-blue-700 focus:ring-blue-500"
          />
          {option}
        </label>
      ))}
    </div>
  </div>
);

const SectionCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {subtitle && <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{subtitle}</span>}
    </div>
    {children}
  </section>
);

const YesNoRow: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <p className="text-sm font-medium text-slate-700">{label}</p>
    <div className="flex flex-wrap gap-4">
      {['Não', 'Sim'].map((option) => (
        <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="radio"
            name={label}
            value={option}
            checked={value === option}
            onChange={(event) => onChange(event.target.value)}
            className="h-4 w-4 border-slate-300 text-blue-700 focus:ring-blue-500"
          />
          {option}
        </label>
      ))}
    </div>
  </div>
);

interface PassagemPageProps {
  onBack: () => void;
}

const formatShareValue = (value: string) => value.trim() || 'Não informado';
const escapeCsvValue = (value: string) => `"${String(value).replace(/"/g, '""')}"`;

const PassagemPage: React.FC<PassagemPageProps> = ({ onBack }) => {
  const [dataPlantao, setDataPlantao] = useState('02/10/26');
  const [medico, setMedico] = useState('Yasmim');
  const [plantaoEncerrado, setPlantaoEncerrado] = useState('Tarde');

  const [spa, setSpa] = useState('2');
  const [ute, setUte] = useState('0');
  const [posto5, setPosto5] = useState('0');
  const [posto6, setPosto6] = useState('0');
  const [posto7, setPosto7] = useState('2');
  const [outrosLocal, setOutrosLocal] = useState('');
  const [reavaliacoesSemNovoAcionamento, setReavaliacoesSemNovoAcionamento] = useState('1');

  const [pacientesSala, setPacientesSala] = useState('01');
  const [pacientesNaSalaEncerramento, setPacientesNaSalaEncerramento] = useState('0');
  const [permanenciaDozeHoras, setPermanenciaDozeHoras] = useState('1');
  const [detalhePermanencia, setDetalhePermanencia] = useState(
    'URR L. 436: Vigilância Neurológica, clinicamente estável, fora do perfil UTI no momento.'
  );

  const [encaminhadosUti, setEncaminhadosUti] = useState('00');
  const [retornoEnfermaria, setRetornoEnfermaria] = useState('01');
  const [transferenciasExternas, setTransferenciasExternas] = useState('zero');
  const [obitosAssistencia, setObitosAssistencia] = useState('zero');

  const [haPacienteDestino, setHaPacienteDestino] = useState('Não');
  const [localLeito, setLocalLeito] = useState('');
  const [destino, setDestino] = useState('UTI');
  const [comunicacoesRealizadas, setComunicacoesRealizadas] = useState('Médico da UTI');
  const [pendenciaDestino, setPendenciaDestino] = useState('');

  const [haPendenciaProximoPlantao, setHaPendenciaProximoPlantao] = useState('Não');
  const [pendenciaProximoPlantao, setPendenciaProximoPlantao] = useState('');

  const [situacaoCritica, setSituacaoCritica] = useState('Não');
  const [situacaoCriticaDetalhe, setSituacaoCriticaDetalhe] = useState('');
  const [horarioRegistro, setHorarioRegistro] = useState('20h');

  const buildShareText = () => {
    const lines = [
      'Passagem de plantão – TRR',
      '',
      `Data: ${formatShareValue(dataPlantao)}`,
      `Médico: ${formatShareValue(medico)}`,
      `Plantão encerrado: ${formatShareValue(plantaoEncerrado)}`,
      '',
      'Atuação do TRR',
      `SPA: ${formatShareValue(spa)} | UTE: ${formatShareValue(ute)} | Posto 5: ${formatShareValue(posto5)} | Posto 6: ${formatShareValue(posto6)} | Posto 7: ${formatShareValue(posto7)} | Outros: ${formatShareValue(outrosLocal)}`,
      `Reavaliações sem novo acionamento: ${formatShareValue(reavaliacoesSemNovoAcionamento)}`,
      '',
      'Sala do TRR',
      `Pacientes encaminhados: ${formatShareValue(pacientesSala)} | Na sala ao encerramento: ${formatShareValue(pacientesNaSalaEncerramento)} | Permanência ≥12h: ${formatShareValue(permanenciaDozeHoras)}`,
      `Detalhe permanência: ${formatShareValue(detalhePermanencia)}`,
      '',
      'Destino dos pacientes',
      `Encaminhados à UTI: ${formatShareValue(encaminhadosUti)} | Retorno à enfermaria: ${formatShareValue(retornoEnfermaria)} | Transferências externas: ${formatShareValue(transferenciasExternas)} | Óbitos: ${formatShareValue(obitosAssistencia)}`,
      `Há paciente aguardando destino: ${formatShareValue(haPacienteDestino)} | Local/leito: ${formatShareValue(localLeito)} | Destino: ${formatShareValue(destino)} | Comunicações realizadas: ${formatShareValue(comunicacoesRealizadas)}`,
      `Pendência: ${formatShareValue(pendenciaDestino)}`,
      '',
      'Pendências para o próximo plantão',
      `Há pendência: ${formatShareValue(haPendenciaProximoPlantao)} | Detalhe: ${formatShareValue(pendenciaProximoPlantao)}`,
      '',
      'Segurança na passagem',
      `Situação crítica: ${formatShareValue(situacaoCritica)} | Detalhe: ${formatShareValue(situacaoCriticaDetalhe)}`,
      `Horário do registro: ${formatShareValue(horarioRegistro)}`,
      '',
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    ];

    return lines.join('\n');
  };

  const buildCsvContent = () => {
    const rows = [
      [
        'Data',
        'Médico',
        'Plantão encerrado',
        'SPA',
        'UTE',
        'Posto 5',
        'Posto 6',
        'Posto 7',
        'Outros',
        'Reavaliações sem novo acionamento',
        'Pacientes encaminhados',
        'Pacientes na sala ao encerramento',
        'Permanência ≥12h',
        'Detalhe permanência',
        'Encaminhados à UTI',
        'Retorno à enfermaria',
        'Transferências externas',
        'Óbitos',
        'Há paciente aguardando destino',
        'Local/leito',
        'Destino',
        'Comunicações realizadas',
        'Pendência destino',
        'Há pendência para próximo plantão',
        'Detalhe pendência próxima',
        'Situação crítica',
        'Detalhe situação crítica',
        'Horário do registro',
      ],
      [
        dataPlantao,
        medico,
        plantaoEncerrado,
        spa,
        ute,
        posto5,
        posto6,
        posto7,
        outrosLocal,
        reavaliacoesSemNovoAcionamento,
        pacientesSala,
        pacientesNaSalaEncerramento,
        permanenciaDozeHoras,
        detalhePermanencia,
        encaminhadosUti,
        retornoEnfermaria,
        transferenciasExternas,
        obitosAssistencia,
        haPacienteDestino,
        localLeito,
        destino,
        comunicacoesRealizadas,
        pendenciaDestino,
        haPendenciaProximoPlantao,
        pendenciaProximoPlantao,
        situacaoCritica,
        situacaoCriticaDetalhe,
        horarioRegistro,
      ],
    ];

    return rows.map((row) => row.map((cell) => escapeCsvValue(String(cell))).join(',')).join('\n');
  };

  const triggerDownload = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShareWhatsApp = () => {
    const shareText = buildShareText();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = async () => {
    const shareText = buildShareText();

    try {
      await navigator.clipboard.writeText(shareText);
      alert('Texto da passagem copiado para a área de transferência.');
    } catch {
      alert('Não foi possível copiar automaticamente. Copie o texto manualmente.');
      window.prompt('Copie a passagem de plantão:', shareText);
    }
  };

  const handleGoogleDrive = () => {
    const csvContent = buildCsvContent();
    const filename = `passagem-plantao-${dataPlantao.replace(/\//g, '-')}.csv`;

    triggerDownload(filename, csvContent, 'text/csv;charset=utf-8;');
    window.open('https://drive.google.com/drive/u/0/my-drive', '_blank', 'noopener,noreferrer');
  };

  const handleSave = () => {
    const payload = {
      dataPlantao,
      medico,
      plantaoEncerrado,
      atuacaoTRR: {
        acionamentosRecebidos: {
          SPA: spa,
          UTE: ute,
          Posto5: posto5,
          Posto6: posto6,
          Posto7: posto7,
          Outros: outrosLocal,
        },
        reavaliacoesSemNovoAcionamento,
      },
      salaTRR: {
        pacientesEncaminhados: pacientesSala,
        pacientesNaSalaAoEncerramento: pacientesNaSalaEncerramento,
        pacientesPermanencia12h: permanenciaDozeHoras,
        detalhePermanencia,
      },
      destinoDosPacientes: {
        encaminhadosUti,
        retornoEnfermaria,
        transferenciasExternas,
        obitosDuranteAssistencia: obitosAssistencia,
      },
      pacientesAguardandoDestino: {
        haPaciente: haPacienteDestino,
        localLeito,
        destino,
        comunicacoesRealizadas,
        pendencia: pendenciaDestino,
      },
      pendenciasProximoPlantao: {
        haPendencia: haPendenciaProximoPlantao,
        descricao: pendenciaProximoPlantao,
      },
      segurancaNaPassagem: {
        situacaoCritica,
        detalhe: situacaoCriticaDetalhe,
      },
      horarioRegistro,
      salvoEm: new Date().toLocaleString('pt-BR'),
    };

    console.log('Passagem salva:', payload);
    alert('Passagem salva com sucesso!');
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-2xl bg-gradient-to-r from-cyan-700 to-blue-700 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">TRR na Escuta</p>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">PASSAGEM DE PLANTÃO – TRR</h1>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center rounded-lg border border-white/60 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Voltar para home
            </button>
          </div>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Orientações de preenchimento</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Informar 0 quando não houver ocorrência.</li>
              <li>Marcar os turnos efetivamente trabalhados.</li>
              <li>Preencher apenas os campos aplicáveis e assinalar somente as comunicações realizadas.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <SectionCard title="*1. IDENTIFICAÇÃO*">
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Data do plantão" value={dataPlantao} onChange={setDataPlantao} placeholder="dd/mm/aa" />
                <Field label="Médico" value={medico} onChange={setMedico} placeholder="Nome do médico" />
                <RadioGroup
                  label="Plantão encerrado"
                  options={['Manhã', 'Tarde', 'Noite']}
                  value={plantaoEncerrado}
                  onChange={setPlantaoEncerrado}
                />
              </div>
            </SectionCard>

            <SectionCard title="*2. ATUAÇÃO DO TRR*">
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-slate-700">_ACIONAMENTOS RECEBIDOS_</p>
                  <p className="mt-1 text-xs text-slate-500">(Informar o número de chamados por local, inclusive para pacientes já atendidos.)</p>
                </div>

                <div className="grid gap-4 md:grid-cols-6">
                  <Field label="SPA" value={spa} onChange={setSpa} type="number" />
                  <Field label="UTE" value={ute} onChange={setUte} type="number" />
                  <Field label="Posto 5" value={posto5} onChange={setPosto5} type="number" />
                  <Field label="Posto 6" value={posto6} onChange={setPosto6} type="number" />
                  <Field label="Posto 7" value={posto7} onChange={setPosto7} type="number" />
                  <Field label="Outros" value={outrosLocal} onChange={setOutrosLocal} placeholder="Local e número" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="REAVALIAÇÕES SEM NOVO ACIONAMENTO"
                    value={reavaliacoesSemNovoAcionamento}
                    onChange={setReavaliacoesSemNovoAcionamento}
                    type="number"
                    placeholder="Número de retornos"
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="1. SALA DO TRR">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field
                  label="Pacientes encaminhados à sala durante o plantão"
                  value={pacientesSala}
                  onChange={setPacientesSala}
                  type="number"
                />
                <Field
                  label="Pacientes na sala ao encerramento"
                  value={pacientesNaSalaEncerramento}
                  onChange={setPacientesNaSalaEncerramento}
                  type="number"
                />
                <Field
                  label="Pacientes com permanência ≥12 horas"
                  value={permanenciaDozeHoras}
                  onChange={setPermanenciaDozeHoras}
                  type="number"
                />
              </div>

              <div className="mt-4">
                <Field
                  label="Se ≥12h, informar leito, tempo e motivo"
                  value={detalhePermanencia}
                  onChange={setDetalhePermanencia}
                  multiline
                  placeholder="Ex.: URR L. 436: Vigilância Neurológica, clinicamente estável, fora do perfil UTI no momento."
                />
              </div>
            </SectionCard>

            <SectionCard title="1. DESTINO DOS PACIENTES">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Encaminhados à UTI" value={encaminhadosUti} onChange={setEncaminhadosUti} type="number" />
                <Field label="Retorno/encaminhamento à enfermaria" value={retornoEnfermaria} onChange={setRetornoEnfermaria} type="number" />
                <Field label="Transferências externas/vaga zero" value={transferenciasExternas} onChange={setTransferenciasExternas} placeholder="zero" />
                <Field label="Óbitos durante assistência do TRR" value={obitosAssistencia} onChange={setObitosAssistencia} placeholder="zero" />
              </div>
            </SectionCard>

            <SectionCard title="PACIENTES AGUARDANDO DESTINO" subtitle="somente se houver">
              <div className="space-y-4">
                <YesNoRow label="Há paciente nessa situação?" value={haPacienteDestino} onChange={setHaPacienteDestino} />

                {haPacienteDestino === 'Sim' && (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Local/leito" value={localLeito} onChange={setLocalLeito} placeholder="Local ou leito" />
                      <label className="block text-sm font-medium text-slate-700">
                        Destino
                        <select
                          value={destino}
                          onChange={(event) => setDestino(event.target.value)}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-slate-50 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="UTI">UTI</option>
                          <option value="Enfermaria">Enfermaria</option>
                          <option value="Transferência externa">Transferência externa</option>
                        </select>
                      </label>
                    </div>

                    <label className="block text-sm font-medium text-slate-700">
                      Comunicações realizadas
                      <select
                        value={comunicacoesRealizadas}
                        onChange={(event) => setComunicacoesRealizadas(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-slate-50 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="Médico da UTI">Médico da UTI</option>
                        <option value="Equipe da enfermaria">Equipe da enfermaria</option>
                        <option value="NIR">NIR</option>
                        <option value="SAMU">SAMU</option>
                      </select>
                    </label>

                    <Field
                      label="Pendência (se houver)"
                      value={pendenciaDestino}
                      onChange={setPendenciaDestino}
                      multiline
                      placeholder="Descreva pendência ou encaminhamento"
                    />
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard title="1. PENDÊNCIAS PARA O PRÓXIMO PLANTÃO">
              <div className="space-y-4">
                <YesNoRow label="Há paciente ou situação que precisa de acompanhamento ou resolução?" value={haPendenciaProximoPlantao} onChange={setHaPendenciaProximoPlantao} />

                {haPendenciaProximoPlantao === 'Sim' && (
                  <Field
                    label="Se sim, informar local/leito e o que precisa ser feito"
                    value={pendenciaProximoPlantao}
                    onChange={setPendenciaProximoPlantao}
                    multiline
                    placeholder="Ex.: URR L. 436 - confirmar vaga na UTI e revisar exame..."
                  />
                )}
              </div>
            </SectionCard>

            <SectionCard title="1. SEGURANÇA NA PASSAGEM">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Há situação crítica ou pendência que exige ação imediata?</p>
                  <div className="flex flex-wrap gap-4">
                    {[
                      'Não',
                      'Sim, comunicada diretamente ao próximo médico',
                      'Sim, comunicação ainda pendente',
                    ].map((option) => (
                      <label key={option} className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm text-slate-700">
                        <input
                          type="radio"
                          name="situacaoCritica"
                          value={option}
                          checked={situacaoCritica === option}
                          onChange={(event) => setSituacaoCritica(event.target.value)}
                          className="h-4 w-4 border-slate-300 text-blue-700 focus:ring-blue-500"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                {situacaoCritica !== 'Não' && (
                  <Field
                    label="Se sim, informar local/leito e situação"
                    value={situacaoCriticaDetalhe}
                    onChange={setSituacaoCriticaDetalhe}
                    multiline
                    placeholder="Descreva a situação crítica e o local/leito"
                  />
                )}
              </div>
            </SectionCard>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Horário do registro" value={horarioRegistro} onChange={setHorarioRegistro} placeholder="Ex.: 20h" />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">Compartilhamento</p>
                <p className="text-xs text-slate-500">Texto pronto para WhatsApp e planilha para Google Drive.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  WhatsApp
                </button>

                <button
                  type="button"
                  onClick={handleCopyText}
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Copiar texto
                </button>

                <button
                  type="button"
                  onClick={handleGoogleDrive}
                  className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  Google Drive
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Salvar passagem
            </button>

            <button
              type="button"
              onClick={() => {
                setDataPlantao('02/10/26');
                setMedico('');
                setPlantaoEncerrado('Tarde');
                setSpa('0');
                setUte('0');
                setPosto5('0');
                setPosto6('0');
                setPosto7('0');
                setOutrosLocal('');
                setReavaliacoesSemNovoAcionamento('0');
                setPacientesSala('0');
                setPacientesNaSalaEncerramento('0');
                setPermanenciaDozeHoras('0');
                setDetalhePermanencia('');
                setEncaminhadosUti('0');
                setRetornoEnfermaria('0');
                setTransferenciasExternas('zero');
                setObitosAssistencia('zero');
                setHaPacienteDestino('Não');
                setLocalLeito('');
                setDestino('UTI');
                setComunicacoesRealizadas('Médico da UTI');
                setPendenciaDestino('');
                setHaPendenciaProximoPlantao('Não');
                setPendenciaProximoPlantao('');
                setSituacaoCritica('Não');
                setSituacaoCriticaDetalhe('');
                setHorarioRegistro('');
              }}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Limpar formulário
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PassagemPage;
