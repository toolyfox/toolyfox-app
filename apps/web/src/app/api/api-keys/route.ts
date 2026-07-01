import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const membership = await prisma.membership.findFirst({
      where: { userId: user.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    const keys = await prisma.apiKey.findMany({
      where: { orgId: membership.orgId },
      select: {
        id: true,
        name: true,
        scopes: true,
        lastUsedAt: true,
        createdAt: true,
        key: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const maskedKeys = keys.map((k) => ({
      ...k,
      key: k.key.slice(0, 8) + "..." + k.key.slice(-4),
    }));

    return NextResponse.json(maskedKeys);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, scopes } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 },
      );
    }

    const membership = await prisma.membership.findFirst({
      where: { userId: user.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    const rawKey = "tfx_" + crypto.randomBytes(32).toString("hex");
    const hashedKey = crypto.createHash("sha256").update(rawKey).digest("hex");

    await prisma.apiKey.create({
      data: {
        orgId: membership.orgId,
        name,
        key: hashedKey,
        scopes: scopes ?? ["read"],
      },
    });

    return NextResponse.json({ key: rawKey });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
