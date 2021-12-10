import mongoose from "mongoose";

const { Schema, model } = mongoose

interface Destination {
    city: string
}


const DestinationSchema = new Schema<>({
    city: [{ types: Object}]
})

export default model('Destination', DestinationSchema)

//cast