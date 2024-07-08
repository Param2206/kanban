import { NextRequest, NextResponse } from 'next/server';
import { db } from "../../../../prisma/src/db"

export async function GET(req: NextRequest) {
    try {
        const data = await db.user.findMany();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({message: 'something went wrong'});
    }
}