import { ApiResponse } from '@/types/api';

export const createResponse = <T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string,
): ApiResponse<T> => {
  const response: ApiResponse<T> = { success };

  if (data !== undefined) response.data = data;
  if (message !== undefined) response.message = message;
  if (error !== undefined) response.error = error;

  return response;
};

export const createSuccessResponse = <T>(
  data?: T,
  message?: string,
): ApiResponse<T> => {
  return createResponse(true, data, message);
};

export const createErrorResponse = (
  error: string,
  message?: string,
): ApiResponse => {
  return createResponse(false, undefined, message, error);
};
