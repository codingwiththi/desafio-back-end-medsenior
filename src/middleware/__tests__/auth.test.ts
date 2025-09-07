import jwt from 'jsonwebtoken';
import { authenticateToken, requireAdmin } from '../auth';
import { createErrorResponse } from '../../utils/response';

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('middleware/auth', () => {
  const secret = process.env.JWT_SECRET || 'test-jwt-secret';

  it('authenticateToken should return 401 if no token', () => {
    const req: any = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      createErrorResponse('Access token required'),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('authenticateToken should return 403 if token invalid', () => {
    const req: any = { headers: { authorization: 'Bearer invalid' } };
    const res = mockRes();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      createErrorResponse('Invalid or expired token'),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('authenticateToken should set req.user and call next with valid token', () => {
    const payload = {
      userId: 'u1',
      email: 'e@e.com',
      role: 'USER',
      companyId: 'c1',
    };
    const token = (jwt as any).sign(payload, secret, { expiresIn: '10m' });

    const req: any = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(req.user).toMatchObject(payload);
    expect(next).toHaveBeenCalled();
  });

  it('authenticateToken returns 500 if JWT secret missing', () => {
    const prev = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    try {
      const req: any = { headers: { authorization: 'Bearer something' } };
      const res = mockRes();
      const next = jest.fn();

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        createErrorResponse('JWT configuration error'),
      );
      expect(next).not.toHaveBeenCalled();
    } finally {
      process.env.JWT_SECRET = prev;
    }
  });

  it('requireAdmin should block non-admin users', () => {
    const req: any = { user: { role: 'USER' } };
    const res = mockRes();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      createErrorResponse('Insufficient permissions'),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('requireAdmin should allow admin users', () => {
    const req: any = { user: { role: 'ADMIN' } };
    const res = mockRes();
    const next = jest.fn();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
