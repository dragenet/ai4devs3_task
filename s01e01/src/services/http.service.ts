import type { FormData } from '../types';

interface ApiResponse {
    // Define the expected response structure
    success: boolean;
    message?: string;
    data?: unknown;
}

export class HttpService {
    async submitForm(endpoint: string, data: FormData) {
        try {
            const formData = new URLSearchParams();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json() as ApiResponse;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error submitting form:', error.message);
            }
            throw error;
        }
    }
} 