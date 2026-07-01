import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

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
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 },
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invalid invitation" },
        { status: 404 },
      );
    }

    if (invitation.email !== user.email) {
      return NextResponse.json(
        { error: "This invitation was sent to a different email" },
        { status: 403 },
      );
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 410 },
      );
    }

    const existingMembership = await prisma.membership.findFirst({
      where: { userId: user.id, orgId: invitation.orgId },
    });

    if (!existingMembership) {
      await prisma.membership.create({
        data: {
          userId: user.id,
          orgId: invitation.orgId,
          role: invitation.role,
        },
      });
    }

    await prisma.invitation.delete({
      where: { id: invitation.id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
