import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 500): NextResponse<{ message: string }> {
  return NextResponse.json({ message }, { status });
}

export function handleRouteError(error: unknown): NextResponse<{ message: string }> {
  if (typeof error === "object" && error !== null && "code" in error) {
    if ((error as { code: string }).code === "23505") {
      return fail("این رکورد تکراری است (احتمالاً پلاک قبلاً ثبت شده)", 409);
    }
  }
  return fail("خطای سرور. لطفاً دوباره تلاش کنید", 500);
}
