import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'dev-demo-secret';

export function requireAuth(request, response, next) {
  const header = request.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return response.status(401).json({ error: 'Missing bearer token' });
  }

  try {
    request.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return response.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function allowRoles(...allowedRoles) {
  return (request, response, next) => {
    if (!request.user || !allowedRoles.includes(request.user.role)) {
      return response.status(403).json({ error: 'Insufficient role permissions' });
    }
    return next();
  };
}
