// Función genérica para monitorist
const isMonitorist = ({ req: { user } }) => {
  return user?.role === 'monitorist'
}

// Permisos específicos para cada colección
const monitoristPermissions = {
  create: isMonitorist,
  read: isMonitorist,
  update: isMonitorist,
  delete: isMonitorist,
}
export default monitoristPermissions
