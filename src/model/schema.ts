import mongoose from "mongoose";

const { Schema, model } = mongoose


interface Accomodation {
    name: string;
    description: string;
    maxGuests: number;
    city: string;
}

const AccomodationSchema = new Schema<Accomodation>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    maxGuests: {type: Number, required: true},
    city: { type: Schema.Types.ObjectId, ref: "Destination" } 
})

export default model('Accomodation', AccomodationSchema)



