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
    'mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100';

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
    <div className="mt-2 flex flex-wrap gap-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
      {options.map((option) => (
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

          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-bold text-slate-900">*1. IDENTIFICAÇÃO*</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <Field label="Data do plantão" value={dataPlantao} onChange={setDataPlantao} placeholder="dd/mm/aa" />
                <Field label="Médico" value={medico} onChange={setMedico} placeholder="Nome do médico" />
                <RadioGroup label="Plantão encerrado" options={['Manhã', 'Tarde', 'Noite']} value={plantaoEncerrado} onChange={setPlantaoEncerrado} />
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900">*2. ATUAÇÃO DO TRR*</h2>
              <div className="mt-4 space-y-5">
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
                    label="Reavaliações sem novo acionamento"
                    value={reavaliacoesSemNovoAcionamento}
                    onChange={setReavaliacoesSemNovoAcionamento}
                    type="number"
                    placeholder="Número de retornos realizados"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900">1. SALA DO TRR</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Pacientes encaminhados à sala durante o plantão" value={pacientesSala} onChange={setPacientesSala} type="number" />
                <Field label="Pacientes na sala ao encerramento" value={pacientesNaSalaEncerramento} onChange={setPacientesNaSalaEncerramento} type="number" />
                <Field label="Pacientes com permanência ≥12 horas" value={permanenciaDozeHoras} onChange={setPermanenciaDozeHoras} type="number" />
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
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900">1. DESTINO DOS PACIENTES</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Field label="Encaminhados à UTI" value={encaminhadosUti} onChange={setEncaminhadosUti} type="number" />
                <Field label="Retorno/encaminhamento à enfermaria" value={retornoEnfermaria} onChange={setRetornoEnfermaria} type="number" />
                <Field label="Transferências externas/vaga zero" value={transferenciasExternas} onChange={setTransferenciasExternas} placeholder="zero" />
                <Field label="Óbitos durante assistência do TRR" value={obitosAssistencia} onChange={setObitosAssistencia} placeholder="zero" />
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900">PACIENTES AGUARDANDO DESTINO</h2>
              <p className="mt-2 text-sm text-slate-500">Preencher apenas se houver paciente sob condução do TRR aguardando UTI, enfermaria ou transferência, inclusive na Sala Vermelha.</p>

              <div className="mt-4">
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="radio"
                      name="haPacienteDestino"
                      value="Não"
                      checked={haPacienteDestino === 'Não'}
                      onChange={(event) => setHaPacienteDestino(event.target.value)}
                    />
                    Não
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="radio"
                      name="haPacienteDestino"
                      value="Sim"
                      checked={haPacienteDestino === 'Sim'}
                      onChange={(event) => setHaPacienteDestino(event.target.value)}
                    />
                    Sim
                  </label>
                </div>
              </div>

              {haPacienteDestino === 'Sim' && (
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Local/leito" value={localLeito} onChange={setLocalLeito} placeholder="Local ou leito" />
                    <div>
                      <label className="block text-sm font-medium text-slate-700">
                        Destino
                        <select
                          value={destino}
                          onChange={(event) => setDestino(event.target.value)}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="UTI">UTI</option>
                          <option value="Enfermaria">Enfermaria</option>
                          <option value="Transferência externa">Transferência externa</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Comunicações realizadas
                      <select
                        value={comunicacoesRealizadas}
                        onChange={(event) => setComunicacoesRealizadas(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="Médico da UTI">Médico da UTI</option>
                        <option value="Equipe da enfermaria">Equipe da enfermaria</option>
                        <option value="NIR">NIR</option>
                        <option value="SAMU">SAMU</option>
                      </select>
                    </label>
                  </div>

                  <Field
                    label="Pendência (se houver)"
                    value={pendenciaDestino}
                    onChange={setPendenciaDestino}
                    multiline
                    placeholder="Descreva pendência ou encaminhamento"
                  />
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900">1. PENDÊNCIAS PARA O PRÓXIMO PLANTÃO</h2>

              <div className="mt-4">
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="radio"
                      name="haPendenciaProximoPlantao"
                      value="Não"
                      checked={haPendenciaProximoPlantao === 'Não'}
                      onChange={(event) => setHaPendenciaProximoPlantao(event.target.value)}
                    />
                    Não
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="radio"
                      name="haPendenciaProximoPlantao"
                      value="Sim"
                      checked={haPendenciaProximoPlantao === 'Sim'}
                      onChange={(event) => setHaPendenciaProximoPlantao(event.target.value)}
                    />
                    Sim
                  </label>
                </div>
              </div>

              {haPendenciaProximoPlantao === 'Sim' && (
                <div className="mt-4">
                  <Field
                    label="Se sim, informar local/leito e o que precisa ser feito"
                    value={pendenciaProximoPlantao}
                    onChange={setPendenciaProximoPlantao}
                    multiline
                    placeholder="Ex.: URR L. 436 - confirmar vaga na UTI e revisar exame..."
                  />
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900">1. SEGURANÇA NA PASSAGEM</h2>

              <div className="mt-4 space-y-4">
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="radio"
                      name="situacaoCritica"
                      value="Não"
                      checked={situacaoCritica === 'Não'}
                      onChange={(event) => setSituacaoCritica(event.target.value)}
                    />
                    Não
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="radio"
                      name="situacaoCritica"
                      value="Sim, comunicada diretamente ao próximo médico"
                      checked={situacaoCritica === 'Sim, comunicada diretamente ao próximo médico'}
                      onChange={(event) => setSituacaoCritica(event.target.value)}
                    />
                    Sim, comunicada diretamente ao próximo médico
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="radio"
                      name="situacaoCritica"
                      value="Sim, comunicação ainda pendente"
                      checked={situacaoCritica === 'Sim, comunicação ainda pendente'}
                      onChange={(event) => setSituacaoCritica(event.target.value)}
                    />
                    Sim, comunicação ainda pendente
                  </label>
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
            </section>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Horário do registro" value={horarioRegistro} onChange={setHorarioRegistro} placeholder="Ex.: 20h" />
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
