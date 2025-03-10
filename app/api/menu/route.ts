import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const prisma = new PrismaClient();

// 🟢 GET - Récupérer tous les menus
export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        ownerUser: true,
        comments: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(menus);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des menus' },
      { status: 500 },
    );
  }
}

// 🟢 SCHEMA de validation pour la création de menu
const menuSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  starter: z.string().optional(),
  dish: z.string().optional(),
  dessert: z.string().optional(),
  information: z.string().optional(),
  proposal: z.string(),
  owner: z.string().nullable().optional(),
});

// 🟢 POST - Ajouter un nouveau menu
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('📩 Reçu:', body); // 🔍 Debug

    const validatedData = menuSchema.parse(body); // Valide avec Zod

    const newMenu = await prisma.menu.create({
      data: validatedData,
    });

    return NextResponse.json(newMenu, { status: 201 });
  } catch (error) {
    console.error('❌ Erreur POST /api/menu:', error);
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
  }
}

// 🟢 PUT - Modifier un menu existant
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'ID du menu requis' }, { status: 400 });

    const updatedMenu = await prisma.menu.update({
      where: { id: body.id },
      data: {
        title: body.title,
        starter: body.starter,
        dish: body.dish,
        dessert: body.dessert,
        information: body.information,
        owner: body.owner,
      },
    });

    return NextResponse.json(updatedMenu);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la modification du menu' }, { status: 400 });
  }
}

// 🟢 DELETE - Supprimer un menu
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID du menu requis' }, { status: 400 });

    await prisma.menu.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Menu supprimé avec succès' });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression du menu' }, { status: 400 });
  }
}

// 🟢 PATCH - Devenir responsable d'un menu
export async function PATCH(req: Request) {
  try {
    const { menuId, userId } = await req.json();
    if (!menuId || !userId) {
      return NextResponse.json(
        { error: "ID du menu et ID de l'utilisateur requis" },
        { status: 400 },
      );
    }

    const menu = await prisma.menu.findUnique({ where: { id: menuId } });
    if (!menu) return NextResponse.json({ error: 'Menu introuvable' }, { status: 404 });
    if (menu.owner)
      return NextResponse.json({ error: 'Ce menu a déjà un responsable' }, { status: 400 });

    const updatedMenu = await prisma.menu.update({
      where: { id: menuId },
      data: { owner: userId },
    });

    return NextResponse.json(updatedMenu);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'assignation du responsable" },
      { status: 500 },
    );
  }
}
