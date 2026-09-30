import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { sendWelcomeEmail } from "../../../../lib/email";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.artist.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Note: In production, hash the password using bcrypt or argon2!
    // For this prototype, we're storing it in plain text to get things working fast.
    const user = await prisma.artist.create({
      data: {
        email,
        passwordHash: password,
        name,
        // Basic slug generation
        slug: name ? name.toLowerCase().replace(/[^a-z0-9]/g, "-") : email.split("@")[0],
      },
    });

    await sendWelcomeEmail(user.email, user.name);

    return NextResponse.json(
      { message: "User created successfully", user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
