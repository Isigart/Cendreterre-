import { getRedis, keys } from "./redis";
import type { BatchSession } from "./types";

export async function saveSession(session: BatchSession): Promise<void> {
  const redis = getRedis();
  await redis.set(keys.session(session.id), session);
  if (session.status === "active" || session.status === "paused") {
    await redis.set(keys.activeSession(session.userId), session.id);
  }
}

export async function getSession(id: string): Promise<BatchSession | null> {
  const redis = getRedis();
  return redis.get<BatchSession>(keys.session(id));
}

export async function getActiveSession(userId: string): Promise<BatchSession | null> {
  const redis = getRedis();
  const sessionId = await redis.get<string>(keys.activeSession(userId));
  if (!sessionId) return null;
  return getSession(sessionId);
}

export async function advanceTask(
  sessionId: string
): Promise<BatchSession | null> {
  const session = await getSession(sessionId);
  if (!session || session.status !== "active") return null;

  const currentTask = session.tasks[session.currentTaskIndex];
  if (currentTask) {
    currentTask.status = "completed";
    currentTask.completedAt = new Date().toISOString();
  }

  session.currentTaskIndex++;

  if (session.currentTaskIndex >= session.tasks.length) {
    session.status = "completed";
    session.completedAt = new Date().toISOString();
    const redis = getRedis();
    await redis.del(keys.activeSession(session.userId));
  } else {
    const nextTask = session.tasks[session.currentTaskIndex];
    nextTask.status = "active";
    nextTask.startedAt = new Date().toISOString();
  }

  await saveSession(session);
  return session;
}

export async function startSession(
  sessionId: string
): Promise<BatchSession | null> {
  const session = await getSession(sessionId);
  if (!session || session.status !== "planning") return null;

  session.status = "active";
  session.actualStartedAt = new Date().toISOString();

  if (session.tasks.length > 0) {
    session.tasks[0].status = "active";
    session.tasks[0].startedAt = new Date().toISOString();
  }

  await saveSession(session);
  return session;
}

export async function pauseSession(
  sessionId: string
): Promise<BatchSession | null> {
  const session = await getSession(sessionId);
  if (!session || session.status !== "active") return null;

  session.status = "paused";
  await saveSession(session);
  return session;
}

export async function resumeSession(
  sessionId: string
): Promise<BatchSession | null> {
  const session = await getSession(sessionId);
  if (!session || session.status !== "paused") return null;

  session.status = "active";
  await saveSession(session);
  return session;
}

export async function addToHistory(
  userId: string,
  sessionId: string
): Promise<void> {
  const redis = getRedis();
  await redis.lpush(keys.sessionHistory(userId), sessionId);
  // Keep last 50 sessions
  await redis.ltrim(keys.sessionHistory(userId), 0, 49);
}
