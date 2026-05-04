import { Liveblocks } from "@liveblocks/node";

const CURSOR_COLORS = [
  "#F87171",
  "#FB923C",
  "#FACC15",
  "#4ADE80",
  "#34D399",
  "#22D3EE",
  "#60A5FA",
  "#A78BFA",
  "#E879F9",
  "#F472B6",
];

export function getUserCursorColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
}

const globalForLiveblocks = globalThis as unknown as {
  liveblocks: Liveblocks | undefined;
};

export function getLiveblocks(): Liveblocks {
  if (!globalForLiveblocks.liveblocks) {
    const secret = process.env.LIVEBLOCKS_SECRET_KEY?.trim();
    if (!secret) {
      throw new Error(
        "LIVEBLOCKS_SECRET_KEY is required to initialize Liveblocks",
      );
    }

    globalForLiveblocks.liveblocks = new Liveblocks({
      secret,
    });
  }
  return globalForLiveblocks.liveblocks;
}
