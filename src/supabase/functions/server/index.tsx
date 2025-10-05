import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c7840ac0/health", (c) => {
  return c.json({ status: "ok" });
});

// Auth: Signup endpoint
app.post("/make-server-c7840ac0/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name
      }
    });
  } catch (error) {
    console.log("Signup error:", error);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// User Profile Routes
app.get("/make-server-c7840ac0/profile/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const profile = await kv.get(`profile:${userId}`);
    
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }
    
    return c.json(profile);
  } catch (error) {
    console.log("Error fetching profile:", error);
    return c.json({ error: "Failed to fetch profile" }, 500);
  }
});

app.post("/make-server-c7840ac0/profile/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const profileData = await c.req.json();
    
    await kv.set(`profile:${userId}`, profileData);
    
    return c.json({ success: true, profile: profileData });
  } catch (error) {
    console.log("Error saving profile:", error);
    return c.json({ error: "Failed to save profile" }, 500);
  }
});

// Order History Routes
app.get("/make-server-c7840ac0/orders/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const orders = await kv.get(`orders:${userId}`);
    
    return c.json(orders || []);
  } catch (error) {
    console.log("Error fetching orders:", error);
    return c.json({ error: "Failed to fetch orders" }, 500);
  }
});

app.post("/make-server-c7840ac0/orders/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const orderData = await c.req.json();
    
    const existingOrders = await kv.get(`orders:${userId}`) || [];
    const updatedOrders = Array.isArray(existingOrders) ? [...existingOrders, orderData] : [orderData];
    
    await kv.set(`orders:${userId}`, updatedOrders);
    
    return c.json({ success: true, orders: updatedOrders });
  } catch (error) {
    console.log("Error saving order:", error);
    return c.json({ error: "Failed to save order" }, 500);
  }
});

// Social Media Connections Routes
app.get("/make-server-c7840ac0/social/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const connections = await kv.get(`social:${userId}`);
    
    return c.json(connections || { instagram: false, tiktok: false, pinterest: false });
  } catch (error) {
    console.log("Error fetching social connections:", error);
    return c.json({ error: "Failed to fetch social connections" }, 500);
  }
});

app.post("/make-server-c7840ac0/social/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const connectionData = await c.req.json();
    
    await kv.set(`social:${userId}`, connectionData);
    
    return c.json({ success: true, connections: connectionData });
  } catch (error) {
    console.log("Error saving social connections:", error);
    return c.json({ error: "Failed to save social connections" }, 500);
  }
});

// Moodboard Routes
app.get("/make-server-c7840ac0/moodboards/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const moodboards = await kv.get(`moodboards:${userId}`);
    
    return c.json(moodboards || []);
  } catch (error) {
    console.log("Error fetching moodboards:", error);
    return c.json({ error: "Failed to fetch moodboards" }, 500);
  }
});

app.post("/make-server-c7840ac0/moodboards/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const moodboardData = await c.req.json();
    
    const existingMoodboards = await kv.get(`moodboards:${userId}`) || [];
    const updatedMoodboards = Array.isArray(existingMoodboards) ? [...existingMoodboards, { ...moodboardData, id: Date.now() }] : [{ ...moodboardData, id: Date.now() }];
    
    await kv.set(`moodboards:${userId}`, updatedMoodboards);
    
    return c.json({ success: true, moodboards: updatedMoodboards });
  } catch (error) {
    console.log("Error saving moodboard:", error);
    return c.json({ error: "Failed to save moodboard" }, 500);
  }
});

app.delete("/make-server-c7840ac0/moodboards/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    await kv.del(`moodboards:${userId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting moodboards:", error);
    return c.json({ error: "Failed to delete moodboards" }, 500);
  }
});

// Wishlist Routes
app.get("/make-server-c7840ac0/wishlist/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const wishlist = await kv.get(`wishlist:${userId}`);
    
    return c.json(wishlist || []);
  } catch (error) {
    console.log("Error fetching wishlist:", error);
    return c.json({ error: "Failed to fetch wishlist" }, 500);
  }
});

app.post("/make-server-c7840ac0/wishlist/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const wishlistData = await c.req.json();
    
    await kv.set(`wishlist:${userId}`, wishlistData);
    
    return c.json({ success: true, wishlist: wishlistData });
  } catch (error) {
    console.log("Error saving wishlist:", error);
    return c.json({ error: "Failed to save wishlist" }, 500);
  }
});

// Style Analysis Routes
app.get("/make-server-c7840ac0/style-analysis/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const styleAnalysis = await kv.get(`style:${userId}`);
    
    return c.json(styleAnalysis || null);
  } catch (error) {
    console.log("Error fetching style analysis:", error);
    return c.json({ error: "Failed to fetch style analysis" }, 500);
  }
});

app.post("/make-server-c7840ac0/style-analysis/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const styleData = await c.req.json();
    
    await kv.set(`style:${userId}`, styleData);
    
    return c.json({ success: true, styleAnalysis: styleData });
  } catch (error) {
    console.log("Error saving style analysis:", error);
    return c.json({ error: "Failed to save style analysis" }, 500);
  }
});

// Pinterest OAuth Routes
app.get("/make-server-c7840ac0/pinterest/auth-url", async (c) => {
  try {
    const userId = c.req.query("userId");
    const appId = Deno.env.get("PINTEREST_APP_ID");
    const redirectUri = c.req.query("redirectUri") || `${c.req.header("origin")}/pinterest-callback`;
    
    if (!appId) {
      return c.json({ error: "Pinterest App ID not configured" }, 500);
    }
    
    const state = `${userId}:${Date.now()}`;
    await kv.set(`pinterest_state:${state}`, { userId, timestamp: Date.now() });
    
    const scope = "boards:read,pins:read,user_accounts:read";
    const authUrl = `https://www.pinterest.com/oauth/?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}`;
    
    return c.json({ authUrl, state });
  } catch (error) {
    console.log("Error generating Pinterest auth URL:", error);
    return c.json({ error: "Failed to generate Pinterest auth URL" }, 500);
  }
});

app.post("/make-server-c7840ac0/pinterest/callback", async (c) => {
  try {
    const { code, state } = await c.req.json();
    
    const stateData = await kv.get(`pinterest_state:${state}`);
    if (!stateData) {
      return c.json({ error: "Invalid or expired state" }, 400);
    }
    
    const appId = Deno.env.get("PINTEREST_APP_ID");
    const appSecret = Deno.env.get("PINTEREST_APP_SECRET");
    
    if (!appId || !appSecret) {
      return c.json({ error: "Pinterest credentials not configured" }, 500);
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${btoa(`${appId}:${appSecret}`)}`
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(c.req.query("redirectUri") || "")}`
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.log("Pinterest token exchange error:", tokenData);
      return c.json({ error: "Failed to exchange code for token" }, 400);
    }
    
    // Store access token for user
    await kv.set(`pinterest_token:${stateData.userId}`, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + (tokenData.expires_in * 1000)
    });
    
    // Clean up state
    await kv.del(`pinterest_state:${state}`);
    
    return c.json({ success: true, userId: stateData.userId });
  } catch (error) {
    console.log("Pinterest callback error:", error);
    return c.json({ error: "Failed to complete Pinterest authentication" }, 500);
  }
});

app.get("/make-server-c7840ac0/pinterest/boards/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const tokenData = await kv.get(`pinterest_token:${userId}`);
    
    if (!tokenData) {
      return c.json({ error: "Pinterest not connected" }, 401);
    }
    
    // Fetch user's boards from Pinterest API
    const response = await fetch("https://api.pinterest.com/v5/boards", {
      headers: {
        "Authorization": `Bearer ${tokenData.accessToken}`
      }
    });
    
    if (!response.ok) {
      console.log("Pinterest API error:", await response.text());
      return c.json({ error: "Failed to fetch boards from Pinterest" }, response.status);
    }
    
    const data = await response.json();
    
    return c.json({ boards: data.items || [] });
  } catch (error) {
    console.log("Error fetching Pinterest boards:", error);
    return c.json({ error: "Failed to fetch Pinterest boards" }, 500);
  }
});

app.get("/make-server-c7840ac0/pinterest/pins/:userId/:boardId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const boardId = c.req.param("boardId");
    const tokenData = await kv.get(`pinterest_token:${userId}`);
    
    if (!tokenData) {
      return c.json({ error: "Pinterest not connected" }, 401);
    }
    
    // Fetch pins from specific board
    const response = await fetch(`https://api.pinterest.com/v5/boards/${boardId}/pins`, {
      headers: {
        "Authorization": `Bearer ${tokenData.accessToken}`
      }
    });
    
    if (!response.ok) {
      console.log("Pinterest API error:", await response.text());
      return c.json({ error: "Failed to fetch pins from Pinterest" }, response.status);
    }
    
    const data = await response.json();
    
    return c.json({ pins: data.items || [] });
  } catch (error) {
    console.log("Error fetching Pinterest pins:", error);
    return c.json({ error: "Failed to fetch Pinterest pins" }, 500);
  }
});

app.delete("/make-server-c7840ac0/pinterest/disconnect/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    await kv.del(`pinterest_token:${userId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log("Error disconnecting Pinterest:", error);
    return c.json({ error: "Failed to disconnect Pinterest" }, 500);
  }
});

// Inspiration Routes
app.get("/make-server-c7840ac0/inspiration/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const inspiration = await kv.get(`inspiration:${userId}`);
    
    return c.json(inspiration || null);
  } catch (error) {
    console.log("Error fetching inspiration:", error);
    return c.json({ error: "Failed to fetch inspiration" }, 500);
  }
});

app.post("/make-server-c7840ac0/inspiration/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const { images } = await c.req.json();
    
    const inspirationData = {
      images,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`inspiration:${userId}`, inspirationData);
    
    return c.json({ success: true, inspiration: inspirationData });
  } catch (error) {
    console.log("Error saving inspiration:", error);
    return c.json({ error: "Failed to save inspiration" }, 500);
  }
});

Deno.serve(app.fetch);