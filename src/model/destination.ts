import mongoose from "mongoose";

const { Schema, model } = mongoose

interface Destination {
    city: []
}

const DestinationSchema = new Schema({
    city: [{ types: Object}]
})

export default model('Destination', DestinationSchema)

//cast