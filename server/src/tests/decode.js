import jwt from "jsonwebtoken";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMzIxYzg0LTc3NTgtNGY5ZC04MjBkLTM2MDExNGJiMDU1MSIsImVtYWlsIjoiZW1pbHlmZWxpY2lvMDVAZ21haWwuY29tIiwiY3BmIjoiMTIzLjEyMy4xMjMtMDAiLCJuYW1lIjoiRW1pbHkgQ2FydmFsaG8gRmVsaWNpbyIsImJpcnRoX2RhdGUiOiIyMDI1LTA0LTAzVDAzOjAwOjAwLjAwMFoiLCJ1cmxfcHJvZmlsZV9waWN0dXJlIjpudWxsLCJ1cmxfZG9jdW1lbnRfcGljdHVyZSI6bnVsbCwicm9sZSI6ImFzc29jaWF0ZSIsImFzc29jaWF0ZV9yb2xlIjoicGFydG5lciIsInV0Y19jcmVhdGVkX29uIjoiMjAyNS0wNC0xNFQxOTo1NjoyNi44MjVaIiwiaWF0IjoxNzQ0NzE4MTE5LCJleHAiOjE3NDU5Mjc3MTl9.IXmxKAdLf2PvMutdCZYAeLXhP878RPBD_-48H2KJd-E";
const secret = "2y19SBD4yRpnDB6w8AbAp7uS6eDr1wxIayS8cOh6OlLgoO38YyMDkBKPi";

try {
  const decoded = jwt.verify(token, secret);
  console.log("✅ Token OK", decoded);
} catch (err) {
  console.error("❌ Token inválido", err.message);
}
