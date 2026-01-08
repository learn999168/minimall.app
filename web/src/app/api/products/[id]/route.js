import sql from "@/app/api/utils/sql";

// Get a single product
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const result = await sql`SELECT * FROM products WHERE id = ${id}`;

    if (result.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ product: result[0] });
  } catch (error) {
    console.error("Error fetching product:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// Update a product
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const existing = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (existing.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const setClauses = [];
    const values = [];
    let paramCount = 0;

    if (body.title !== undefined) {
      paramCount++;
      setClauses.push(`title = $${paramCount}`);
      values.push(body.title);
    }
    if (body.description !== undefined) {
      paramCount++;
      setClauses.push(`description = $${paramCount}`);
      values.push(body.description);
    }
    if (body.price !== undefined) {
      paramCount++;
      setClauses.push(`price = $${paramCount}`);
      values.push(body.price);
    }
    if (body.image_url !== undefined) {
      paramCount++;
      setClauses.push(`image_url = $${paramCount}`);
      values.push(body.image_url);
    }
    if (body.category !== undefined) {
      paramCount++;
      setClauses.push(`category = $${paramCount}`);
      values.push(body.category);
    }
    if (body.condition !== undefined) {
      paramCount++;
      setClauses.push(`condition = $${paramCount}`);
      values.push(body.condition);
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    paramCount++;
    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `UPDATE products SET ${setClauses.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    values.push(id);

    const result = await sql(query, values);
    return Response.json({ product: result[0] });
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// Delete a product
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const existing = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (existing.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    await sql`DELETE FROM products WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
