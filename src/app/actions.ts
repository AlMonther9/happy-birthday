"use server";

interface WishData {
  name: string;
  wish: string;
  date: string;
  gender?: "male" | "female";
}

export async function sendWish(data: WishData) {
  try {
    // In a real app, you might send this to a database or API
    // For this example, we'll simulate storing it

    // Option 1: Log it (for demo purposes)
    console.log("Wish received:", data);

    // Option 2: Store in a JSON file (if running on a server with write access)
    // Uncomment this in a real deployment with proper file system access
    /*
    const wishesDir = path.join(process.cwd(), "wishes")
    
    try {
      await fs.mkdir(wishesDir, { recursive: true })
    } catch (err) {
      // Directory might already exist
    }
    
    const wishFile = path.join(wishesDir, `${Date.now()}-${data.name.replace(/[^a-z0-9]/gi, '_')}.json`)
    await fs.writeFile(wishFile, JSON.stringify(data, null, 2), "utf-8")
    */

    // Option 3: In a real app, you might use a database
    // await db.wishes.create({ data })

    return { success: true };
  } catch (error) {
    console.error("Error saving wish:", error);
    throw new Error("Failed to save wish");
  }
}
