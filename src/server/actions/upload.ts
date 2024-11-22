"use server";
import "server-only";
import { minioClient } from "../s3/config";

export async function generatePresignedURL(fileName: string, bucket: string) {
  const bucketExists = await minioClient.bucketExists(bucket);
  if (!bucketExists) {
    await minioClient.makeBucket(bucket);
  }
  const destinationObject = `${bucket}-${fileName}`;

  const presignedUrl = await minioClient.presignedPutObject(
    bucket,
    destinationObject,
    60 * 5,
  );

  return {
    presignedUrl,
    imageUrl: `${bucket}/${destinationObject}`,
  };
}
