import { NextResponse } from "next/server";
import { getPayload } from 'payload';
import configPromise from '@payload-config'

export async function POST(req: Request) {
  const payload = await getPayload({
    config: configPromise,
  });
  try {
    const data = await req.formData();
    const file = data.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { message: "No se ha proporcionado ningún archivo" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Buffer(bytes);

    const certificate = await payload.create({
      collection: "certificate",
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
      data: {},
    });

    return NextResponse.json(certificate);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Error al subir el certificado" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Método no permitido" },
    { status: 405 }
  );
}