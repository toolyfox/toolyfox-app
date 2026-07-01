import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 },
      );
    }

    const userId = authData.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: { id: userId, email, name },
      });
    }

    const existingMembership = await prisma.membership.findFirst({
      where: { userId },
    });

    if (!existingMembership) {
      const orgSlug = slugify(name) + "-" + userId.slice(0, 8);

      const org = await prisma.organization.create({
        data: {
          name: `${name}'s Organization`,
          slug: orgSlug,
          plan: "free",
        },
      });

      await prisma.membership.create({
        data: {
          userId,
          orgId: org.id,
          role: "owner",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
