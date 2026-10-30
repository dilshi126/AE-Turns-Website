import { randomBytes, randomUUID, createHash, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { z } from "zod";
import { siteContentSchema } from "./content";
import {
  createAdminSession,
  db,
  getContent,
  initialSetupKey,
  removeInitialSetupKey,
  saveContent,
} from "./db";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const isProduction = process.env.NODE_ENV === "production";
const cookieName = isProduction ? "__Host-aeturns-admin" : "aeturns-admin";

app.disable("x-powered-by");
app.use(express.json({ limit: "256kb" }));
app.use(cookieParser());

app.use((_request, response, next) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("X-Frame-Options", "DENY");
  next();
});

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function requireSameOrigin(request: Request, response: Response, next: NextFunction) {
  const origin = request.get("origin");
  if (!origin) {
    response.status(403).json({ error: "Origin is required." });
    return;
  }

  try {
    const originUrl = new URL(origin);
    const expectedHost = request.get("x-forwarded-host") ?? request.get("host");
    const expectedProtocol =
      request.get("x-forwarded-proto") ??
      (request.secure ? "https" : "http");

    if (
      originUrl.host !== expectedHost ||
      originUrl.protocol !== `${expectedProtocol}:`
    ) {
      response.status(403).json({ error: "Cross-origin request rejected." });
      return;
    }
  } catch {
    response.status(403).json({ error: "Invalid request origin." });
    return;
  }

  next();
}

app.get("/api/content", (_request, response) => {
  response.json(getContent());
});

app.get("/api/admin/status", (request, response) => {
  const hasAdmin = Boolean(db.prepare("SELECT 1 FROM admins LIMIT 1").get());
  const token = request.cookies[cookieName] as string | undefined;
  if (!token) {
    response.json({
      authenticated: false,
      setupAvailable: !hasAdmin && Boolean(initialSetupKey),
    });
    return;
  }

  const session = db
    .prepare(
      `SELECT admins.username, admin_sessions.expires_at
       FROM admin_sessions
       JOIN admins ON admins.id = admin_sessions.admin_id
       WHERE admin_sessions.token_hash = ? AND admin_sessions.expires_at > ?`,
    )
    .get(hashToken(token), new Date().toISOString()) as
    | { username: string; expires_at: string }
    | undefined;

  response.json(
    session
      ? {
          authenticated: true,
          username: session.username,
          expiresAt: session.expires_at,
          setupAvailable: false,
        }
      : { authenticated: false, setupAvailable: !hasAdmin && Boolean(initialSetupKey) },
  );
});

const loginSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
});

app.post(
  "/api/admin/login",
  requireSameOrigin,
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many sign-in attempts. Try again in 15 minutes." },
  }),
  async (request, response, next) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({ error: "Enter a username and password." });
      return;
    }

    try {
      const admin = db
        .prepare("SELECT id, username, password_hash FROM admins WHERE username = ?")
        .get(parsed.data.username) as
        | { id: string; username: string; password_hash: string }
        | undefined;
      const passwordHash =
        admin?.password_hash ??
        "$2b$12$B.YC9QK4v3hSc5Pf2hM.fuB1TrJsh.Y3oV4HdgjSd5Tvi.jxTQ4vS";
      const passwordMatches = await bcrypt.compare(
        parsed.data.password,
        passwordHash,
      );

      if (!admin || !passwordMatches) {
        response.status(401).json({ error: "Invalid username or password." });
        return;
      }

      const token = randomBytes(32).toString("base64url");
      const expiresAt = createAdminSession(admin.id, hashToken(token));
      response.cookie(cookieName, token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        expires: new Date(expiresAt),
      });
      response.json({ authenticated: true, username: admin.username });
    } catch (error) {
      next(error);
    }
  },
);

function requireAdmin(request: Request, response: Response, next: NextFunction) {
  const token = request.cookies[cookieName] as string | undefined;
  if (!token) {
    response.status(401).json({ error: "Sign in to manage website content." });
    return;
  }

  const session = db
    .prepare(
      `SELECT token_hash FROM admin_sessions
       WHERE token_hash = ? AND expires_at > ?`,
    )
    .get(hashToken(token), new Date().toISOString()) as
    | { token_hash: string }
    | undefined;

  if (!session || !constantTimeEqual(session.token_hash, hashToken(token))) {
    response.clearCookie(cookieName, { path: "/" });
    response.status(401).json({ error: "Your session expired. Please sign in again." });
    return;
  }

  next();
}

app.put(
  "/api/admin/content",
  requireSameOrigin,
  requireAdmin,
  (request, response) => {
    const parsed = siteContentSchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(400).json({
        error: "Some content is invalid. Review the fields and try again.",
        details: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    response.json(saveContent(parsed.data));
  },
);

app.post(
  "/api/admin/logout",
  requireSameOrigin,
  requireAdmin,
  (request, response) => {
    const token = request.cookies[cookieName] as string;
    db.prepare("DELETE FROM admin_sessions WHERE token_hash = ?").run(
      hashToken(token),
    );
    response.clearCookie(cookieName, { path: "/" });
    response.json({ authenticated: false });
  },
);

app.post(
  "/api/admin/setup",
  requireSameOrigin,
  async (request, response, next) => {
    const setupSchema = z.object({
      setupKey: z.string().min(16).max(200),
      username: z.string().trim().min(3).max(100).regex(/^[a-zA-Z0-9._-]+$/),
      password: z.string().min(12).max(200),
    });
    const parsed = setupSchema.safeParse(request.body);
    const expectedKey = initialSetupKey;
    if (!expectedKey) {
      response.status(404).json({ error: "First-run setup is not enabled." });
      return;
    }
    if (!parsed.success) {
      response.status(400).json({
        error: "Use a valid username and a password with at least 12 characters.",
      });
      return;
    }
    if (!constantTimeEqual(parsed.data.setupKey, expectedKey)) {
      response.status(403).json({ error: "Invalid setup key." });
      return;
    }

    try {
      const passwordHash = await bcrypt.hash(parsed.data.password, 12);
      const createFirstAdmin = db.transaction(() => {
        if (db.prepare("SELECT 1 FROM admins LIMIT 1").get()) return false;

        db.prepare(
          "INSERT INTO admins (id, username, password_hash, created_at) VALUES (?, ?, ?, ?)",
        ).run(
          randomUUID(),
          parsed.data.username,
          passwordHash,
          new Date().toISOString(),
        );
        return true;
      });

      if (!createFirstAdmin()) {
        response.status(409).json({ error: "An admin account already exists." });
        return;
      }

      removeInitialSetupKey();
      response.status(201).json({ created: true });
    } catch (error) {
      next(error);
    }
  },
);

async function seedInitialAdmin() {
  if (db.prepare("SELECT 1 FROM admins LIMIT 1").get()) return;

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (username && password) {
    if (username.length < 3 || password.length < 12) {
      throw new Error("ADMIN_USERNAME must be 3+ characters and ADMIN_PASSWORD 12+.");
    }
    const hash = await bcrypt.hash(password, 12);
    db.prepare(
      "INSERT INTO admins (id, username, password_hash, created_at) VALUES (?, ?, ?, ?)",
    ).run(randomUUID(), username, hash, new Date().toISOString());
    removeInitialSetupKey();
    console.info(`Created first admin account "${username}" from environment.`);
    return;
  }

  console.info(
    "No admin account exists yet. Open /admin/setup and enter the one-time setup key stored in data/admin-setup-key.txt.",
  );
}

async function start() {
  await seedInitialAdmin();

  app.use(express.static("dist", { index: false }));
  app.use((request, response, next) => {
    if (request.path.startsWith("/api/")) {
      response.status(404).json({ error: "API endpoint not found." });
      return;
    }
    if (request.path === "/admin" || request.path.startsWith("/admin/")) {
      response.sendFile("admin.html", { root: "dist" }, (error) => {
        if (error) next(error);
      });
      return;
    }
    response.sendFile("index.html", { root: "dist" }, (error) => {
      if (error) next(error);
    });
  });

  app.use(
    (error: unknown, _request: Request, response: Response, _next: NextFunction) => {
      console.error("API request failed.", error);
      response.status(500).json({ error: "The server could not complete the request." });
    },
  );

  app.listen(port, "0.0.0.0", () => {
    console.info(`AE Turns site and admin API listening on http://localhost:${port}`);
    if (initialSetupKey) {
      console.info("First admin setup is available at /admin/setup.");
    }
  });
}

if (db.prepare("SELECT content_json FROM site_content WHERE id = 1").get()) {
  void start();
}

export { app };
