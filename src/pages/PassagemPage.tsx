const GOOGLE_SHEET_WEB_APP_URL = 'COLE_AQUI_A_URL_DO_WEB_APP';

const createEmptyAdmission = (): AdmissionItem => ({
  id: `${Date.now()}-${Math.random()}`,
  postoLeito: '',
  total: '',
  detalhes: '',
});

const [admissoesList, setAdmissoesList] = useState<AdmissionItem[]>([
  createEmptyAdmission(),
]);

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

const handleSave = async () => {
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
    admissoes: admissoesList,
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
