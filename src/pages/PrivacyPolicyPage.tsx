import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                TRR na Escuta
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Política de Privacidade</h1>
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
              Última atualização: 23/10/2026
            </span>
          </div>

          <div className="space-y-7 text-sm leading-7 text-slate-700">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">1. Introdução</h2>
              <p>
                Esta Política de Privacidade descreve como o aplicativo <strong>TRR na Escuta</strong>{' '}
                coleta, utiliza, armazena e compartilha informações pessoais e dados médicos de uso interno
                relacionado à passagem de plantão e à comunicação entre a equipe assistencial.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">2. Informações coletadas</h2>
              <p>Podemos coletar dados como:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Nome do profissional responsável pelo registro;</li>
                <li>E-mail institucional ou pessoal para autenticação e comunicação;</li>
                <li>Dados de plantão, como turno, unidade, sala, pacientes e informações de encaminhamento;</li>
                <li>Dados de saúde e assistência necessários ao registro da passagem de plantão;</li>
                <li>Dados de acesso do Google Drive/Google Sheets quando houver integração para sincronização.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">3. Finalidade do tratamento</h2>
              <p>As informações são utilizadas para:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Registrar a passagem de plantão de forma organizada e segura;</li>
                <li>Facilitar comunicação entre profissionais e equipes de saúde;</li>
                <li>Sincronizar e compartilhar planilhas com a equipe por meio do Google Drive;</li>
                <li>Garantir continuidade assistencial e a segurança do paciente;</li>
                <li>Manter histórico e organização da documentação clínica relacionada ao plantão.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">4. Compartilhamento de dados</h2>
              <p>
                Os dados podem ser compartilhados apenas com pessoas autorizadas, como membros da equipe
                médica e de enfermagem, quando necessário para a continuidade do atendimento. Também pode
                haver compartilhamento com serviços do Google (Google Drive/Google Sheets) para gerar e
                sincronizar planilhas de registro, conforme o uso do aplicativo.
              </p>
              <p className="mt-3">
                O aplicativo não deve ser usado para divulgação pública ou compartilhamento indiscriminado de
                informações sensíveis, e a equipe responsável deve respeitar as normas internas de proteção
                de dados e privacidade da instituição.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">5. Armazenamento e segurança</h2>
              <p>
                Os dados são armazenados em ambiente controlado e com medidas técnicas e administrativas
                adequadas para reduzir riscos de acesso não autorizado, perda, uso indevido ou divulgação
                inadequada. A integridade e a confidencialidade das informações são prioridades da aplicação.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">6. Direitos do titular</h2>
              <p>O titular dos dados pode, conforme a legislação aplicável, solicitar:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Confirmação da existência de tratamento dos seus dados;</li>
                <li>Acesso às informações tratadas;</li>
                <li>Correção de dados incorretos ou incompletos;</li>
                <li>Exclusão, quando houver base legal e possibilidade de atendimento;</li>
                <li>Informações sobre o uso e compartilhamento de seus dados.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">7. Dados de pacientes</h2>
              <p>
                Quando informações sobre pacientes forem registradas, o uso deve seguir rigorosamente os
                protocolos e normas da instituição, bem como as leis aplicáveis de proteção de dados e
                confidencialidade do atendimento. O aplicativo não substitui as políticas internas de segurança
                da organização.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">8. Alterações nesta política</h2>
              <p>
                Esta política pode ser atualizada periodicamente para refletir melhorias no sistema, exigências
                legais ou ajustes operacionais. A data da última atualização será mantida no topo desta página.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-slate-900">9. Contato</h2>
              <p>
                Para dúvidas, solicitações ou esclarecimentos sobre esta Política de Privacidade, entre em
                contato com o responsável pelo projeto ou pela instituição que operacionaliza o sistema.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
