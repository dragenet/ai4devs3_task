import fs from 'fs';
import path from 'path';

export const saveResponseToFile = async (content: string): Promise<void> => {
    const resultDir = path.join(process.cwd(), 'result');
    const filePath = path.join(resultDir, 'index.html');

    // Create result directory if it doesn't exist
    if (!fs.existsSync(resultDir)) {
        fs.mkdirSync(resultDir, { recursive: true });
    }

    await fs.promises.writeFile(filePath, content, 'utf-8');
    console.log('Response saved successfully to result/index.html');
}; 