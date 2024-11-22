import { env } from "@/env";
import { auth } from "@/server/auth";
import { minioClient } from "@/server/s3/config";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest): Promise<{ url: string }> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const searchParams = req.nextUrl.searchParams;
  const bucket = searchParams.get("bucket") ?? null;

  if (!bucket) {
    return NextResponse.json(
      { message: "No bucket provided" },
      { status: 400 },
    );
  }

  const bucketExists = await minioClient.bucketExists(bucket);
  if (!bucketExists) {
    await minioClient.makeBucket(bucket);
  }
  const destinationObject = `${bucket}-${session.user.id}`;

  const presignedUrl = await minioClient.presignedPutObject(
    bucket,
    destinationObject,
    60 * 5,
  );
  return NextResponse.json({
    presignedUrl,
    imageUrl: `${env.NEXT_PUBLIC_S3_URL}/${bucket}/${destinationObject}`,
  });
}
