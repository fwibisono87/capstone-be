// src/types.d.ts
import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;  // Adjust the type as needed
  }
}
