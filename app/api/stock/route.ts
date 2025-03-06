import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const stockSchema = z.object({
  productName: z.string().min(1),
  productType: z.string().min(1),
  quantity: z.number().int().nonnegative(),
  updatedBy: z.string().uuid(),
});

//? 🟢 Get all stocks
export async function GET() {
  try {
    const stocks = await prisma.stock.findMany({
      include: { updatedByUser: true, history: true },
    });
    return NextResponse.json(stocks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

//? 🟢 Add new stock
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = stockSchema.parse(body);

    const newStock = await prisma.stock.create({
      data: validatedData,
    });

    return NextResponse.json(newStock, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
  }
}

//? 🟢 Update stock and add history
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, quantity, updatedBy } = body;

    const stock = await prisma.stock.findUnique({ where: { id } });
    if (!stock) {
      return NextResponse.json({ error: 'Stock non trouvé' }, { status: 404 });
    }

    await prisma.stockHistory.create({
      data: {
        stockId: id,
        quantityBefore: stock.quantity,
        quantityAfter: quantity,
        updatedBy,
      },
    });

    const updatedStock = await prisma.stock.update({
      where: { id },
      data: { quantity, updatedBy },
    });

    return NextResponse.json(updatedStock, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 400 });
  }
}

//? 🟢 Delete stock
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const stock = await prisma.stock.findUnique({ where: { id } });
    if (!stock) {
      return NextResponse.json({ error: 'Stock non trouvé' }, { status: 404 });
    }

    await prisma.stock.delete({ where: { id } });

    return NextResponse.json({ message: 'Stock supprimé avec succès' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 400 });
  }
}
