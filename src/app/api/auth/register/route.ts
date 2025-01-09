import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/libs/db";

interface UserRequestBody {
  email: string;
  username: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const data: UserRequestBody = await request.json();

    const userEmailFound = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userEmailFound) {
      return NextResponse.json(
        {
          message: "Email already exists",
        },
        {
          status: 400,
        }
      );
    }

    const userUserNameFound = await db.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (userUserNameFound) {
      return NextResponse.json(
        {
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await db.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
    });

    const { password: _, ...user } = newUser;

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
