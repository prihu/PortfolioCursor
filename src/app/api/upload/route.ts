import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';
import { runMiddleware } from '@/lib/runMiddleware'; // Assuming a helper exists

// Configure Cloudinary (Ensure these ENV variables are set in .env/.env.local)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Configure Multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadMiddleware = upload.single('file'); // Expects field named 'file'

// Disable Next.js body parsing for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

// POST handler for image uploads
export async function POST(request: Request) {
    // Note: Add Authentication/Authorization checks here if needed!
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'ADMIN') {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

  try {
    // @ts-ignore // runMiddleware might need type adjustments for NextRequest
    await runMiddleware(request, {}, uploadMiddleware);

    // @ts-ignore // req.file is added by multer
    const fileBuffer = request.file?.buffer;

    if (!fileBuffer) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Upload stream to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio_uploads', // Optional: specify a folder in Cloudinary
          // Add other upload options here (e.g., transformations)
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            return reject(new Error('Failed to upload image.'));
          }
          if (!result) {
            return reject(new Error('Cloudinary upload result is undefined.'));
          }
          resolve(result);
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });

    const uploadResult = await uploadPromise as { secure_url: string; [key: string]: any };

    // Return the secure URL of the uploaded image
    return NextResponse.json({ secure_url: uploadResult.secure_url }, { status: 200 });

  } catch (error: any) {
    console.error('--- Upload API Error ---', error);
    // Handle specific errors (e.g., Multer errors, Cloudinary errors)
    return NextResponse.json({ error: error.message || 'Image upload failed.' }, { status: 500 });
  }
} 