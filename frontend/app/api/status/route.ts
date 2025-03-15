import { NextResponse } from "next/server";

// Define process.env type for TypeScript
declare const process: {
  env: {
    BACKEND_URL?: string;
  };
};

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";

  try {
    // Try to reach the backend
    const response = await fetch(`${backendUrl}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        status: "ok",
        frontend: "running",
        backend: "connected",
        backendResponse: data,
      });
    } else {
      return NextResponse.json(
        {
          status: "partial",
          frontend: "running",
          backend: "error",
          error: `Backend returned status ${response.status}`,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error connecting to backend:", error);
    return NextResponse.json(
      {
        status: "partial",
        frontend: "running",
        backend: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 }
    );
  }
}
