import { registerFn } from "../src/lib/services/auth.ts";

async function testRegister() {
  console.log("=== TESTING USER REGISTRATION ===");
  const testEmail = `alierusdi_${Date.now()}@gmail.com`;
  const res = await registerFn({
    data: {
      name: "Alip Rusdi",
      email: testEmail,
      password: "password123456789"
    }
  });

  console.log("Register Result:", res);
  if (res.success && res.isPendingVerification) {
    console.log("TEST SUCCESSFUL! User registered with pending verification status.");
  } else {
    console.error("TEST FAILED!");
  }
}

testRegister().catch(console.error);
