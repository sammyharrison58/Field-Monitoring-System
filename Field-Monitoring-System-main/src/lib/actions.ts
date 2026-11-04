"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendActivationEmail, sendFieldAssignmentEmail } from "./mail";

// existing submitFieldUpdate ...
export async function submitFieldUpdate(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const fieldId = formData.get("fieldId") as string;
  const stage = formData.get("stage") as string;
  const note = formData.get("note") as string;

  await prisma.fieldUpdate.create({
    data: {
      fieldId,
      authorId: (session.user as any).id,
      stageAtUpdate: stage,
      note,
    },
  });

  await prisma.field.update({
    where: { id: fieldId },
    data: { stage },
  });

  revalidatePath(`/fields/${fieldId}`);
  revalidatePath("/dashboard");
}

/* --- Admin Actions --- */

export async function registerAgent(formData: FormData) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const idNumber = formData.get("idNumber") as string;
  const designation = formData.get("designation") as string;

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  const tempPassword = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      idNumber,
      designation,
      password: tempPassword,
      role: "AGENT",
      status: "PENDING",
      activateToken: token,
      activateTokenExpires: expires,
    },
  });

  await sendActivationEmail(email, token, name);
  revalidatePath("/admin/agents");
  return { success: true };
}

export async function activateAgent(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({
    where: { activateToken: token },
  });

  if (!user || !user.activateTokenExpires || user.activateTokenExpires < new Date()) {
    throw new Error("Invalid or expired token");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      status: "ACTIVE",
      activateToken: null,
      activateTokenExpires: null,
    },
  });

  return { success: true };
}

export async function toggleAgentStatus(agentId: string, currentStatus: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

  await prisma.user.update({
    where: { id: agentId },
    data: { status: newStatus },
  });

  revalidatePath("/admin/agents");
}

export async function deleteField(fieldId: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.field.delete({
    where: { id: fieldId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/fields");
}

export async function resendInvitation(agentId: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); 

  const user = await prisma.user.update({
    where: { id: agentId },
    data: {
      activateToken: token,
      activateTokenExpires: expires,
    },
  });

  await sendActivationEmail(user.email, token, user.name || "Agent");
  return { success: true };
}

export async function createField(formData: FormData) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const cropType = formData.get("cropType") as string;
  const plantingDate = new Date(formData.get("plantingDate") as string);

  const field = await prisma.field.create({
    data: {
      name,
      cropType,
      plantingDate,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/fields");
  return { success: true, id: field.id };
}

export async function assignField(fieldId: string, agentId: string, role: "SUPERVISOR" | "ASSISTANT" = "SUPERVISOR") {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  const data = role === "SUPERVISOR" 
    ? { supervisorId: agentId } 
    : { assistantId: agentId };

  const field = await prisma.field.update({
    where: { id: fieldId },
    data,
    include: { 
      supervisor: true,
      assistant: true
    }
  });

  const assignedAgent = role === "SUPERVISOR" ? field.supervisor : field.assistant;

  if (assignedAgent?.email) {
    await sendFieldAssignmentEmail(
      assignedAgent.email, 
      field.name, 
      assignedAgent.name || "Agent"
    );
  }

  revalidatePath(`/fields/${fieldId}`);
  revalidatePath("/dashboard");
  revalidatePath("/fields");
}

export async function unassignField(fieldId: string, role: "SUPERVISOR" | "ASSISTANT") {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  const data = role === "SUPERVISOR" 
    ? { supervisorId: null } 
    : { assistantId: null };

  await prisma.field.update({
    where: { id: fieldId },
    data
  });

  revalidatePath(`/fields/${fieldId}`);
  revalidatePath("/dashboard");
  revalidatePath("/fields");
}
