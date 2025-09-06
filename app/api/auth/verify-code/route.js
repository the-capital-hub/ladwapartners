import Verification from '@/model/Verification.js';
import { dbConnect } from '@/lib/dbConnect';

export async function POST(req) {
  await dbConnect();
  const { mobile, code } = await req.json();

  const record = await Verification.findOne({ mobile });

  if (!record || record.code !== code || record.expiresAt < Date.now()) {
    return Response.json({ message: 'Invalid or expired code' }, { status: 400 });
  }

  // Optionally: delete after verification
  // await Verification.deleteOne({ email });

  return Response.json({ message: 'Email verified successfully' });
}
