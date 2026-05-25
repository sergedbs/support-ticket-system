import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { rolePermissions } from '../utils/roles.js';

const router = Router();
const tokenRequestSchema = z.object({
  role: z.enum(['User', 'Agent', 'Admin']),
});

router.post('/', (request, response) => {
  const parsed = tokenRequestSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ error: 'Role must be User, Agent, or Admin' });
  }

  const { role } = parsed.data;
  const expiresIn = process.env.JWT_EXPIRES_IN || '60s';
  const token = jwt.sign(
    {
      role,
      permissions: rolePermissions[role],
    },
    process.env.JWT_SECRET || 'dev-demo-secret',
    { expiresIn },
  );

  return response.json({
    token,
    role,
    permissions: rolePermissions[role],
    expiresIn,
  });
});

export default router;
