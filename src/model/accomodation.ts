import mongoose, { Types } from "mongoose";

const { Schema, model } = mongoose;

interface Accomodation {
  name: string;
  description: string;
  maxGuests: number;
  city: Types.ObjectId;
  host: Types.ObjectId;
}

const AccomodationSchema = new Schema<Accomodation>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  maxGuests: { type: Number, required: true },
  city: { type: Schema.Types.ObjectId, ref: "Destination" },
  host: { type: Schema.Types.ObjectId, ref: "Host", required: true },
});

export default model("Accomodation", AccomodationSchema);
