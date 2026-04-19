import { prisma } from "@/lib/db";
import { ApplicationQuestion } from "@prisma/client";

export async function getAllQuestions(): Promise<ApplicationQuestion[]> {
  return prisma.applicationQuestion.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

export async function createQuestion(data: any) {
  return prisma.applicationQuestion.create({
    data: {
      label: data.label,
      type: data.type,
      placeholder: data.placeholder || null,
      required: data.required,
      order: data.order,
      options: data.options,
      metadata: data.metadata,
      isActive: data.isActive,
    },
  });
}

export async function updateQuestion(id: string, data: any) {
  return prisma.applicationQuestion.update({
    where: { id },
    data: {
      label: data.label,
      type: data.type,
      placeholder: data.placeholder !== undefined ? data.placeholder : undefined,
      required: data.required !== undefined ? data.required : undefined,
      order: data.order !== undefined ? data.order : undefined,
      options: data.options !== undefined ? data.options : undefined,
      metadata: data.metadata !== undefined ? data.metadata : undefined,
      isActive: data.isActive !== undefined ? data.isActive : undefined,
    },
  });
}

export async function deleteQuestion(id: string) {
  return prisma.applicationQuestion.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function reorderQuestions(
  questions: Array<{ id: string; order: number }>
) {
  return Promise.all(
    questions.map((q) =>
      prisma.applicationQuestion.update({
        where: { id: q.id },
        data: { order: q.order },
      })
    )
  );
}
