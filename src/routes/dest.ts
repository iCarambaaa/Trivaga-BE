import express from "express";
import AccomodationSchema from "../model/accomodation";
import DestinationSchema from "../model/destination";
import mongoose from "mongoose";

const DesRouter = express.Router();

DesRouter.route("/")
  .post(async (req, res) => {
    try {
      const alreadyHere = await DestinationSchema.find({});
      console.log(alreadyHere);
      const foundCity = alreadyHere.find(
        (destination) => destination.city === req.body.city
      );

      if (foundCity) {
        res.status(400).send({ message: "City already there" });
      } else {
        const destination = new DestinationSchema(req.body);
        if (destination) {
          await destination.save();
          res.status(201).send(destination);
        } else {
          res.status(404).send({ message: "destination not found" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  })
  .get(async (req, res) => {
    try {
      //const destinations = await DestinationSchema.find().distinct("city");
      //const destinations = await DestinationSchema.distinct("city");
      const destinations = await DestinationSchema.find({});
      if (destinations) {
        res.status(200).send(destinations);
      } else {
        res.status(404).send({ message: "Accomodation not found" });
      }
    } catch (error) {
      console.log(error);
    }
  });

DesRouter.route("/:cityId").get(async (req, res) => {
  try {
    const accomodations = await AccomodationSchema.find({
      city: req.params.cityId,
    });
    //   const bla = await DestinationSchema.find({city: req.params.cityId})

    if (accomodations) {
      res.status(200).send(accomodations);
    } else {
      res.status(404).send("VaVanCulo");
    }
  } catch (error) {
    console.log(error);
  }
});
export default DesRouter;
