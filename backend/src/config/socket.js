const defaultOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:5175',
  'http://192.168.15.10:5173',
  'http://192.168.15.10:5174',
  'http://192.168.15.10:5175'
];

// DEBUG helper: if DEBUG_SOCKET_CORS=true, allow all origins (useful to quickly
// determine if XHR/polling errors are caused by CORS during local development).
const corsOrigin = process.env.DEBUG_SOCKET_CORS === 'true'
  ? true // allow all origins
  : (process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : defaultOrigins);

module.exports = {
  cors: {
    // origin: true will reflect the request origin (allow all) when DEBUG_SOCKET_CORS=true
    origin: corsOrigin,
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
};
