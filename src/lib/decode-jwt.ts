export type DecodedJwt = {
  header: {
    typ: string;
    alg: string;
  };
  payload: {
    sub: string;
    exp: number;
    id: string;
    email: string;
    name: string;
    last_name: string;
    birth_date: string;
    phone: string;
  } & ({
    role: 'TEACHER';
    manager: boolean;
  } | {
    role: 'STUDENT'
    code: string;
    classroom_id: string;
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