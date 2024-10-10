import Supplier from "@/models/Supplier"; // Assuming your model is in this path

// GET: Fetch all suppliers
export async function GET() {
  try {
    const suppliers = await Supplier.find(); // Fetch all suppliers from the database
    return new Response(JSON.stringify(suppliers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response("Failed to fetch suppliers", { status: 500 });
  }
}

// POST: Add a new supplier
export async function POST(request) {
  try {
    const body = await request.json(); // Get the request body
    const supplier = new Supplier(body); // Create a new Supplier instance
    await supplier.save(); // Save the new supplier to the database
    return new Response(JSON.stringify(supplier), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response("Failed to create supplier", { status: 500 });
  }
}

// PUT: Update an existing supplier
export async function PUT(request) {
  try {
    const body = await request.json(); // Get the request body
    const { _id, ...updateData } = body; // Destructure to get supplier ID and update data
    const updatedSupplier = await Supplier.findByIdAndUpdate(_id, updateData, { new: true }); // Update supplier
    if (!updatedSupplier) {
      return new Response("Supplier not found", { status: 404 });
    }
    return new Response(JSON.stringify(updatedSupplier), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response("Failed to update supplier", { status: 500 });
  }
}

// DELETE: Remove a supplier
export async function DELETE(request) {
  try {
    const body = await request.json(); // Get the request body
    const { _id } = body; // Get supplier ID
    const deletedSupplier = await Supplier.findByIdAndDelete(_id); // Delete supplier
    if (!deletedSupplier) {
      return new Response("Supplier not found", { status: 404 });
    }
    return new Response("Supplier deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Failed to delete supplier", { status: 500 });
  }
}
