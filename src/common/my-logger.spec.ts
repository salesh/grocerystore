import { MyLogger } from './my-logger';

// Mock the Logger class methods
const mockLogger: any = {
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
};

describe('MyLogger', () => {
    let myLogger: MyLogger;

    beforeEach(() => {
        myLogger = new MyLogger(mockLogger);
    });

    it('should log a message', () => {
        myLogger.log('Test log message');
        expect(mockLogger.info).toHaveBeenCalledWith('Test log message', undefined);
    });

    it('should log an info message', () => {
        myLogger.info('Test info message', { context: 'TestContext' });
        expect(mockLogger.info).toHaveBeenCalledWith('Test info message', { context: 'TestContext' });
    });

    it('should log an error message', () => {
        myLogger.error('Test error message', 'Test trace', { context: 'TestContext' });
        expect(mockLogger.error).toHaveBeenCalledWith('Test error message', {
            context: 'TestContext',
            stack: ['Test trace'],
        });
    });

    it('should log a warning message', () => {
        myLogger.warn('Test warn message', { context: 'TestContext' });
        expect(mockLogger.warn).toHaveBeenCalledWith('Test warn message', { context: 'TestContext' });
    });

    it('should log a debug message', () => {
        myLogger.debug('Test debug message', { context: 'TestContext' });
        expect(mockLogger.debug).toHaveBeenCalledWith('Test debug message', { context: 'TestContext' });
    });

    it('should log a verbose message', () => {
        myLogger.verbose('Test verbose message', { context: 'TestContext' });
        expect(mockLogger.verbose).toHaveBeenCalledWith('Test verbose message', { context: 'TestContext' });
    });
});
