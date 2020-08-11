const responseConstants = {
  STANDARD: {
    SUCCESS: 200,
  },
  SUCCESS203: {
    CODE: 203,
  },
  ERROR400: {
    CODE: 400,
    ERROR: 4000,
    SERROR: 4002,
    MESSAGE: "BAD_REQUEST",
  },
  ERROR401: {
    CODE: 401,
    ERROR: 4001,
    MESSAGE: "UNAUTHORIZED",
  },
  ERROR403: {
    CODE: 403,
    ERROR: 4003,
    MESSAGE: "FORBIDDEN_ACCESS",
  },
  ERROR404: {
    CODE: 404,
    ERROR: 4004,
    MESSAGE: "GUEST_USER",
  },
  ERROR500: {
    CODE: 500,
    MESSAGE: "TRY_AGAIN",
  },
};

export default responseConstants;
