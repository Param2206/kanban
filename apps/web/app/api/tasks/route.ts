import { NextRequest, NextResponse } from 'next/server';
import { db } from "../../../prisma/src/db";

export async function GET() {
    try {
        const data = await db.task.findMany();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({message: 'something went wrong'});
    }
}