"use server";

import { prisma } from "@/lib/prisma";
import cloudinary from "./cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function uploadProfileImage(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const file = formData.get("image") as File;
  if (!file) throw new Error("No file provided");

  // Validate file type
  if (!file.type.startsWith("image/")) throw new Error("File must be an image");

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "smartseason_profiles",
        public_id: `user_${(session.user as any).id}`,
        overwrite: true,
        transformation: [{ width: 400, height: 400, crop: "fill" }]
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(new Error("Upload failed to store image"));
        }
        if (!result) return reject(new Error("Upload failed (no result)"));

        await prisma.user.update({
          where: { id: (session.user as any).id },
          data: { image: result.secure_url },
        });

        revalidatePath("/profile");
        revalidatePath("/dashboard");
        revalidatePath("/"); // For landing page header if logged in
        resolve({ url: result.secure_url });
      }
    );
    
    upload.end(buffer);
  });
}

export async function updateProfileDetails(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const idNumber = formData.get("idNumber") as string;

  await prisma.user.update({
    where: { id: (session.user as any).id },
    data: { name, idNumber },
  });

  revalidatePath("/profile");
}
