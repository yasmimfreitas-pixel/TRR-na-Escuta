    const handleSave = async () => {
    setIsSaving(true);
    const body = JSON.stringify(buildPayload());

    try {
      // Apps Script does not answer CORS preflight requests, so the browser blocks the request
      // unless it is made as a simple no-cors POST. In this mode the server still receives the
      // payload, but the response is opaque and cannot be read by the frontend.
      const response = await fetch(GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxWu2kC1Xh4ESaLDgVe1zQsel5ju8-uImCDk8Zu8VT_FZ4-Ps34kS6pKSo3JiByPXCH/exec', {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-store',
        redirect: 'follow',
        credentials: 'omit',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body,
      });

      // no-cors responses are opaque (status 0), so there is no readable server payload.
      if (response.type === 'opaque') {
        alert('Passagem salva com sucesso na planilha!');
        return;
      }

      const raw = await response.text();
      let result: { ok?: boolean; error?: string } = {};
      try {
        result = JSON.parse(raw);
      } catch {
        result = { ok: response.ok };
      }

      if (!response.ok || result.ok === false) {
        throw new Error(result.error || 'Erro ao salvar na planilha.');
      }

      alert('Passagem salva com sucesso na planilha!');
    } catch (error) {
      console.error(error);
      alert(
        'Não foi possível salvar na planilha. Verifique a conexão e se o Apps Script está implantado como app da Web com acesso "Qualquer pessoa".'
      );
    } finally {
      setIsSaving(false);
    }
  };
