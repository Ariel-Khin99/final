import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
 
}, { strict: false });

const Supplier = mongoose.models.supplier || mongoose.model("supplier", supplierSchema);

export default Supplier;
