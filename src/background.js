// Lógica para manejar OAuth con Google y Microsoft
chrome.identity.getAuthToken({ interactive: true }, function(token) {
    if (chrome.runtime.lastError || !token) {
      console.error(chrome.runtime.lastError);
      return;
    }
  
    // Usa el token para autenticar al usuario
    console.log('Token:', token);
  });
  