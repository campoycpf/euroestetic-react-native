const CustomAdminLogin = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100px',
        marginBottom: '100px'
      }}
    >
      {/* Logo personalizado */}
      <img
        src="/logo.png"
        alt="Logo"
        style={{ maxWidth: '200px', marginBottom: '20px' }}
      />
      {/* Formulario de login de Payload */}
      <div
        id="payload-login-container"
        style={{ width: '100%', maxWidth: '400px', textAlign: 'center', marginBottom: '50px' }}
      >
        <h2>Euro Estetic - Inicio de sesión</h2>
        {/* Payload renderiza automáticamente el formulario aquí */}
      </div>
    </div>
  );
};

export default CustomAdminLogin;