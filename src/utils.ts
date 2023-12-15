import fetch, { Response } from 'node-fetch';

// Extending the built-in Error class to include a status property
export class HTTPError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message); // 'Error' breaks prototype chain here
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export async function fetchImage(imageUrl: string): Promise<Buffer> {
    try {
      const response: Response = await fetch(imageUrl);
  
      if (response.ok) {
        return await response.buffer();
      } else {
        // Use the actual status code from the response
        throw new HTTPError('Image not found or is not accessible', response.status);
      }
    } catch (error) {
      // Check if the error is an instance of HTTPError
      if (error instanceof HTTPError) {
        // Re-throw the same error
        throw error;
      } else if (error instanceof Error) {
        // For generic errors, throw a 500 internal server error
        throw new HTTPError('Internal Server Error', 500);
      } else {
        // Handle non-Error objects
        throw new HTTPError('An unknown error occurred', 500);
      }
    }
  }
  