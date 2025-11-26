// Mock for TimeUtils
export const getExpireDate = jest.fn(() => '2025-12-31T23:59:59.999Z');

export const formatDate = jest.fn(date => '2025-11-25');

export const getTimeDifference = jest.fn(() => 3600000); // 1 hour in ms

export const getCurrentTimestamp = jest.fn(() => Date.now());
