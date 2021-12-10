import mongoose from "mongoose";

const { Schema, model } = mongoose;

interface Destination {
  city: string;
}

const DestinationSchema = new Schema<Destination>({
  city: { type: String, required: true },
});

export default model("Destination", DestinationSchema);
