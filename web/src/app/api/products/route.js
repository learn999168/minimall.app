import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Get all products (with optional filters)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const userId = searchParams.get("userId");

    let query = "SELECT * FROM products WHERE 1=1";
    const values = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      values.push(category);
    }

    if (search) {
      paramCount++;
      query += ` AND (LOWER(title) LIKE LOWER($${paramCount}) OR LOWER(description) LIKE LOWER($${paramCount}))`;
      values.push(`%${search}%`);
    }

    if (userId) {
      paramCount++;
      query += ` AND user_id = $${paramCount}`;
      values.push(userId);
    }

    query += " ORDER BY created_at DESC";

    const products = await sql(query, values);
    return Response.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// Create a new product
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, price, image_url, category, condition } = body;

    if (!title || !price) {
      return Response.json(
        { error: "Title and price are required" },
        { status: 400 },
      );
    }

    // Try to get user if logged in
    const session = await auth();
    const userId = session?.user?.id || null;

    const result = await sql(
      `INSERT INTO products (user_id, title, description, price, image_url, category, condition)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        userId,
        title,
        description || null,
        price,
        image_url || null,
        category || null,
        condition || null,
      ],
    );

    return Response.json({ product: result[0] });
  } catch (error) {
    console.error("Error creating product:", error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
