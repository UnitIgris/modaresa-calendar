import { SignJWT, jwtVerify } from "jose";
import Cookies from "js-cookie";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

// export async function encrypt(payload: any) {
//   return await new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("10 sec from now")
//     .sign(key);
// }

// export async function decrypt(input: string): Promise<any> {
//   const { payload } = await jwtVerify(input, key, {
//     algorithms: ["HS256"],
//   });
//   return payload;
// }

// export async function test() {
//   // Verify credentials && get the user

//   const user = {
//     id: 7,
//     email: "sam@gmail.co",
//     fullname: "sa",
//     password: "sam",
//     type: "vendor",
//   };

//   // Create the session
//   const expires = new Date(Date.now() + 10 * 1000);
//   const session = await encrypt({ user, expires });

//   // Save the session in a cookie
//   Cookies.set("session", session, { expires, httpOnly: true });
//   console.log(new Date(Date.now() + 10 * 1000))
// }
// test()

// export async function getSession() {
//   const session = Cookies.get("session")?.valueOf;
//   if (!session) return null;
//   return await decrypt("o");
// }

// export async function updateSession(request: NextRequest) {
//   const session = request.cookies.get("session")?.value;
//   if (!session) return;

//   // Refresh the session so it doesn't expire
//   const parsed = await decrypt(session);
//   parsed.expires = new Date(Date.now() + 10 * 1000);
//   const res = NextResponse.next();
//   res.cookies.set({
//     name: "session",
//     value: await encrypt(parsed),
//     httpOnly: true,
//     expires: parsed.expires,
//   });
//   return res;
// }
