import { prisma } from 'wasp/server';
const startTime = Date.now();
export const healthCheck = async (_req, res, _context) => {
    let dbOk = false;
    let dbError = null;
    try {
        await prisma.$queryRaw `SELECT 1`;
        dbOk = true;
    }
    catch (err) {
        dbError = err instanceof Error ? err.message : 'Unknown database error';
    }
    const status = dbOk ? 'ok' : 'degraded';
    const httpStatus = dbOk ? 200 : 503;
    res.status(httpStatus).json({
        status,
        uptime: Math.floor((Date.now() - startTime) / 1000),
        timestamp: new Date().toISOString(),
        checks: {
            database: dbOk ? 'ok' : 'error',
            databaseError: dbError,
        },
    });
};
