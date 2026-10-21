  const handleLoginGoogle = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        setCachedAccessToken(result.accessToken);
        setIsDriveModalOpen(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível conectar ao Google Drive.';
      console.error('Falha no login Google:', err);
      alert(
        `${message}\n\nVerifique se:\n- o domínio do site está autorizado no Firebase;\n- o Google Sign-In está habilitado no projeto;\n- o firebase-applet-config.json corresponde ao projeto correto.`
      );
    } finally {
      setIsLoggingIn(false);
    }
  };
