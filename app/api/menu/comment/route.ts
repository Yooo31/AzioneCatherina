import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const prisma = new PrismaClient();

// 🟢 SCHEMA de validation Zod pour un commentaire
const commentSchema = z.object({
  menuId: z.string(),
  userId: z.string(),
  comment: z.string().min(3, 'Le commentaire doit contenir au moins 3 caractères'),
});

// 🟢 GET - Récupérer les commentaires d'un menu
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const menuId = searchParams.get('menuId');

    if (!menuId) {
      return NextResponse.json({ error: 'ID du menu requis' }, { status: 400 });
    }

    const comments = await prisma.menuCommentary.findMany({
      where: { menuId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commentaires' },
      { status: 500 },
    );
  }
}

// 🟢 POST - Ajouter un commentaire
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = commentSchema.parse(body);

    const newComment = await prisma.menuCommentary.create({
      data: validatedData,
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de l'ajout du commentaire" }, { status: 400 });
  }
}

// 🟢 PUT - Modifier un commentaire
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id || !body.comment) {
      return NextResponse.json({ error: 'ID et commentaire requis' }, { status: 400 });
    }

    const updatedComment = await prisma.menuCommentary.update({
      where: { id: body.id },
      data: { comment: body.comment },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la modification du commentaire' },
      { status: 400 },
    );
  }
}

// 🟢 DELETE - Supprimer un commentaire
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID du commentaire requis' }, { status: 400 });

    await prisma.menuCommentary.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du commentaire' },
      { status: 400 },
    );
  }
}
