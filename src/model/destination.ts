import mongoose from "mongoose";

const { Schema, model } = mongoose

interface Destination {
    city: []
}

const DestinationSchema = new Schema({
    city: []
})

//cast