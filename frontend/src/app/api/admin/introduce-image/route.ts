import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const oldUrl = formData.get('oldUrl') as string;
        
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure directory exists
        const publicDir = path.join(process.cwd(), 'public');
        const uploadDir = path.join(publicDir, 'images', 'about');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Delete old file if provided and exists inside public/images/about
        if (oldUrl && oldUrl.startsWith('/images/about/')) {
            const oldFilePath = path.join(publicDir, oldUrl);
            if (fs.existsSync(oldFilePath)) {
                try {
                    await unlink(oldFilePath);
                } catch (err) {
                    console.error('Failed to delete old image:', err);
                }
            }
        }

        // Save new file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `${uniqueSuffix}.${ext}`;
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);
        
        const fileUrl = `/images/about/${filename}`;
        return NextResponse.json({ url: fileUrl });
    } catch (e) {
        console.error('Upload error:', e);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
