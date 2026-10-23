import React, { useState } from 'react';

interface PassagemFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

const PassagemField: React.FC<PassagemFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
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
          rows={5}
          className={`${commonClassName} resize-none`}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={commonClassName}
        />
      )}
    </label>
  );
};

interface PassagemPageProps {
  onBack: () => void;
}

const PassagemPage: React.FC<PassagemPageProps> = ({ onBack }) => {
  const [turno, setTurno] = useState('Manhã');
  const [profissional, setProfissional] = useState('Dr. João Silva');
  const [unidade, setUnidade] = useState('UTI Adulto');
  const [paciente, setPaciente] = useState('Maria Ferreira');
  const [leito, setLeito] = useState('12');
  const [condicao, setCondicao] = useState('Estável, com melhora hemodinâmica');
  const [procedimentos, setProcedimentos] = useState('Troca de sonda vesical, revisão de exames e ajuste de medicação.');
  const [pendencias, setPendencias] = useState('Reavaliar dor abdominal ao fim da manhã e confirmar laudo de imagem.');
  const [observacoes, setObservacoes] = useState('Paciente orientado sobre sinais de alerta e acompanhamento da equipe de enfermagem.');

  const handleSave = () => {
    const payload = {
      turno,
      profissional,
      unidade,
      paciente,
      leito,
      condicao,
      procedimentos,
      pendencias,
      observacoes,
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
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Passagem de plantão</h1>
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
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <label className="block text-sm font-medium text-slate-700">
              Turno
              <select
                value={turno}
                onChange={(event) => setTurno(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </select>
            </label>

            <PassagemField
              label="Profissional"
              value={profissional}
              onChange={setProfissional}
              placeholder="Nome do profissional"
            />

            <PassagemField
              label="Unidade"
              value={unidade}
              onChange={setUnidade}
              placeholder="Ex.: UTI, enfermaria, emergência"
            />

            <PassagemField
              label="Leito"
              value={leito}
              onChange={setLeito}
              placeholder="Ex.: 12"
            />
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <PassagemField
              label="Paciente"
              value={paciente}
              onChange={setPaciente}
              placeholder="Nome do paciente"
            />

            <PassagemField
              label="Condição atual"
              value={condicao}
              onChange={setCondicao}
              placeholder="Descreva a condição clínica atual"
            />
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <PassagemField
              label="Procedimentos realizados"
              value={procedimentos}
              onChange={setProcedimentos}
              placeholder="Descreva os procedimentos e intervenções realizadas"
              multiline
            />

            <PassagemField
              label="Pendências/encaminhamentos"
              value={pendencias}
              onChange={setPendencias}
              placeholder="Descreva o que precisa ser acompanhado"
              multiline
            />
          </div>

          <div className="mt-6">
            <PassagemField
              label="Observações gerais"
              value={observacoes}
              onChange={setObservacoes}
              placeholder="Informe observações relevantes"
              multiline
            />
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
                setTurno('Manhã');
                setProfissional('');
                setUnidade('');
                setPaciente('');
                setLeito('');
                setCondicao('');
                setProcedimentos('');
                setPendencias('');
                setObservacoes('');
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
