import { logger } from './logger';
import { LOG_CATEGORIES } from './constants';

export function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  
  return fn().finally(() => {
    const duration = performance.now() - start;
    logger.info(LOG_CATEGORIES.PERFORMANCE, `Operation "${operation}" took ${duration.toFixed(2)}ms`);
  });
}

export function createPerformanceMarker(name: string): () => void {
  const start = performance.now();
  
  return () => {
    const duration = performance.now() - start;
    logger.info(LOG_CATEGORIES.PERFORMANCE, `Marker "${name}" duration: ${duration.toFixed(2)}ms`);
  };
}