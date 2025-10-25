export type DecodedJwt = {
  header: {
    typ: string;
    alg: string;
  };
  payload: {
    sub: string;
    exp: number;
    id: string;
  } & ({
    role: 'TEACHER';
    manager: boolean;
  } | {
    role: 'STUDENT'
  });
}

export function decodeJwt(token: string): DecodedJwt | null {
  try {
    const [headerB64, payloadB64] = token.split('.');
    const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    return { header, payload };
  } catch {
    return null;
  }
}