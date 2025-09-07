import {
  validateSchema,
  registerSchema,
  loginSchema,
  questionSchema,
  validateQuery,
  paginationSchema,
} from '../validation';
import { createErrorResponse } from '../../utils/response';

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('middleware/validation', () => {
  it('validateSchema should pass with valid register body', () => {
    const req: any = {
      body: {
        email: 'e@e.com',
        password: '123456',
        name: 'Name',
        companyName: 'Co',
      },
    };
    const res = mockRes();
    const next = jest.fn();

    validateSchema(registerSchema)(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('validateSchema should reject invalid login body', () => {
    const req: any = { body: { email: 'bad-email', password: '' } };
    const res = mockRes();
    const next = jest.fn();

    validateSchema(loginSchema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(payload).toEqual(
      expect.objectContaining(createErrorResponse(expect.any(String))),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('validateSchema should reject too-short question', () => {
    const req: any = { body: { question: 'hey' } };
    const res = mockRes();
    const next = jest.fn();

    validateSchema(questionSchema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('validateQuery should default pagination and pass', () => {
    const req: any = { query: {} };
    const res = mockRes();
    const next = jest.fn();

    validateQuery(paginationSchema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.query.page).toBe(1);
    expect(req.query.limit).toBe(10);
  });

  it('validateQuery should reject invalid pagination', () => {
    const req: any = { query: { page: '0', limit: '1000' } };
    const res = mockRes();
    const next = jest.fn();

    validateQuery(paginationSchema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});
