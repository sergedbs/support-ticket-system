import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';
import { canDeleteTicket, canReadTicket, canUpdateTicket } from '../utils/roles.js';
import { handleValidation, parseId, ticketSchema, ticketUpdateSchema } from '../utils/validation.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (request, response, next) => {
  try {
    const limit = Math.min(Math.max(Number(request.query.limit) || 10, 1), 50);
    const offset = Math.max(Number(request.query.offset) || 0, 0);
    const { search, status, priority, category } = request.query;
    const allowedSorts = ['updatedAt', 'createdAt', 'priority', 'status', 'votes'];
    const sort = allowedSorts.includes(request.query.sort) ? request.query.sort : 'updatedAt';
    const direction = request.query.direction === 'asc' ? 'asc' : 'desc';

    const filters = {
      ...(request.user.role === 'User' ? { ownerRole: 'User' } : {}),
      ...(status ? { status: String(status) } : {}),
      ...(priority ? { priority: String(priority) } : {}),
      ...(category ? { category: String(category) } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: String(search) } },
              { description: { contains: String(search) } },
              { category: { contains: String(search) } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.ticket.findMany({
        where: filters,
        orderBy: { [sort]: direction },
        take: limit,
        skip: offset,
      }),
      prisma.ticket.count({ where: filters }),
    ]);

    return response.json({ items, total, limit, offset, sort, direction });
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (request, response, next) => {
  try {
    if (!['User', 'Admin'].includes(request.user.role)) {
      return response.status(403).json({ error: 'Only users and admins can create tickets' });
    }

    const parsed = ticketSchema.safeParse(request.body);
    if (!parsed.success) return handleValidation(parsed.error, response);

    const ticket = await prisma.ticket.create({
      data: {
        ...parsed.data,
        status: parsed.data.status || 'Open',
        ownerRole: request.user.role,
        ownerName: request.user.role === 'Admin' ? 'Admin' : 'Demo User',
      },
    });

    return response.status(201).json(ticket);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (request, response, next) => {
  try {
    const id = parseId(request.params.id);
    if (!id) return response.status(400).json({ error: 'Invalid ticket id' });

    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) return response.status(404).json({ error: 'Ticket not found' });
    if (!canReadTicket(request.user, ticket)) return response.status(403).json({ error: 'Forbidden' });

    return response.json(ticket);
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id', async (request, response, next) => {
  try {
    const id = parseId(request.params.id);
    if (!id) return response.status(400).json({ error: 'Invalid ticket id' });

    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) return response.status(404).json({ error: 'Ticket not found' });
    if (!canUpdateTicket(request.user, ticket)) return response.status(403).json({ error: 'Forbidden' });

    const parsed = ticketUpdateSchema.safeParse(request.body);
    if (!parsed.success) return handleValidation(parsed.error, response);

    if (request.user.role === 'User' && parsed.data.status && parsed.data.status !== ticket.status) {
      return response.status(403).json({ error: 'Users cannot change ticket status' });
    }

    const updated = await prisma.ticket.update({
      where: { id },
      data: parsed.data,
    });

    return response.json(updated);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', async (request, response, next) => {
  try {
    const id = parseId(request.params.id);
    if (!id) return response.status(400).json({ error: 'Invalid ticket id' });

    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) return response.status(404).json({ error: 'Ticket not found' });
    if (!canDeleteTicket(request.user, ticket)) return response.status(403).json({ error: 'Forbidden' });

    await prisma.ticket.delete({ where: { id } });
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
});

router.post('/:id/vote', async (request, response, next) => {
  try {
    const id = parseId(request.params.id);
    if (!id) return response.status(400).json({ error: 'Invalid ticket id' });

    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) return response.status(404).json({ error: 'Ticket not found' });
    if (!canReadTicket(request.user, ticket)) return response.status(403).json({ error: 'Forbidden' });

    const updated = await prisma.ticket.update({
      where: { id },
      data: { votes: { increment: 1 } },
    });

    return response.json(updated);
  } catch (error) {
    return next(error);
  }
});

export default router;
